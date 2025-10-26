import React, { useState, useEffect, useRef } from 'react';
// Sửa import nếu bạn dùng react-router-dom v6+
import { useParams, useNavigate } from 'react-router';
import { TextField, Button, Avatar, CircularProgress, Switch, FormControlLabel, Chip } from '@mui/material';

// --- API URLs ---
// (1) API Giả lập (đang dùng để lấy list)
const MOCK_API_GET_LIST_URL = 'https://api.npoint.io/9ff8af5e261b401bea53'; // API Products của bạn

// (2) API Thật (comment lại - Dùng cho Update/Delete/Upload)
// const REAL_API_BASE_URL = 'https://api-backend-that.cuaban.com';
// const REAL_API_PRODUCT_ENDPOINT = `${REAL_API_BASE_URL}/products`; // Ví dụ
// const REAL_API_UPLOAD_ENDPOINT = `${REAL_API_BASE_URL}/upload/product-image`; // Ví dụ
// -----------------

// Kiểu dữ liệu (khớp với API ...bea53)
type ProductProfileType = {
  id: string | number;
  img: string;
  name: string; // Đổi từ 'title'
  producer: string;
  price: string;
  createdAt: string;
  inStock?: boolean;
};

const ProductProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho upload ảnh
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- READ ---
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) { setError("ID sản phẩm bị thiếu."); setLoading(false); return; }
      try {
        setLoading(true); setError(null);

        const response = await fetch(MOCK_API_GET_LIST_URL);
        if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm');
        // API của bạn trả về mảng trực tiếp, không cần map title -> name
        const productList: ProductProfileType[] = await response.json();

        const productIdNumber = parseInt(id, 10);
        const foundProduct = productList.find(p => Number(p.id) === productIdNumber);

        if (foundProduct) {
            setProduct(foundProduct);
            setPreviewUrl(foundProduct.img);
        } else {
            setError(`Không tìm thấy sản phẩm với ID: ${id}`); setProduct(null);
        }

      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Xử lý thay đổi form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (product) {
        setProduct({
            ...product,
            [name]: type === 'checkbox' ? checked : value
        });
    }
  };

  // --- Xử lý Upload Ảnh ---
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onloadend = () => setPreviewUrl(reader.result as string);
          reader.readAsDataURL(file);
      } else {
          setSelectedFile(null);
          setPreviewUrl(product?.img || null);
      }
  };
  const handleUploadButtonClick = () => fileInputRef.current?.click();

  // Hàm Upload lên server (phân biệt thật/giả)
  const handleUploadConfirm = async () => {
      if (!selectedFile || !product) return alert("Vui lòng chọn ảnh.");
      const useRealApi = false; // Đặt true khi dùng API thật
      if (useRealApi) {
        /* // (2) Code thật (comment lại)
          if (!REAL_API_UPLOAD_ENDPOINT) return alert("Lỗi: URL API Upload thật chưa cấu hình.");
          // ... (code upload FormData) ...
        */
         alert("API Upload thật đang bị comment.");
      } else {
          // (1) Giả lập
          alert("Mock API upload simulation."); setLoading(true);
          await new Promise(r => setTimeout(r, 1500)); setLoading(false);
          alert("Mock upload success! (Ảnh chỉ cập nhật tạm thời)");
      }
  };
  // Hàm xóa ảnh (phân biệt thật/giả)
  const handleDeletePhoto = () => {
      const useRealApi = false; // Đặt true khi dùng API thật
      if(window.confirm("Xóa ảnh sản phẩm?")) {
           if(useRealApi) { /* // Code API thật */ alert("API thật đang bị comment."); }
           else {
                // Giả lập
                setPreviewUrl(null); setSelectedFile(null);
                if(product) setProduct({...product, img: ''});
                alert("Giả lập xóa ảnh! Nhấn 'Save Changes' để lưu (nếu có API thật).");
           }
      }
  };
  // -------------------------


  // --- UPDATE --- (Phân biệt API thật/giả)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!product) return;
    const useRealApi = false; // Đặt true khi dùng API thật

    const productDataToSend = {
        ...product, // Gửi tất cả các trường hiện có trong state
        // Không cần đổi name thành title vì API mới đã dùng name
        inStock: product.inStock ?? false // Đảm bảo boolean
    };

    if (useRealApi) {
        /* // (2) Code thật (comment lại)
         if (!REAL_API_PRODUCT_ENDPOINT) return alert("Lỗi: URL API thật chưa cấu hình.");
         // ... (code fetch PUT) ...
        */
        alert("API thật đang bị comment.");
    } else {
        // (1) Giả lập
        alert("Mock API update simulation."); setLoading(true);
        console.log("Dữ liệu (giả lập) gửi đi:", productDataToSend);
        await new Promise(r => setTimeout(r, 1000)); setLoading(false);
        alert("Mock update success!");
    }
  };

  // --- DELETE --- (Phân biệt API thật/giả)
  const handleDeleteProduct = async () => {
      if (!product) return;
      if (window.confirm(`Xóa sản phẩm "${product.name}" (ID: ${id})?`)) {
          const useRealApi = false; // Đặt true khi dùng API thật
          if (useRealApi) { /* // Code API thật */ alert("API thật đang bị comment."); }
          else {
              // (1) Giả lập
              alert("Mock API delete simulation."); setLoading(true);
              await new Promise(r => setTimeout(r, 1000)); setLoading(false);
              alert("Mock delete success!");
              navigate('/admin_products');
          }
      }
  };

  // Loading/Error/Not Found states
  if (loading && !product) return <div className="center-screen"><CircularProgress /></div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!product) return <div className="p-8 text-orange-500 text-center">Product ID not found: {id}</div>;

  // --- RETURN JSX ---
  return (
    <div className="p-6 md:p-10 bg-[#fcfcfc] min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Product Details</h1>
      {loading && <div className="fixed top-4 right-4"><CircularProgress size={24} /></div>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header: Ảnh, Tên, Buttons */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6 mb-6">
          <img
            src={previewUrl || '/placeholder-image.png'}
            alt={product.name}
            className="w-32 h-32 object-contain border rounded bg-gray-100"
          />
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-gray-600">Producer: {product.producer}</p>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date(product.createdAt).toLocaleDateString()}
            </p>
             <Chip
                label={product.inStock ? "In Stock" : "Out of Stock"}
                color={product.inStock ? "success" : "default"}
                size="small"
                className="mt-2"
             />
          </div>
          {/* Nút Upload/Delete Ảnh */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
             <Button variant="contained" sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' } }} onClick={handleUploadButtonClick} disabled={loading}>
                 {selectedFile ? 'Change Photo' : 'Upload New Photo'}
             </Button>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
             <Button variant="outlined" color="error" onClick={handleDeletePhoto} disabled={loading}>Delete Photo</Button>
           </div>
        </div>

         {/* Nút xác nhận Upload */}
        {selectedFile && (
            <div className="mb-6 flex justify-center md:justify-start">
                <Button variant="contained" color="secondary" onClick={handleUploadConfirm} disabled={loading} size="small">
                    Confirm Upload: {selectedFile.name}
                </Button>
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TextField label="Product Name" name="name" value={product.name} onChange={handleChange} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading}/>
             <TextField label="Producer" name="producer" value={product.producer} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <TextField label="Price" name="price" value={product.price} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading}/>
             <TextField label="Created At" value={new Date(product.createdAt).toLocaleString()} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }}/>
          </div>

           {/* Trường In Stock */}
          <FormControlLabel
              control={ <Switch checked={product.inStock ?? false} onChange={handleChange} name="inStock" disabled={loading}/> }
              label="In Stock" className="text-gray-700"
          />

          {/* Buttons Save/Delete */}
          <div className="flex justify-end gap-4 pt-4">
             <Button variant="contained" color="primary" type="submit" disabled={loading}>
                 {loading ? 'Saving...' : 'Save Changes'}
             </Button>
              <Button variant="outlined" color="error" onClick={handleDeleteProduct} disabled={loading}>
                  Delete Product
              </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// CSS (giữ nguyên)
const styles = `
.center-screen { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default ProductProfile;