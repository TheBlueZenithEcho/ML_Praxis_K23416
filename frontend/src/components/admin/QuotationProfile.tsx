// Tên file: src/admin/QuotationProfile.tsx
// (SỬA: Cập nhật toàn bộ file để khớp API mới)

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Button,
    CircularProgress,
    Typography,
    Box,
    Paper,
    Alert,
    Chip,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar // Thêm Avatar
} from '@mui/material';
import { CheckCircle, History } from 'lucide-react'; // Thêm History icon

// --- API URLs ---
const API_GET_URL = 'https://api.npoint.io/728da529fee9725bb9ee';
const REAL_API_UPDATE_STATUS_URL = 'https://api.cuaban.com/quotations'; // Ví dụ
// -----------------

// --- SỬA 1: Kiểu dữ liệu (Khớp API mới) ---
type LineItem = {
    lineId: string;
    itemName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
};

type QuotationSummary = {
    subtotal: number;
    discount: number;
    taxPercent: number;
    taxAmount: number;
    totalAmount: number;
};

type ApprovalHistory = {
    adminId: string;
    adminName: string;
    status: string;
    comments: string;
    timestamp: string;
};

type QuotationProfileType = {
    id: string;
    projectTitle: string;
    version: number;
    customerId: string;
    customerName: string;
    designerId: string;
    designerName: string;
    status: string; // 'PENDING_APPROVAL'
    lineItems: LineItem[];
    summary: QuotationSummary;
    notesToAdmin: string;
    notesToCustomer: string;
    approvalHistory: ApprovalHistory[];
    submittedAt: string | null;
};
// ------------------------------------

