Đây là hướng dẫn để chạy API Server (Flask) local, sử dụng mô hình .ckpt để tạo vector và tìm kiếm trên CSDL Supabase.

# Bước 1: Cấu trúc Thư mục

Hãy đảm bảo bạn có cấu trúc thư mục như sau:
| Tên Tệp/Đường dẫn | Vai trò chính |
| :--- | :--- |
| **`/your-api-project/`** | **Thư mục gốc** của ứng dụng Flask API. |
| ├── **`app.py`** | **(Server API)** File chính chạy server Flask, xử lý các yêu cầu tìm kiếm (`/api/search`), tạo embeddings và gọi hàm RPC Supabase. |
| ├── **`lightning_clip.py`** | **(Model Definition)** Định nghĩa lớp **`LightningCLIP`** cần thiết để tải checkpoint và thực hiện forward pass. |
| ├── **`load_model.py`** | **(Model Loader)** Chứa hàm helper để tải mô hình đã huấn luyện từ file `.ckpt`. |
| ├── **`requirements.txt`** | **(Dependencies)** Danh sách các thư viện Python cần thiết cho môi trường (`flask`, `supabase`, `torch`, v.v.). |
| ├── **`.env`** | **(Cấu hình)** Chứa các biến môi trường nhạy cảm như `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`. **Nên loại trừ khỏi Git.** |
| └── **`model.ckpt`** | **(Model Weights)** File checkpoint chứa trọng số cuối cùng của mô hình đã được fine-tune. |

# Bước 2: Điền thông tin Bí mật (File .env MỚI)

Tạo file .env và điền thông tin Supabase vào.

# Bước 3: Cài đặt Thư viện

Tạo một môi trường ảo (virtual environment) và cài đặt các thư viện từ requirements.txt.

## Tạo môi trường ảo (khuyến nghị)
```
python3 -m venv venv
source venv/bin/activate
```

## Cài đặt các thư viện
``
pip install -r requirements.txt
``

# Bước 4: Sửa đường dẫn Model (Nếu cần)

Mở file app.py và sửa dòng sau để trỏ đến đúng file .ckpt

## Sửa dòng này trong app.py
```py
MODEL_CHECKPOINT = "./model.ckpt" # <-- SỬA ĐƯỜNG DẪN NÀY
```

# Bước 5: Chạy (Deploy) API Server

Sau khi đã cài đặt, chỉ cần chạy file app.py:
Đảm bảo bạn đã 'source venv/bin/activate'
```bash
python3 app.py
```

Server sẽ khởi động tại http://localhost:5000.

# Bước 6: Kiểm tra API

## Kiểm tra Health (Sức khỏe):
```bash
curl http://localhost:5000/api/health
```

## Kiểm tra Search (Tìm kiếm bằng Text):
```bash
curl -X POST http://localhost:5000/api/search \
     -H "Content-Type: application/json" \
     -d '{"text": "sofa"}'
```
## Kiểm tra Search (Tìm kiếm bằng image):
```bash
IMAGE_PATH="00293772.jpg"
IMAGE_BASE64=$(base64 "$IMAGE_PATH" | tr -d '\n')
# Gửi yêu cầu POST kết hợp Image Base64 và Text
curl -X POST http://localhost:5000/api/search \
     -H "Content-Type: application/json" \
     -d "{
           \"text\": \"Modern velvet armchair\",
           \"image\": \"$IMAGE_BASE64\",
           \"match_count\": 5
         }"
```
Gửi yêu cầu POST kết hợp Image Base64 và Text
```bash
curl -X POST http://localhost:5000/api/search \
     -H "Content-Type: application/json" \
     -d "{
           \"text\": \"Modern velvet armchair\",
           \"image\": \"$IMAGE_BASE64\",
           \"match_count\": 5
         }"
```