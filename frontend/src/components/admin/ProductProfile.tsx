import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Avatar, CircularProgress, Switch, FormControlLabel, Chip } from '@mui/material';
import { supabase } from '../../lib/supabaseClient'; // Đảm bảo đường dẫn này đúng

// Type này đã khớp với hàm get_product_by_id (đã bao gồm category_id)
type ProductProfileType = {
  id: string; // uuid (variant_id)
  sku: string | null;
  name: string | null;
  description: string | null;
  images: string[] | null;
  thumbnailImage: string | null;

  brand: string | null;
  category: string | null;    // TÊN category
  category_id?: string | null; // ID (Hàm 'get' của bạn BẮT BUỘC phải trả về cái này)

  price: string | null;
  stock: number | null; // <-- SQL 'get' trả về tên 'stock'
  isAvailable: boolean | null;
  currency: string | null;
  createdAt: string;
  updatedAt: string;
};

const ProductProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State ảnh (Giữ nguyên)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- READ (Dùng get_product_by_id) ---
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) { setError("ID sản phẩm bị thiếu."); setLoading(false); return; }
      try {
        setLoading(true); setError(null);

        // 1. Gọi hàm RPC (Đã đúng)
        const { data, error } = await supabase.rpc('get_product_by_id', {
          p_variant_id: id
        });

        // Thêm console.log(data) để kiểm tra
        console.log("Dữ liệu nhận được từ get_product_by_id:", data);

        if (error) throw error;

        // 2. Gán dữ liệu
        if (data) {
          const foundProduct = data as ProductProfileType;
          setProduct(foundProduct);
          setPreviewUrl(foundProduct.thumbnailImage);

          // Cảnh báo nếu hàm GET (SQL) của bạn vẫn thiếu 'category_id'
          if (!foundProduct.category_id) {
            console.warn("Dữ liệu trả về thiếu 'category_id'. Việc Update Category sẽ thất bại.");
          }
        } else {
          setError(`Không tìm thấy sản phẩm với ID: ${id}`);
        }
      } catch (err: any) {
        console.error("Lỗi khi fetch sản phẩm:", err);
        setError(err.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // --- Xử lý thay đổi form (Đã đúng) ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (product) {
      setProduct({
        ...product,
        // Map tên 'stock'
        [name]: type === 'checkbox' ? checked : (name === 'stock' ? parseInt(value) || 0 : value)
      });
    }
  };

  // --- Logic Upload Ảnh (Giữ nguyên Mock) ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(product?.thumbnailImage || null);
    }
  };
  const handleUploadButtonClick = () => fileInputRef.current?.click();
  const handleUploadConfirm = async () => { alert("Mock upload success!"); };
  const handleDeletePhoto = () => {
    if (window.confirm("Xóa ảnh sản phẩm? (Giả lập)")) {
      setPreviewUrl(null); setSelectedFile(null);
      if (product) setProduct({ ...product, thumbnailImage: '' });
      alert("Giả lập xóa ảnh!");
    }
  };
  // -------------------------

  // --- UPDATE (Khớp với SQL 'update_product_admin') ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!product) return;

    // Cảnh báo nếu category_id bị thiếu (vì hàm GET không trả về)
    if (!product.category_id) {
      alert("Lỗi: Không tìm thấy Category ID. Không thể cập nhật Category.\n\nVui lòng sửa hàm 'get_product_by_id' trong SQL để trả về 'cat.id AS category_id'.");
      return; // Dừng lại
    }

    const productDataToSend = {
      p_variant_id: product.id,
      p_name: product.name,
      p_sku: product.sku,
      p_price: product.price,
      p_stock_qty: product.stock, // Map 'stock' -> 'p_stock_qty'
      p_description: product.description,
      p_brand: product.brand,
      p_category_id: product.category_id
    };

    setLoading(true);
    try {
      // Gọi hàm 'update_product_admin' (Đã đúng)
      const { data, error } = await supabase.rpc('update_product_admin', productDataToSend);
      if (error) throw error;
      alert("Cập nhật sản phẩm thành công!");

    } catch (err: any) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      alert("Lỗi khi cập nhật: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE (Khớp với SQL 'delete_product_admin') ---
  const handleDeleteProduct = async () => {
    if (!product) return;
    if (window.confirm(`Xóa sản phẩm "${product.name}" (ID: ${id})?`)) {
      setLoading(true);
      try {
        // Gọi hàm 'delete_product_admin' (Đã đúng)
        const { error } = await supabase.rpc('delete_product_admin', {
          p_variant_id: product.id
        });
        if (error) throw error;
        alert("Xóa sản phẩm thành công!");
        navigate('/admin_products');
      } catch (err: any) {
        console.error("Lỗi khi xóa:", err);
        alert("Lỗi khi xóa: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Loading/Error states
  if (loading && !product) return <div className="center-screen"><CircularProgress /></div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;
  if (!product) return <div className="p-8 text-orange-500 text-center">Product ID not found: {id}</div>;

  // --- RETURN JSX (Code này KHÔNG hiển thị ô Category ID) ---
  return (
    <div className="p-6 h-sc md:p-10 bg-[#FFFFFF]">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">Product Details</h1>
      {loading && <div className="fixed top-4 right-4"><CircularProgress size={24} /></div>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6 mb-6">
          <img
            src={previewUrl || '/placeholder-image.png'}
            alt={product.name || 'Sản phẩm'}
            className="w-32 h-32 object-contain border rounded bg-gray-100"
          />
          <div className="text-center md:text-left flex-grow">
            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-gray-600">Brand: {product.brand}</p>
            <p className="text-sm text-gray-500 mt-2">
              Created: {new Date(product.createdAt).toLocaleDateString()}
            </p>
            <Chip
              label={product.isAvailable ? "In Stock" : "Out of Stock"}
              color={product.isAvailable ? "success" : "default"}
              size="small"
              className="mt-2"
            />
          </div>
          {/* Nút Upload/Delete Ảnh (Giữ nguyên) */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Button variant="contained" sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' } }} onClick={handleUploadButtonClick} disabled={loading}>
              {selectedFile ? 'Change Photo' : 'Upload New Photo'}
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            <Button variant="outlined" color="error" onClick={handleDeletePhoto} disabled={loading}>Delete Photo</Button>
          </div>
        </div>

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
            <TextField label="Product Name" name="name" value={product.name || ''} onChange={handleChange} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />
            <TextField label="SKU" name="sku" value={product.sku || ''} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Brand" name="brand" value={product.brand || ''} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} helperText="Brand (text)" />
            {/* Đây là ô bạn muốn: Chỉ hiển thị tên Category (không cho sửa) */}
            <TextField
              label="Category"
              name="category"
              value={product.category || 'N/A'}
              fullWidth
              variant="filled" // Kiểu 'filled'
              InputLabelProps={{ shrink: true }}
              disabled={true} // <-- KHÓA
              helperText="Category Name (Read-Only)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField label="Price" name="price" value={product.price || ''} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />
            <TextField label="Stock Quantity" name="stock" value={product.stock || 0} onChange={handleChange} type="number" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />
            <TextField label="Currency" name="currency" value={product.currency || ''} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextField label="Created At" value={new Date(product.createdAt).toLocaleString()} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
            <TextField label="Updated At" value={new Date(product.updatedAt).toLocaleString()} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
          </div>
          <TextField size='small' label="Description" name="description" value={product.description || ''} onChange={handleChange} fullWidth multiline rows={4} variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />

          <FormControlLabel
            control={<Switch checked={product.isAvailable ?? false} onChange={handleChange} name="isAvailable" disabled={loading} />}
            label="Is Available (In Stock)" className="text-gray-700"
          />
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