Đây là hướng dẫn để chạy API Server (Flask) local, sử dụng mô hình .ckpt của bạn để tạo vector và tìm kiếm trên CSDL Supabase.

Bước 1: Cấu trúc Thư mục

Hãy đảm bảo bạn có cấu trúc thư mục như sau:

/your-api-project/
|-- app.py                   (File 2 - Server API đã sửa)
|-- lightning_clip.py        (File 3 - Định nghĩa Class Model)
|-- load_model.py            (File 4 - Hàm tải Model)
|-- requirements.txt         (File 5 - Đã thêm thư viện Supabase)
|-- .env                     (File 6 - MỚI, cho Python/Flask)
|-- model.ckpt               (File .ckpt của bạn)


Bước 2: Điền thông tin Bí mật (File .env MỚI)

Tạo file .env (File 6) và điền thông tin Supabase của bạn vào.

Bước 3: Cài đặt Thư viện

Tạo một môi trường ảo (virtual environment) và cài đặt các thư viện từ requirements.txt.

# Tạo môi trường ảo (khuyến nghị)
python3 -m venv venv
source venv/bin/activate

# Cài đặt các thư viện
pip install -r requirements.txt


Bước 4: Sửa đường dẫn Model (Nếu cần)

Mở file app.py và sửa dòng sau để trỏ đến đúng file .ckpt của bạn:

# Sửa dòng này trong app.py
MODEL_CHECKPOINT = "./model.ckpt" # <-- SỬA ĐƯỜNG DẪN NÀY


Bước 5: Chạy (Deploy) API Server

Sau khi đã cài đặt, chỉ cần chạy file app.py:

# Đảm bảo bạn đã 'source venv/bin/activate'
python3 app.py


Server của bạn sẽ khởi động tại http://localhost:5000.

Bước 6: Kiểm tra API

Kiểm tra Health (Sức khỏe):

curl http://localhost:5000/api/health


Kiểm tra Search (Tìm kiếm bằng Text):

curl -X POST http://localhost:5000/api/search \
     -H "Content-Type: application/json" \
     -d '{"text": "sofa"}'

Kiểm tra Search (Tìm kiếm bằng image):
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