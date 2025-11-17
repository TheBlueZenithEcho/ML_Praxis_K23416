// Tên file: src/admin/InteriorApprovalProfile.tsx
// (SỬA: Xóa Paper thừa, chuyển Alert vào trong, đổi variant="outlined")

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    CircularProgress,
    Typography,
    Avatar,
    Box,
    Paper,
    Tooltip,
    Alert,
    Chip,
    TextField
} from '@mui/material';
import { CheckCircle } from 'lucide-react';

// --- API URLs ---
const API_GET_URL = 'https://api.npoint.io/972268885ffa6e25b775';
const REAL_API_UPDATE_STATUS_URL = 'https://api.cuaban.com/designs'; // Ví dụ
// -----------------

// --- Kiểu dữ liệu (Đồng bộ) ---
type ProductInfo = {
    id: string; name: string; thumbnailImage: string; price: number;
};
type ProductInList = {
    product: ProductInfo; quantity: number; productId: string;
};
type InteriorData = {
    designId: string;
    title: string;
    images: string[];
    status: string; // 'PENDING'
    roomType: string;
    description: string;
    style: string;
    tags: string[];
    products: ProductInList[];
    designer?: string;
};
// ------------------------------------

const InteriorApprovalProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [interior, setInterior] = useState<InteriorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isApproving, setIsApproving] = useState(false);
    const [approveSuccess, setApproveSuccess] = useState(false);

    // Logic lấy dữ liệu (Giữ nguyên)
    useEffect(() => {
        const fetchInterior = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_GET_URL);
                if (!response.ok) throw new Error('Không thể tải danh sách thiết kế');

                const data: InteriorData[] = await response.json();
                const foundInterior = data.find(item => item.designId === id);

                if (foundInterior) {
                    if (foundInterior.status === 'PENDING') {
                        setInterior(foundInterior);
                    } else {
                        setError(`Thiết kế này đã được duyệt hoặc không phải trạng thái chờ (ID: ${id})`);
                    }
                } else {
                    setError(`Không tìm thấy thiết kế với ID: ${id}`);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInterior();
    }, [id]);

    // Logic nút Approve (Giữ nguyên)
    const handleApprove = async () => {
        if (!interior) return;
        setIsApproving(true);
        setError(null);
        setApproveSuccess(false);

        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsApproving(false);
        setApproveSuccess(true);
        setTimeout(() => navigate('/admin_approval'), 2000);
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
    }

    // --- Giao diện (Render) ---
    return (
        // SỬA: Xóa Paper thừa bọc Alert, layout giống hệt InteriorProfile
        <div className='InteriorApprovalProfile p-4 flex flex-col gap-6'>

            {!interior ? (
                <Box textAlign="center" mt={5}>
                    <Typography variant="h6" color="error">{error || "Không tải được dữ liệu"}</Typography>
                </Box>
            ) : (
                <>
                    {/* Phần 1: Thông tin cơ bản */}
                    <Paper elevation={3} className="p-6 rounded-lg bg-white">

                        {/* SỬA: Đưa Alert vào TRONG Paper chính */}
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {approveSuccess && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Đã duyệt thành công! Đang tự động quay lại...
                            </Alert>
                        )}

                        {/* Header (Avatar và Tiêu đề) */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                            <Avatar
                                src={interior.images[0]}
                                alt={interior.title}
                                sx={{ width: 120, height: 120, border: '2px solid #ddd' }}
                                variant="rounded"
                            />
                            <div className="flex-1 text-center md:text-left">
                                <Typography variant="h4" component="h1" className="font-bold">{interior.title}</Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Designer: {interior.designer || 'Chưa cập nhật'}
                                </Typography>
                                <Chip
                                    label={interior.status}
                                    color="warning"
                                    size="small"
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Thông tin chi tiết (Dạng TextField 'outlined') */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* SỬA: Dùng variant="outlined" */}
                            <TextField label="Tên thiết kế" value={interior.title} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
                            <TextField label="Designer" value={interior.designer || ''} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
                            <TextField label="Loại phòng" value={interior.roomType} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
                            <TextField label="Phong cách" value={interior.style} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />

                            <TextField
                                label="Mô tả"
                                value={interior.description}
                                fullWidth
                                multiline
                                rows={4}
                                disabled
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                className="md:col-span-2"
                            />

                            <TextField label="ID" value={interior.designId} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
                        </div>

                        {/* Nút Action (Duyệt) */}
                        <Box display="flex" justifyContent="flex-end" mt={4} pt={4} borderTop={1} borderColor="divider">
                            <Button
                                onClick={handleApprove}
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isApproving || approveSuccess}
                                startIcon={isApproving ? <CircularProgress size={20} color="inherit" /> : <CheckCircle size={20} />}
                            >
                                {isApproving ? 'Đang duyệt...' : 'Approve'}
                            </Button>
                        </Box>
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
                </>
            )}
        </div>
    );
}

export default InteriorApprovalProfile;