import torch
import sys
from lightning_clip import LightningCLIP # <-- (SỬA 1) Import class

def load_trained_model(
    checkpoint_path, 
    device='cuda',
    # Thêm các tham số này để khởi tạo class
    txt_model_id="sentence-transformers/all-MiniLM-L6-v2",
    img_model_id="dinov2_vits14",
    embed_size=384
):
    """Load model từ checkpoint"""
    
    print(f"Loading checkpoint from: {checkpoint_path}")
    
    # --- (SỬA 2) Dùng cách load_from_checkpoint của Lightning ---
    # Cách này an toàn hơn và tự động khôi phục hparams
    try:
        model = LightningCLIP.load_from_checkpoint(
            checkpoint_path,
            map_location=device,
            
            # Phải truyền lại các tham số init 
            # (vì chúng có thể không được lưu trong ckpt cũ)
            txt_model=txt_model_id,
            img_model=img_model_id,
            embed_size=embed_size
        )
    except Exception as e:
        print(f"Lỗi load_from_checkpoint (thử cách thủ công): {e}")
        # (SỬA 3) Cách thủ công (như code gốc của bạn)
        # Dùng làm dự phòng nếu 'load_from_checkpoint' thất bại
        model = LightningCLIP(
            txt_model=txt_model_id,
            img_model=img_model_id,
            embed_size=embed_size
        )
        checkpoint = torch.load(checkpoint_path, map_location=device)
        
        # Lấy state_dict, bỏ qua 'model.' prefix nếu có
        state_dict = checkpoint['state_dict']
        new_state_dict = {}
        for k, v in state_dict.items():
            if k.startswith('model.'):
                new_state_dict[k[len('model.'):]] = v
            else:
                new_state_dict[k] = v
        
        model.load_state_dict(new_state_dict, strict=False)

    model.eval()
    model.to(device)

    return model