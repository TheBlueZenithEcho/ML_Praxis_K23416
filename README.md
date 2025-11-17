# ML_Praxis_K23416
Praxis: An AI-powered web platform for interior designers to manage catalogs, create mood boards, and collaborate with clients.

Đây là hướng dẫn để chạy API Server (Flask) local, sử dụng mô hình `.ckpt` để tạo vector và tìm kiếm trên CSDL Supabase.

Mở thư mục `backend` bằng một cửa sổ mới và thực hiện lần lượt các bước sau:

## Bước 1: Cấu trúc Thư mục
Hãy đảm bảo bạn có cấu trúc thư mục như sau:

```text
/your-api-project/      (Thư mục gốc của ứng dụng Flask API)
├── app.py              (Server API: Chạy server Flask, xử lý /api/search, tạo embeddings)
├── lightning_clip.py   (Model Definition: Định nghĩa lớp LightningCLIP)
├── load_model.py       (Model Loader: Chứa hàm helper để tải mô hình từ .ckpt)
├── requirements.txt    (Dependencies: Danh sách thư viện Python)
├── .env                (Cấu hình: Chứa SUPABASE_URL, SUPABASE_SERVICE_KEY)
└── model.ckpt          (Model Weights: File checkpoint của mô hình)
```
## Bước 2: Điền thông tin Bí mật (File .env)
Tạo một file mới tên là .env trong thư mục backend. Điền thông tin Supabase vào

## Bước 3: Cài đặt Thư viện
Tạo một môi trường ảo (virtual environment) và cài đặt các thư viện từ requirements.txt.

1. Tạo và kích hoạt môi trường ảo (khuyến nghị):

# Tạo môi trường ảo
```python -m venv venv```

# Kích hoạt (trên Windows)
```venv\Scripts\activate```

2. Cài đặt các thư viện:

```pip install -r requirements.txt```

## Bước 4: Sửa đường dẫn Model (Nếu cần)
Mở file app.py và kiểm tra lại dòng sau để đảm bảo nó trỏ đến đúng file .ckpt của bạn.

# Sửa dòng này trong app.py
```MODEL_CHECKPOINT = "./model.ckpt" # <-- Đảm bảo đường dẫn này đúng```

## Bước 5: Chạy API Server (Backend)
Sau khi đã cài đặt, bạn chỉ cần chạy file app.py. (Lưu ý: Đảm bảo bạn đã kích hoạt môi trường ảo venv\Scripts\activate trước khi chạy)

```python app.py```
Server Flask sẽ khởi động, và nó sẽ tự động gọi load_model.py để tải mô hình.

## Bước 6: Chạy giao diện (Frontend)
Tạo file .env trong thư mục frontend và điền thông tin Supabase (tương tự Bước 2, nhưng là cho frontend).

Mở một Terminal mới (để terminal kia chạy backend).

Di chuyển vào thư mục frontend và cài đặt:

```
cd frontend
npm install
```
Khởi động server frontend:
```
npm run dev
```
## Bước 7: Kiểm tra Search
Khi chạy npm run dev thành công, terminal sẽ cung cấp cho bạn một link localhost (ví dụ: http://localhost:5173/). Mở link này trên trình duyệt để xem giao diện và kiểm tra.

# Các lưu ý quan trọng
1. Phải có file .env chứa thông tin Supabase trong thư mục backend.

2. Phải có file .env chứa thông tin Supabase trong thư mục frontend.

3. Việc chạy backend và frontend phải song song với nhau. Bạn cần mở 2 terminal: một cho python app.py (backend) và một cho npm run dev (frontend).