const QuotationProfile = () => {
    const { id } = useParams<{ id: string }>(); // Lấy 'id' (VD: "q1")
    const navigate = useNavigate();

    const [quotation, setQuotation] = useState<QuotationProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isApproving, setIsApproving] = useState(false);
    const [approveSuccess, setApproveSuccess] = useState(false);

    // SỬA 2: Logic lấy dữ liệu (Tìm bằng 'id', lọc 'PENDING_APPROVAL')
    useEffect(() => {
        const fetchQuotation = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_GET_URL);
                if (!response.ok) throw new Error('Không thể tải danh sách báo giá');

                const data: QuotationProfileType[] = await response.json();

                // Tìm bằng 'id'
                const foundQuotation = data.find(item => item.id === id);

                if (foundQuotation) {
                    if (foundQuotation.status === 'PENDING_APPROVAL') {
                        setQuotation(foundQuotation);
                    } else {
                        setError(`Báo giá này không ở trạng thái chờ duyệt (ID: ${id})`);
                    }
                } else {
                    setError(`Không tìm thấy báo giá với ID: ${id}`);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotation();
    }, [id]);

    // SỬA 3: Logic nút Approve (Dùng 'id')
    const handleApprove = async () => {
        if (!quotation) return;
        setIsApproving(true);
        setError(null);
        setApproveSuccess(false);

        // API thật của bạn sẽ dùng 'id'
        console.log(`(Giả lập) Đang gọi PATCH ${REAL_API_UPDATE_STATUS_URL}/${quotation.id}`);
        console.log(`(Giả lập) Đang gửi body: { status: "ADMIN_APPROVED" }`); // Gửi status mới

        // Giả lập
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsApproving(false);
        setApproveSuccess(true);
        setTimeout(() => navigate('/admin_quotation'), 2000);
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh"><CircularProgress /></Box>;
    }

    // --- SỬA 4: Giao diện (Render) (Cập nhật toàn bộ JSX) ---
    return (
        <div className='QuotationProfile p-4 flex flex-col gap-6'>

            {!quotation ? (
                <Box textAlign="center" mt={5}>
                    <Typography variant="h6" color="error">{error || "Không tải được dữ liệu"}</Typography>
                </Box>
            ) : (
                <>
                    {/* Phần 1: Thông tin cơ bản */}
                    <Paper elevation={3} className="p-6 rounded-lg bg-white">

                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {approveSuccess && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Đã duyệt thành công! Đang tự động quay lại...
                            </Alert>
                        )}

                        {/* Header (Bỏ Avatar vì API không có) */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                            {/* <Avatar ... /> (Bỏ avatar) */}
                            <div className="flex-1 text-center md:text-left">
                                <Typography variant="h4" component="h1" className="font-bold">
                                    Project: {quotation.projectTitle}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Designer: {quotation.designerName} | Khách hàng: {quotation.customerName}
                                </Typography>
                                <Chip
                                    label={quotation.status}
                                    color="warning"
                                    size="small"
                                    className="mt-2 mr-2"
                                />
                                <Chip
                                    label={`Version: ${quotation.version}`}
                                    size="small"
                                    className="mt-2"
                                    variant="outlined"
                                />
                            </div>
                        </div>

                        {/* Thông tin chi tiết */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <TextField label="ID Báo giá" value={quotation.id} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
                            <TextField
                                label="Ngày gửi duyệt"
                                value={quotation.submittedAt ? new Date(quotation.submittedAt).toLocaleString('vi-VN') : 'N/A'}
                                fullWidth
                                disabled
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField label="ID Khách hàng" value={quotation.customerId} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />
                            <TextField label="ID Designer" value={quotation.designerId} fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }} />

                            <TextField
                                label="Ghi chú cho Admin"
                                value={quotation.notesToAdmin || '(Không có)'}
                                fullWidth
                                multiline
                                rows={3}
                                disabled
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                className="md:col-span-2"
                            />
                            <TextField
                                label="Ghi chú cho Khách hàng"
                                value={quotation.notesToCustomer || '(Không có)'}
                                fullWidth
                                multiline
                                rows={3}
                                disabled
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                className="md:col-span-2"
                            />

                            {/* Summary (Tổng tiền) */}
                            <TextField
                                label="Tạm tính (VND)"
                                value={quotation.summary.subtotal.toLocaleString('vi-VN')}
                                fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Giảm giá (VND)"
                                value={quotation.summary.discount.toLocaleString('vi-VN')}
                                fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Thuế VAT (%)"
                                value={`${quotation.summary.taxPercent}% (${quotation.summary.taxAmount.toLocaleString('vi-VN')} VND)`}
                                fullWidth disabled variant="outlined" InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="TỔNG CỘNG (VND)"
                                value={quotation.summary.totalAmount.toLocaleString('vi-VN')}
                                fullWidth
                                disabled
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                sx={{ "& .MuiInputBase-input.Mui-disabled": { color: 'green', WebkitTextFillColor: 'green', fontWeight: 'bold' } }}
                            />
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

                    {/* === PHẦN 2: CHI TIẾT HẠNG MỤC === */}
                    <Paper elevation={3} className="p-6 rounded-lg bg-white">
                        <Typography variant="h5" component="h2" className="font-bold mb-4">
                            Chi tiết hạng mục ({quotation.lineItems.length})
                        </Typography>

                        {quotation.lineItems.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tên hạng mục</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Mô tả</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>SL</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Đơn giá (VND)</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thành tiền (VND)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {quotation.lineItems.map((item) => (
                                            <TableRow key={item.lineId}>
                                                <TableCell>{item.itemName}</TableCell>
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">{item.unitPrice.toLocaleString('vi-VN')}</TableCell>
                                                <TableCell align="right">{item.totalPrice.toLocaleString('vi-VN')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body1" className="text-gray-500">
                                Không có hạng mục nào trong báo giá này.
                            </Typography>
                        )}
                    </Paper>

                    {/* === PHẦN 3: LỊCH SỬ DUYỆT (MỚI) === */}
                    <Paper elevation={3} className="p-6 rounded-lg bg-white">
                        <Typography variant="h5" component="h2" className="font-bold mb-4">
                            Lịch sử duyệt
                        </Typography>

                        {quotation.approvalHistory.length > 0 ? (
                            <Box className="flex flex-col gap-4">
                                {quotation.approvalHistory.map((history, index) => (
                                    <Paper key={index} variant="outlined" className="p-4 bg-gray-50">
                                        <Box className="flex justify-between items-center mb-2">
                                            <Box className="flex items-center gap-2">
                                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>{history.adminName.charAt(0)}</Avatar>
                                                <Typography variant="subtitle1" className="font-semibold">{history.adminName}</Typography>
                                                <Chip
                                                    label={history.status}
                                                    color={history.status === 'REJECTED' ? 'error' : 'default'}
                                                    size="small"
                                                />
                                            </Box>
                                            <Typography variant="caption" color="textSecondary">
                                                {new Date(history.timestamp).toLocaleString('vi-VN')}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" className="italic">
                                            "{history.comments}"
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body1" className="text-gray-500">
                                Đây là lần duyệt đầu tiên, chưa có lịch sử.
                            </ Typography>
                        )}
                    </Paper>
                </>
            )}
        </div>
    );
}

export default QuotationProfile;