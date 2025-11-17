// Tên file: src/admin/InteriorProfile.tsx
// (SỬA LẠI: Dùng designId, kiểu dữ liệu mới và logic fetch)

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Avatar,
    CircularProgress,
    Paper,
    Typography,
    Box,
    Tooltip,
    Chip // Thêm Chip
} from '@mui/material';

// --- API URLs ---
const MOCK_API_GET_LIST_URL = 'https://api.npoint.io/972268885ffa6e25b775';
// -----------------

// --- SỬA 1: Kiểu dữ liệu (Khớp với API) ---
type ProductInfo = {
    id: string; name: string; thumbnailImage: string; price: number;
};
type ProductInList = {
    product: ProductInfo; quantity: number; productId: string;
};
type InteriorProfileType = {
    designId: string;
    title: string;
    images: string[];
    status: string; // 'APPROVED'
    roomType: string;
    description: string;
    style: string;
    tags: string[];
    products: ProductInList[];
    // Giả sử có designer (nếu không có thì xóa đi)
    designer?: string;
};
// ------------------------------------

const InteriorProfile = () => {
    const { id } = useParams<{ id: string }>(); // id này là "design_002"
    const navigate = useNavigate();
    const [interior, setInterior] = useState<InteriorProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- SỬA 2: Logic gọi API (Tìm bằng designId) ---
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(MOCK_API_GET_LIST_URL);
                if (!response.ok) throw new Error(`Lỗi HTTP! status: ${response.status}`);

                const data: InteriorProfileType[] = await response.json();

                // Sửa logic tìm kiếm: Dùng 'designId' (string)
                const foundItem = data.find(item => item.designId === id);

                if (foundItem) {
                    // Đảm bảo đây là trang xem chi tiết, nên lọc 'APPROVED'
                    if (foundItem.status === 'APPROVED') {
                        setInterior(foundItem);
                    } else {
                        setError(`Thiết kế này chưa được duyệt (ID: ${id})`);
                    }
                } else {
                    setError(`Không tìm thấy thiết kế với ID: ${id}`);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // (Các hàm handleChange, handleSubmit... )
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!interior) return;
        const { name, value } = e.target;
        setInterior({ ...interior, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert("Đã lưu (giả lập)");
    };

    const handleDeleteInterior = () => {
        if (window.confirm("Bạn có chắc muốn xóa?")) {
            alert("Đã xóa (giả lập)");
            navigate('/admin_interior'); // Điều hướng về trang Interior chính
        }
    };

    // --- Render ---
    if (loading) {
        return <div className="flex justify-center items-center h-full"><CircularProgress /></div>;
    }
    if (error) {
        return <div className="p-4 text-red-600 bg-red-100 rounded">{`Lỗi: ${error}`}</div>;
    }
    if (!interior) {
        return <div className="p-4 text-gray-500">Không tìm thấy dữ liệu.</div>;
    }

    // --- SỬA 3: Cập nhật JSX ---
    return (
        <div className='InteriorProfile p-4 flex flex-col gap-6'>
            {/* Phần 1: Thông tin cơ bản và Form */}
            <Paper elevation={3} className="p-6 rounded-lg bg-white">
                <form onSubmit={handleSubmit}>
                    {/* Header (Avatar và Tiêu đề) */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                        <Avatar
                            src={avatarFile ? URL.createObjectURL(avatarFile) : interior.images[0]}
                            alt={interior.title}
                            sx={{ width: 120, height: 120, cursor: 'pointer', border: '2px solid #ddd' }}
                            onClick={() => fileInputRef.current?.click()}
                            variant="rounded"
                        />
                        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && setAvatarFile(e.target.files[0])} hidden accept="image/*" />

                        <div className="flex-1 text-center md:text-left">
                            <Typography variant="h4" component="h1" className="font-bold">{interior.title}</Typography>
                            {/* Giả sử có trường designer, nếu API không có thì xóa dòng này */}
                            <Typography variant="subtitle1" color="textSecondary">
                                Designer: {interior.designer || 'Chưa cập nhật'}
                            </Typography>
                            <Chip label={interior.status} color="success" size="small" className="mt-2" />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextField label="Tên thiết kế" name="title" value={interior.title} onChange={handleChange} fullWidth required variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />
                        <TextField label="Designer" name="designer" value={interior.designer || ''} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />
                        <TextField label="Loại phòng" name="roomType" value={interior.roomType} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />
                        <TextField label="Phong cách" name="style" value={interior.style} onChange={handleChange} fullWidth variant="outlined" InputLabelProps={{ shrink: true }} disabled={loading} />

                        <TextField
                            label="Mô tả"
                            name="description"
                            value={interior.description}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled={loading}
                            className="md:col-span-2"
                        />

                        <TextField label="ID" value={interior.designId} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
                    </div>

                    {/* Buttons Save/Delete */}
                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t">
                        <Button variant="contained" color="primary" type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                        <Button variant="outlined" color="error" onClick={handleDeleteInterior} disabled={loading}>
                            Xóa
                        </Button>
                    </div>
                </form>
            </Paper>

            {/* === PHẦN 2: DANH SÁCH SẢN PHẨM === */}
            <Paper elevation={3} className="p-6 rounded-lg bg-white">
                <Typography variant="h5" component="h2" className="font-bold mb-4">
                    Sản phẩm đi kèm ({interior.products.length})
                </Typography>

                {interior.products.length > 0 ? (
                    <div className="flex overflow-x-auto gap-4 p-2 bg-gray-100 rounded-lg">
                        {interior.products.map(productItem => (
                            <Paper
                                key={productItem.product.id}
                                className="flex-shrink-0 w-40 overflow-hidden rounded-md shadow"
                                elevation={2}
                            >
                                <img src={productItem.product.thumbnailImage} alt={productItem.product.name} className="w-full h-28 object-cover" />
                                <div className="p-2">
                                    <Tooltip title={productItem.product.name}>
                                        <Typography variant="body2" className="font-medium text-gray-900 line-clamp-2">
                                            {productItem.product.name}
                                        </Typography>
                                    </Tooltip>
                                    <Typography variant="body1" color="primary" className="font-bold mt-1">
                                        {productItem.product.price.toLocaleString('vi-VN')} VND
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Số lượng: {productItem.quantity}
                                    </Typography>
                                </div>
                            </Paper>
                        ))}
                    </div>
                ) : (
                    <Typography variant="body1" className="text-gray-500">
                        Không có sản phẩm nào được đính kèm.
                    </Typography>
                )}
            </Paper>
        </div>
    );
};

export default InteriorProfile;