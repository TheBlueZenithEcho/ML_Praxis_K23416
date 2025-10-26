import React, { useState, useRef } from 'react';
// Sửa import nếu bạn dùng react-router-dom v6+
import { useNavigate } from 'react-router';
import { TextField, Button, Avatar, CircularProgress, Switch, FormControlLabel } from '@mui/material';

// --- API URLs ---
// (1) API Giả lập (không dùng vì npoint không hỗ trợ POST)
// Link API bạn đang dùng để GET list (chỉ để tham khảo cấu trúc):
// https://api.npoint.io/9ff8af5e261b401bea53

// (2) API Thật (comment lại - URL để tạo product)
// const REAL_API_BASE_URL = 'https://api-backend-that.cuaban.com';
// const REAL_API_CREATE_URL = `${REAL_API_BASE_URL}/products`; // Ví dụ endpoint POST
// const REAL_API_UPLOAD_ENDPOINT = `${REAL_API_BASE_URL}/upload/product-image`; // Ví dụ endpoint upload ảnh
// -----------------

// Kiểu dữ liệu cho form (khớp API product)
type NewProductData = {
  img: string;
  name: string; // API dùng 'name'
  producer: string;
  price: string;
  inStock: boolean;
};

const Ad_ProductNew = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<NewProductData>({
    img: '', name: '', producer: '', price: '', inStock: true // Mặc định là còn hàng
  });
  const [loading, setLoading] = useState(false); // State loading cho submit

   // State cho upload ảnh
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý thay đổi form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Xử lý chọn file ảnh
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setSelectedFile(file);
          // Tạo URL xem trước
          const reader = new FileReader();
          reader.onloadend = () => setPreviewUrl(reader.result as string);
          reader.readAsDataURL(file);
      } else {
          // Reset nếu hủy chọn
          setSelectedFile(null);
          setPreviewUrl(null);
      }
  };
   // Kích hoạt input file ẩn
   const handleUploadButtonClick = () => fileInputRef.current?.click();

  // CREATE - Gửi dữ liệu sản phẩm mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const useRealApi = false; // <<< --- Đặt thành true khi bạn có API thật
    let imageUrlToSend = formData.img;

    // ----- Xử lý Upload Ảnh (Nếu dùng API thật) -----
    if (selectedFile && useRealApi) {
        /* // BỎ COMMENT KHI CÓ API THẬT
         if (!REAL_API_UPLOAD_ENDPOINT) {
             alert("Lỗi: API Upload thật chưa được cấu hình.");
             return; // Dừng nếu chưa có URL upload
         }
         const imageFormData = new FormData();
         imageFormData.append('productImage', selectedFile); // Key 'productImage' tùy theo backend của bạn
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
         // setLoading(false) sẽ được gọi ở finally của fetch tạo sản phẩm
        */
        alert("API Upload thật đang bị comment trong Ad_ProductNew.tsx"); return;
    } else if (selectedFile && !useRealApi) {
        // Nếu đang giả lập và có chọn file, dùng ảnh preview
        imageUrlToSend = previewUrl || '';
        console.log("Giả lập: Sử dụng ảnh preview cho img:", imageUrlToSend.substring(0, 50) + "..."); // Log một phần URL base64
    }
    // ----------------------------------------------

    // ----- Chuẩn bị dữ liệu gửi đi -----
    const productDataToSend = {
        name: formData.name, // API dùng 'name'
        producer: formData.producer,
        price: formData.price,
        inStock: formData.inStock,
        img: imageUrlToSend, // URL ảnh đã xử lý
        // Thêm createdAt nếu API thật yêu cầu (nhưng thường server tự tạo)
        createdAt: new Date().toLocaleDateString('en-GB').replace(/\//g,'.') // Ví dụ format 'DD.MM.YYYY' cho khớp API
    };
    // ----------------------------------

    // ----- Gửi dữ liệu sản phẩm -----
    if (useRealApi) {
        /* // BỎ COMMENT KHI CÓ API THẬT
         if (!REAL_API_CREATE_URL) {
            alert("Lỗi: API Tạo sản phẩm thật chưa được cấu hình.");
            return;
         }
         setLoading(true);
         try {
             console.log("Đang gửi POST request đến:", REAL_API_CREATE_URL, "với data:", productDataToSend);
             const response = await fetch(REAL_API_CREATE_URL, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(productDataToSend),
             });
             if (response.ok) {
                 alert("Tạo sản phẩm mới thành công!");
                 navigate('/admin_products'); // Quay về trang danh sách
             } else {
                 const errorData = await response.text();
                 alert(`Tạo sản phẩm thất bại: ${response.status} ${errorData || response.statusText}`);
             }
         } catch (error) {
             console.error("Lỗi khi tạo sản phẩm:", error);
             alert("Lỗi kết nối khi tạo sản phẩm.");
         } finally {
             setLoading(false);
         }
        */
        alert("API Tạo SP thật đang bị comment trong Ad_ProductNew.tsx.");

    } else {
        // (1) Giả lập (đang dùng)
        alert("Đang giả lập việc tạo sản phẩm...");
        console.log("Dữ liệu (giả lập) sẽ được gửi:", productDataToSend);
        setLoading(true);
        // Chờ 1.5 giây để mô phỏng gọi API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        alert("Giả lập tạo sản phẩm thành công!");
        navigate('/admin_products'); // Quay về trang danh sách sản phẩm
    }
    // ----------------------------
  };

  return (
    <div className='Ad_ProductNew p-6 md:p-10 bg-[#fcfcfc] min-h-screen'> {/* Thêm class nền và padding */}
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">Add New Product</h1>
      {/* Thêm hiệu ứng loading nhỏ khi đang submit */}
      {loading && <div className="fixed top-4 right-4"><CircularProgress size={24} /></div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-6">

        {/* --- Phần Ảnh --- */}
        <div className="flex flex-col items-center gap-4 border-b pb-6">
          <Avatar
             src={previewUrl || undefined} // Hiển thị ảnh preview
             sx={{ width: 150, height: 150, bgcolor: '#e0e0e0' }} // Thêm màu nền cho Avatar
             variant="rounded" // Hoặc square
          >
            {!previewUrl && <span className="text-gray-500">Image</span>} {/* Placeholder text */}
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
               {selectedFile ? `Change Image: ${selectedFile.name.substring(0,20)}...` : 'Choose Image from Computer'}
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
              helperText={selectedFile ? "Using image file selected above" : "Enter a direct link to an image"}
            />
        </div>
        {/* ---------------- */}

        {/* --- Các trường thông tin --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4"> {/* Tăng gap */}
           <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              disabled={loading}
              InputLabelProps={{ shrink: true }} // Luôn hiển thị label
            />
           <TextField
              label="Producer"
              name="producer"
              value={formData.producer}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
           <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              disabled={loading}
              InputLabelProps={{ shrink: true }}
              // Optional: Thêm InputAdornment cho đơn vị tiền tệ
              // InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
           {/* Switch In Stock */}
           <FormControlLabel
              control={
                  <Switch
                      checked={formData.inStock}
                      onChange={handleChange}
                      name="inStock"
                      disabled={loading}
                  />
                }
              label="In Stock"
              className="text-gray-700 md:col-span-2 justify-self-start" // Căn lề trái
              sx={{ marginTop: 1 }} // Thêm margin top
          />
        </div>
        {/* ------------------------- */}

        {/* Nút Submit */}
        <div className="flex justify-end pt-4"> {/* Thêm padding top */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large" // Tăng kích thước nút
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // Thêm icon loading
            >
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
        </div>
        {/* ----------- */}
      </form>
    </div>
  );
};

export default Ad_ProductNew;