import torch
import torch.nn as nn
import torch.nn.functional as F
import lightning.pytorch as pl
from transformers import AutoModel

# Tái tạo lại class 'LightningCLIP' (hay 'NanoCLIP')
# dựa trên các tham số trong code 'train.py' và 'load_model.py'
class LightningCLIP(pl.LightningModule):
    def __init__(
        self,
        txt_model: str,
        img_model: str,
        embed_size: int,
        unfreeze_n_blocks: int = 4,
        lr: float = 1e-4,
        weight_decay: float = 4e-4,
        warmup_epochs: int = 5,
        milestones: list = [10, 20, 30],
        lr_mult: float = 0.1,
    ):
        super().__init__()
        self.save_hyperparameters() # Lưu hparams

        # 1. Tải Text Model
        self.text_model = AutoModel.from_pretrained(txt_model)
        
        # 2. Tải Image Model (DINOv2)
        # (Cảnh báo: DINOv2 không phải là 'timm' model, nó là 'transformers' model)
        # Giả sử img_model là "dinov2_vits14"
        if img_model == "dinov2_vits14":
            dino_model_id = "facebook/dinov2-small"
            img_embed_dim = 384 # DINOv2-small là 384
        elif img_model == "dinov2_vitb14":
            dino_model_id = "facebook/dinov2-base"
            img_embed_dim = 768
        else:
            raise ValueError(f"Unknown img_model: {img_model}")
            
        self.image_model = AutoModel.from_pretrained(dino_model_id)

        # Đóng băng (freeze) các layers
        self._freeze_layers(self.text_model, unfreeze_n_blocks)
        self._freeze_layers(self.image_model, unfreeze_n_blocks)

        # 3. Tạo các lớp Projection (Ánh xạ)
        # Lấy text hidden size (ví dụ: all-MiniLM-L6-v2 là 384)
        txt_embed_dim = self.text_model.config.hidden_size 
        
        self.txt_projection = nn.Linear(txt_embed_dim, embed_size, bias=False)
        self.img_projection = nn.Linear(img_embed_dim, embed_size, bias=False)
        
        # Logit scale (tham số quan trọng của CLIP)
        self.logit_scale = nn.Parameter(torch.ones([]) * 2.6592) # (Giá trị log(1/0.07) của CLIP)

    def _freeze_layers(self, model, unfreeze_n_blocks):
        # Đóng băng tất cả
        for param in model.parameters():
            param.requires_grad = False
        
        # Mở băng N blocks cuối
        if unfreeze_n_blocks > 0 and hasattr(model, 'encoder'): # Cho BERT-like
            layers = model.encoder.layer
            for layer in layers[-unfreeze_n_blocks:]:
                for param in layer.parameters():
                    param.requires_grad = True
        elif unfreeze_n_blocks > 0 and hasattr(model, 'transformer'): # Cho Albert
             layers = model.transformer.layer_group[0].layer
             for layer in layers[-unfreeze_n_blocks:]:
                for param in layer.parameters():
                    param.requires_grad = True
        elif unfreeze_n_blocks > 0 and hasattr(model, 'embeddings'): # Cho DINOv2
            # Mở băng N blocks cuối của DINO
            layers = model.encoder.layer
            for layer in layers[-unfreeze_n_blocks:]:
                 for param in layer.parameters():
                    param.requires_grad = True
            # Cũng mở băng 'layernorm'
            for param in model.layernorm.parameters():
                param.requires_grad = True

    # --- (MỚI) HÀM QUAN TRỌNG CHO app.py ---
    
    def encode_text(self, text_inputs):
        # Lấy features từ text model
        text_outputs = self.text_model(**text_inputs)
        # Lấy [CLS] token embedding (hoặc mean pooling)
        # all-MiniLM dùng mean pooling
        last_hidden_state = text_outputs.last_hidden_state
        attention_mask = text_inputs['attention_mask']
        mean_emb = self.mean_pooling(last_hidden_state, attention_mask)
        # Chiếu (project)
        text_features = self.txt_projection(mean_emb)
        return F.normalize(text_features, p=2, dim=-1)

    def encode_image(self, image_inputs):
        # Lấy features từ image model
        image_outputs = self.image_model(pixel_values=image_inputs)
        # DINOv2 dùng pooler_output (đã là [CLS] token)
        image_emb = image_outputs.pooler_output
        # Chiếu (project)
        image_features = self.img_projection(image_emb)
        return F.normalize(image_features, p=2, dim=-1)

    # Helper function cho Sentence Transformers
    def mean_pooling(self, model_output, attention_mask):
        token_embeddings = model_output
        input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
        sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
        sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
        return sum_embeddings / sum_mask
    
    # --- CÁC HÀM CẦN THIẾT CHO LIGHTNING (ĐỂ LOAD) ---
    def forward(self, batch):
        # Logic tính loss (không cần cho 'app.py' nhưng cần để load)
        pass

    def training_step(self, batch, batch_idx):
        pass

    def configure_optimizers(self):
        # (Phải định nghĩa để 'load_from_checkpoint' hoạt động)
        optimizer = torch.optim.AdamW(
            self.parameters(), 
            lr=self.hparams.lr, 
            weight_decay=self.hparams.weight_decay
        )
        scheduler = torch.optim.lr_scheduler.MultiStepLR(
            optimizer, 
            milestones=self.hparams.milestones, 
            gamma=self.hparams.lr_mult
        )
        return [optimizer], [scheduler]