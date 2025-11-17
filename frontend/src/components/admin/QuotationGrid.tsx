// Tên file: src/admin/QuotationGrid.tsx
// (SỬA: Đổi layout sang dạng Danh sách chi tiết)

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Paper,
    CircularProgress,
    Typography,
    Alert,
    TextField,
    InputAdornment,
    Box,
    Button,
    Avatar
} from '@mui/material';
import { Search as SearchIcon, Eye } from 'lucide-react';

// --- API URLs ---
const MOCK_API_GET_URL = 'https://api.npoint.io/728da529fee9725bb9ee';
// -----------------

// --- SỬA 1: Kiểu dữ liệu (Khớp API) ---
type LineItem = {
    imageUrl?: string;
};
type QuotationSummary = {
    totalAmount: number;
};
type QuotationData = {
    id: string;
    projectTitle: string;
    customerName: string;
    designerName: string;
    status: string; // 'PENDING_APPROVAL'
    lineItems: LineItem[];
    summary: QuotationSummary;
};
// ------------------------------------

const QuotationGrid = () => {
    const [quotations, setQuotations] = useState<QuotationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    // --- SỬA 2: Logic gọi API (Vẫn lọc PENDING_APPROVAL) ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(MOCK_API_GET_URL);
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP! status: ${response.status}`);
                }
                const data: QuotationData[] = await response.json();

                // Lọc những báo giá 'PENDING_APPROVAL'
                const pendingData = data.filter(item => item.status === 'PENDING_APPROVAL');

                setQuotations(pendingData);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- Logic điều hướng (Dùng 'id') ---
    const handleViewDetails = (id: string) => {
        navigate(`/admin_quotation/${id}`);
    };

    // --- Logic tìm kiếm (Search) ---
    const filteredQuotations = useMemo(() => {
        if (!searchText) return quotations;
        const lowerCaseSearch = searchText.toLowerCase();
        return quotations.filter(item =>
            item.projectTitle.toLowerCase().includes(lowerCaseSearch) ||
            item.customerName.toLowerCase().includes(lowerCaseSearch) ||
            item.designerName.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchText, quotations]);


    if (loading) {
        return <div className="flex justify-center items-center h-full p-8"><CircularProgress /></div>;
    }

    if (error) {
        return <Alert severity="error" className="m-4">{`Lỗi khi tải dữ liệu: ${error}`}</Alert>;
    }

    // --- SỬA 3: Giao diện (Render) (Đổi sang Danh sách) ---
    return (
        <div className='QuotationGrid p-4'>
            {/* Thanh tìm kiếm */}
            <div className="flex justify-end items-center px-4 pt-0 pb-4">
                <TextField
                    variant="standard"
                    placeholder="Tìm project, khách hàng..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            {/* Danh sách báo giá */}
            <Box className="flex flex-col gap-4">

                {filteredQuotations.length === 0 && (
                    <Paper elevation={2} className="p-8">
                        <Typography className="text-center text-gray-500">
                            {searchText ? 'Không tìm thấy báo giá nào.' : 'Không có báo giá nào đang chờ duyệt.'}
                        </Typography>
                    </Paper>
                )}

                {filteredQuotations.map((item) => {
                    const imageUrl = item.lineItems[0]?.imageUrl || 'https://via.placeholder.com/150';

                    return (
                        <Paper
                            key={item.id}
                            elevation={2}
                            className="p-4 rounded-lg transition-all duration-300 hover:shadow-lg"
                        >
                            <Box className="flex flex-col md:flex-row items-center gap-4">
                                {/* 1. Ảnh */}
                                <Avatar
                                    src={imageUrl}
                                    alt={item.projectTitle}
                                    variant="rounded"
                                    sx={{ width: 80, height: 80 }}
                                />

                                {/* 2. Thông tin chính */}
                                <Box className="flex-1 text-center md:text-left">
                                    <Typography variant="h6" className="font-semibold truncate">
                                        {item.projectTitle}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Khách hàng: {item.customerName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Designer: {item.designerName}
                                    </Typography>
                                </Box>

                                {/* 3. Giá và Nút */}
                                <Box className="flex flex-col items-center md:items-end gap-2 md:w-48">
                                    <Typography variant="h6" color="primary" className="font-bold">
                                        {item.summary.totalAmount.toLocaleString('vi-VN')} VND
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<Eye size={16} />}
                                        onClick={() => handleViewDetails(item.id)}
                                        className="w-full md:w-auto"
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </div>
    );
}

export default QuotationGrid;