// Tên file: src/admin/PendingInteriorsGrid.tsx
// (Full code đã CẬP NHẬT: Lọc status 'PENDING')

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CircularProgress, 
    Typography, 
    Alert, 
    TextField, 
    InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';

// --- API URLs ---
const MOCK_API_GET_URL = 'https://api.npoint.io/972268885ffa6e25b775';
// -----------------

// --- Kiểu dữ liệu (Khớp API) ---
// SỬA 1: Thêm trường 'status'
type AppInteriorData = {
    designId: string;
    title: string;
    images: string[];
    roomType: string;
    status: string; // Thêm trường này để lọc
};
// ------------------------------------

const PendingInteriorsGrid = () => {
    const [appinteriors, setAppInteriors] = useState<AppInteriorData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    // --- Logic gọi API ---
    // SỬA 2: Thêm logic lọc status === 'PENDING'
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(MOCK_API_GET_URL); 
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP! status: ${response.status}`);
                }
                const data: AppInteriorData[] = await response.json();
                
                // Lọc những thiết kế 'PENDING'
                const pendingData = data.filter(item => item.status === 'PENDING');
                
                setAppInteriors(pendingData); 

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- Logic điều hướng (Giữ nguyên) ---
    const handleViewDetails = (designId: string) => {
        navigate(`/admin_approval/${designId}`);
    };

    // --- Logic tìm kiếm (Search) (Giữ nguyên) ---
    const filteredAppInteriors = useMemo(() => {
        if (!searchText) return appinteriors;
        const lowerCaseSearch = searchText.toLowerCase();
        return appinteriors.filter(item =>
            item.title.toLowerCase().includes(lowerCaseSearch) ||
            item.roomType.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchText, appinteriors]);

    // --- Giao diện (Render) (Giữ nguyên) ---
    if (loading) {
        return <div className="flex justify-center items-center h-full p-8"><CircularProgress /></div>;
    }

    if (error) {
        return <Alert severity="error" className="m-4">{`Lỗi khi tải dữ liệu: ${error}`}</Alert>;
    }

    return (
        <div className='AppInteriorsGrid p-4'>
            
            {/* Thanh tìm kiếm */}
            <div className="flex justify-end items-center px-4 pt-0 pb-4">
                <TextField 
                   variant="standard" 
                   placeholder="Tìm thiết kế..." 
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

            {/* Lưới thiết kế */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                
                {filteredAppInteriors.length === 0 && (
                    <Typography className="col-span-full text-center text-gray-500 py-8">
                        {searchText ? 'Không tìm thấy thiết kế nào.' : 'Không có thiết kế nào đang chờ duyệt.'}
                    </Typography>
                )}
                
                {filteredAppInteriors.map((item) => (
                    <div
                        key={item.designId}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 group relative"
                        onClick={() => handleViewDetails(item.designId)} 
                    >
                        <img
                            src={item.images[0]} // Lấy ảnh đầu tiên
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                  
                        
                        {/* Tiêu đề */}
                        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
                             <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PendingInteriorsGrid;