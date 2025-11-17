import os
import torch
import torch.nn.functional as F
import numpy as np
import base64
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from transformers import AutoTokenizer
from torchvision import transforms as T
from dotenv import load_dotenv
from supabase import create_client, Client

# (Import các class và hàm của bạn)
from load_model import load_trained_model
from lightning_clip import LightningCLIP # Bắt buộc phải import

# --- (MỚI) Tải biến môi trường (từ file .env) ---
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- (MỚI) Khởi tạo Supabase Client ---
SUPABASE_URL = os.environ.get("SUPABASE_URL")
# (QUAN TRỌNG: Dùng SERVICE_ROLE KEY để gọi RPC an toàn)
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("LỖI: SUPABASE_URL hoặc SUPABASE_SERVICE_KEY không có trong .env")
    # sys.exit(1) # Nên dừng ở đây
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
print("Kết nối Supabase... OK")

# --- Setup Model (Giữ nguyên) ---
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

MODEL_CHECKPOINT = "./model.ckpt" # <-- SỬA ĐƯỜNG DẪN NÀY NẾU CẦN
TXT_MODEL_ID = "sentence-transformers/all-MiniLM-L6-v2"
IMG_MODEL_ID = "dinov2_vits14"
EMBED_DIM = 384

print("Loading trained model...")
model = load_trained_model(
    checkpoint_path=MODEL_CHECKPOINT,
    txt_model_id=TXT_MODEL_ID,
    img_model_id=IMG_MODEL_ID,
    embed_size=EMBED_DIM,
    device=device
)
print("Model loaded successfully!")

tokenizer = AutoTokenizer.from_pretrained(TXT_MODEL_ID)
image_transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# --- (XÓA) Không cần 'product_embeddings_cache' ---
# --- (XÓA) Không cần 'get_products()' ---
# --- (XÓA) Không cần 'compute_product_embedding()' ---


@app.route('/api/search', methods=['POST'])
def search_products():
    try:
        data = request.get_json()
        text_query = data.get('text', '').strip()
        image_base64 = data.get('image', None)
        
        # (MỚI) Lấy các tham số cho RPC
        match_count = data.get('match_count', 10)
        match_threshold = data.get('match_threshold', 0.5) # Ngưỡng tương đồng

        query_embeddings = []

        # 1. Encode text query (Giữ nguyên)
        if text_query:
            print("Đang tạo text embedding...")
            text_inputs = tokenizer(
                text_query, return_tensors="pt", padding=True, 
                truncation=True, max_length=80
            ).to(device)
            with torch.no_grad():
                text_emb = model.encode_text(text_inputs)
                query_embeddings.append(text_emb.cpu().numpy())


        # 2. Encode image query (Giữ nguyên)
        if image_base64:
            print("Đang tạo image embedding...")
            if ',' in image_base64:
                image_base64 = image_base64.split(',')[1]
            image_data = base64.b64decode(image_base64)
            image = Image.open(io.BytesIO(image_data)).convert('RGB')
            image_tensor = image_transform(image).unsqueeze(0).to(device)
            with torch.no_grad():
                image_emb = model.encode_image(image_tensor)
                query_embeddings.append(image_emb.cpu().numpy())

        # 3. Nếu không có query, báo lỗi
        if not query_embeddings:
            return jsonify({'success': False, 'error': 'No query provided (text or image)'}), 400

        # 4. Combine embeddings (Giữ nguyên)
        query_embedding_np = np.mean(query_embeddings, axis=0)
        query_embedding_np = query_embedding_np / np.linalg.norm(query_embedding_np)
        
        # Chuyển sang Python list (Postgres cần list, không phải numpy array)
        query_vector = query_embedding_np.flatten().tolist() 

        # --- (SỬA LẠI HOÀN TOÀN BƯỚC 5 & 6) ---
        
        # 5. GỌI SUPABASE RPC
        # (Kiểm tra xem CSDL của bạn dùng EMBED_DIM (64) hay 384?)
        # (Nếu CSDL là 384, model.ckpt của bạn (64-dim) sẽ thất bại)
        # (Giả sử CSDL và model.ckpt đều là 64-dim)
        print(f"Đang gọi RPC 'search_products_by_image' (dim={len(query_vector)})...")
        
        rpc_params = {
            'p_query_embedding': query_vector,
            'p_match_threshold': match_threshold,
            'p_match_count': match_count
        }
        try:
            response = supabase.rpc('search_products_by_image', rpc_params).execute()
            
            # Sau khi .execute(), nếu không có lỗi nào được ném ra, ta giả định thành công
            # Tuy nhiên, nếu hàm RPC trả về một mảng rỗng [] khi thất bại (do logic SQL), 
            # chúng ta vẫn cần kiểm tra .data
            if response.data is None:
                # Nếu không có data, có thể là lỗi cấu hình RPC
                raise Exception("RPC returned no data. Check SQL function name and parameters.")
                
        except Exception as e:
            # Bắt bất kỳ lỗi nào được ném ra (PostgrestAPIError, v.v.)
            raise Exception(f"Lỗi RPC Supabase: {str(e)}")
        # Gọi hàm RPC bạn đã tạo (ví dụ: 'search_products_by_image')
        # (Lưu ý: Tên hàm RPC phải khớp với file ..._create_demo_vector_search.sql
        # hoặc ..._update_rpc_search_by_image.sql)
        return jsonify({
            'success': True,
            'products': response.data, # Dữ liệu JSON trả về từ hàm RPC
            'query_info': {
                'has_text': bool(text_query),
                'has_image': bool(image_base64),
                'total_results': len(response.data)
            }
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    # (MỚI) Kiểm tra nhanh kết nối Supabase
    sb_status = 'disconnected'
    try:
        # Thử gọi 1 bảng CSDL (ví dụ: 'roles')
        res = supabase.from_('roles').select('id').limit(1).execute()
        if res.data is not None:
             sb_status = 'connected'
    except Exception as e:
        print(f"Health check Supabase failed: {e}")
        
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'supabase_status': sb_status,
        'device': device
    })


if __name__ == '__main__':
    # Chạy trên 0.0.0.0 để có thể truy cập từ máy khác trong mạng LAN
    app.run(host='0.0.0.0', port=5000, debug=False)