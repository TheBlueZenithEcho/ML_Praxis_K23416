Đây là các bước để cài đặt "Secrets" (thông tin bí mật) của Cloudflare R2 vào dự án Supabase. Supabase Edge Function (file index.ts) sẽ đọc các secret này để tạo link upload an toàn.

Yêu cầu: Bạn phải có 4 thông tin từ "Giai đoạn 2" của file setup_cloudflare_r2.md:

R2 Account ID

R2 Access Key ID

R2 Secret Access Key

R2 Bucket Endpoint (Ví dụ: https://<account_id>.r2.cloudflarestorage.com)

Bước 1: Mở Terminal và đi đến dự án

Hãy mở terminal và cd vào thư mục dự án praxis của bạn.

Bước 2: Cài đặt Secrets (Chỉ làm 1 lần)

Chạy 4 lệnh sau. Các lệnh này sẽ lưu trữ an toàn các key của bạn trên server Supabase.

(Hãy thay thế ... bằng giá trị thật của bạn)

# 1. Endpoint của R2 (URL không có tên bucket)
supabase secrets set R2_ENDPOINT="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"

# 2. Access Key (Public)
supabase secrets set R2_ACCESS_KEY_ID="<YOUR_R2_ACCESS_KEY_ID>"

# 3. Secret Key (Bí mật)
supabase secrets set R2_SECRET_ACCESS_KEY="<YOUR_R2_SECRET_ACCESS_KEY>"

# 4. Tên Bucket (để hàm function biết)
supabase secrets set R2_BUCKET_NAME="praxis-images"


Bước 3: Deploy (Triển khai) Edge Function lần đầu

Sau khi bạn đã tạo file index.ts (ở file tiếp theo), bạn cần deploy nó lần đầu:

# Deploy function tên là 'r2-presigned-upload'
supabase functions deploy r2-presigned-upload --no-verify-jwt


Bước 4: (QUAN TRỌNG) Redeploy (Triển khai lại) khi sửa lỗi

Mỗi khi bạn thay đổi code trong file index.ts (ví dụ như khi chúng ta vừa sửa lỗi CORS), bạn phải chạy lại lệnh deploy để áp dụng thay đổi lên server:

# Chạy lại lệnh này để cập nhật bản vá CORS
supabase functions deploy r2-presigned-upload --no-verify-jwt
