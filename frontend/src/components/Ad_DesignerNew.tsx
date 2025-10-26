import React, { useState, useRef } from 'react';
// Sửa import nếu bạn dùng react-router-dom v6+
import { useNavigate } from 'react-router';
import { TextField, Button, Avatar, CircularProgress } from '@mui/material';

// --- API URLs ---
// (1) API Giả lập (không dùng cho POST)
// (2) API Thật (comment lại - URL để tạo user/designer)
// const REAL_API_BASE_URL = 'https://your-real-backend.com'; // !!! THAY BẰNG API THẬT CỦA BẠN !!!
// const REAL_API_CREATE_ENDPOINT = `${REAL_API_BASE_URL}/users`; // Hoặc /designers tùy backend
// const REAL_API_UPLOAD_ENDPOINT = `${REAL_API_BASE_URL}/upload/avatar`; // Ví dụ endpoint upload ảnh
// -----------------

// Kiểu dữ liệu cho form (cần các trường mà API TẠO yêu cầu)
type NewDesignerData = {
  name: string;
  email: string;
  phone: string;
  img: string;
  role: 'designer'; // Vai trò mặc định
};

const Ad_DesignerNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewDesignerData>({
    name: '', email: '', phone: '', img: '', role: 'designer'
  });
  const [loading, setLoading] = useState(false);

   // State cho việc upload ảnh
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref đến input file ẩn

  // Xử lý thay đổi input trong form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Xử lý khi người dùng chọn file ảnh
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setSelectedFile(file); // Lưu file đã chọn
          // Tạo URL xem trước
          const reader = new FileReader();
          reader.onloadend = () => setPreviewUrl(reader.result as string); // Cập nhật ảnh xem trước
          reader.readAsDataURL(file);
      } else {
          // Reset nếu người dùng hủy chọn
          setSelectedFile(null);
          setPreviewUrl(null);
      }
  };
   // Kích hoạt input file ẩn khi nhấn nút
   const handleUploadButtonClick = () => fileInputRef.current?.click();

  // CREATE - Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const useRealApi = false; // <<< --- Đặt thành true khi dùng API thật
    let imageUrlToSend = formData.img; // Mặc định dùng URL nhập tay

    // --- Xử lý Upload Ảnh (Nếu dùng API thật) ---
    if (selectedFile && useRealApi) {
        /* // BỎ COMMENT KHI CÓ API THẬT
         if (!REAL_API_UPLOAD_ENDPOINT) {
             alert("Lỗi: API Upload thật chưa được cấu hình.");
             return; // Dừng nếu chưa có URL upload
         }
         const imageFormData = new FormData();
         imageFormData.append('avatar', selectedFile); // Key 'avatar' phụ thuộc vào backend của bạn
         setLoading(true);
         try {
             console.log("Đang upload ảnh lên:", REAL_API_UPLOAD_ENDPOINT);
             const uploadRes = await fetch(REAL_API_UPLOAD_ENDPOINT, {
                 method: 'POST',
                 // headers: { 'Authorization': `Bearer ${token}` }, // Thêm Auth nếu cần
                 body: imageFormData
             });
             if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");
             const uploadResult = await uploadRes.json();
             imageUrlToSend = uploadResult.imageUrl; // Lấy URL ảnh đã upload từ server
             console.log("Upload ảnh thành công, URL:", imageUrlToSend);
         } catch(err) {
             console.error("Lỗi upload ảnh:", err);
             alert("Đã xảy ra lỗi khi upload ảnh.");
             setLoading(false); // Dừng loading nếu upload lỗi
             return; // Dừng không gửi tiếp form
         }
         // setLoading(false) sẽ được gọi ở khối finally của fetch tạo designer
        */
        alert("API Upload thật đang bị comment trong Ad_DesignerNew.tsx"); return;
    } else if (selectedFile && !useRealApi) {
        // Nếu đang giả lập và có chọn file, dùng ảnh xem trước
        imageUrlToSend = previewUrl || '';
        console.log("Giả lập: Sử dụng ảnh xem trước cho img:", imageUrlToSend.substring(0, 50) + "..."); // Log một phần URL base64
    }
    // ---------------------------------------------

    // --- Chuẩn bị dữ liệu gửi đi ---
    const designerDataToSend = {
        ...formData, // name, email, phone, role
        img: imageUrlToSend, // Sử dụng URL ảnh đã xử lý
        // Thêm createdAt nếu API thật yêu cầu (thường server tự tạo)
        createdAt: new Date().toLocaleDateString('en-GB').replace(/\//g,'.') // Ví dụ format 'DD.MM.YYYY'
    };
    // ----------------------------

    // --- Gửi dữ liệu Designer ---
    if (useRealApi) {
        /* // BỎ COMMENT KHI CÓ API THẬT
         if (!REAL_API_CREATE_ENDPOINT) {
            alert("Lỗi: API Tạo thật chưa được cấu hình.");
            return;
         }
         setLoading(true);
         try {
             console.log("Đang gửi POST request đến:", REAL_API_CREATE_ENDPOINT, "với data:", designerDataToSend);
             const response = await fetch(REAL_API_CREATE_ENDPOINT, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(designerDataToSend),
             });
             if (response.ok) {
                 alert("Tạo designer mới thành công!");
                 navigate('/admin_designers'); // Quay về trang danh sách designers
             } else {
                 const errorData = await response.text();
                 alert(`Tạo designer thất bại: ${response.status} ${errorData || response.statusText}`);
             }
         } catch (error) {
             console.error("Lỗi khi tạo designer:", error);
             alert("Lỗi kết nối khi tạo designer.");
         } finally {
             setLoading(false);
         }
        */
        alert("API Tạo thật đang bị comment trong Ad_DesignerNew.tsx.");

    } else {
        // (1) Giả lập (đang dùng)
        alert("Đang giả lập việc tạo designer mới...");
        console.log("Dữ liệu (giả lập) sẽ được gửi:", designerDataToSend);
        setLoading(true);
        // Chờ 1.5 giây để mô phỏng gọi API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        alert("Giả lập tạo designer thành công!");
        navigate('/admin_designers'); // Quay về trang danh sách designers
    }
    // -------------------------
  };

  return (
    // Sử dụng style nhất quán với các trang khác
    <div className='Ad_DesignerNew p-6 md:p-10 bg-[#fcfcfc] min-h-screen'>
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">Add New Designer</h1>
      {/* Chỉ báo loading nhỏ */}
      {loading && <div className="fixed top-4 right-4"><CircularProgress size={24} /></div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6">

        {/* --- Phần Ảnh --- */}
        <div className="flex flex-col items-center gap-4 border-b pb-6">
          <Avatar
             src={previewUrl || undefined} // Hiển thị ảnh xem trước
             sx={{ width: 120, height: 120, mb: 2, bgcolor: '#e0e0e0' }} // Thêm màu nền
             variant="rounded" // Hoặc circular
          >
            {!previewUrl && <span className="text-gray-500">Photo</span>} {/* Chữ thay thế */}
          </Avatar>
           {/* Input file ẩn */}
           <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*" // Chỉ chấp nhận file ảnh
              style={{ display: 'none' }}
           />
           {/* Nút chọn ảnh */}
           <Button
              variant="outlined"
              onClick={handleUploadButtonClick}
              disabled={loading}
              size="small" // Giảm kích thước nút
            >
               {selectedFile ? `Đổi ảnh: ${selectedFile.name.substring(0,20)}...` : 'CHOOSE IMAGE FROM COMPUTER'}
           </Button>
           {/* Trường nhập URL ảnh */}
           <TextField
              label="Or Enter Image URL"
              name="img"
              value={formData.img}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              disabled={loading || !!selectedFile} // Vô hiệu hóa nếu đã chọn file
              helperText={selectedFile ? "Đang sử dụng file ảnh đã chọn ở trên" : "Nhập link trực tiếp đến ảnh"}
            />
        </div>
        {/* ------------------- */}

        {/* --- Các trường thông tin --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4">
           <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required // Bắt buộc nhập
              variant="outlined"
              disabled={loading}
              InputLabelProps={{ shrink: true }} // Luôn hiển thị label
            />
           <TextField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required // Bắt buộc nhập
              variant="outlined"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
           <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
           {/* Trường Role (vô hiệu hóa, mặc định là 'designer') */}
           <TextField
              label="Role"
              name="role"
              value={formData.role}
              fullWidth
              disabled // Không cho sửa vai trò ở đây
              variant="filled" // Dùng filled để thể hiện read-only
              size="small"
              InputLabelProps={{ shrink: true }}
           />
           {/* Thêm trường Password nếu cần */}
           {/*
           <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
           />
           */}
        </div>
        {/* ------------------------ */}

        {/* Nút Submit */}
        <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large" // Tăng kích thước nút
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // Thêm icon loading
            >
              {loading ? 'Đang tạo...' : 'Tạo Designer'}
            </Button>
        </div>
        {/* ------------- */}
      </form>
    </div>
  );
};

export default Ad_DesignerNew;