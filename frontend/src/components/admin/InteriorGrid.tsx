// Tên file: src/admin/InteriorGrid.tsx
// (Đã CẬP NHẬT: Lọc status 'APPROVED' và dùng designId)

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

const MOCK_API_GET_URL = 'https://api.npoint.io/972268885ffa6e25b775';

// --- Kiểu dữ liệu (Khớp API) ---
type InteriorData = {
    designId: string;
    title: string;
    images: string[];
    roomType: string;
    status: string; // 'PENDING', 'APPROVED'
};
// ------------------------------------

const InteriorsTable = () => {
    const [interiors, setInteriors] = useState<InteriorData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    // --- LOGIC LẤY VÀ LỌC DỮ LIỆU ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(MOCK_API_GET_URL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data: InteriorData[] = await response.json();

                // Lọc những thiết kế đã 'APPROVED'
                const approvedData = data.filter(item => item.status === 'APPROVED');

                setInteriors(approvedData);

            } catch (e: any) {
                setError(e.message || 'Không thể tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // SỬA: Đã đúng. Dùng designId (string) và điều hướng
    const handleViewDetails = (designId: string) => {
        // Điều hướng đến path bạn muốn: /admin_interior/design_002
        navigate(`/admin_interior/${designId}`);
    };

    // Logic tìm kiếm
    const filteredInteriors = useMemo(() => {
        if (!searchText) return interiors;
        const lowerCaseSearch = searchText.toLowerCase();
        return interiors.filter(item =>
            item.title.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchText, interiors]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><CircularProgress /></div>;
    }
    if (error) {
        return <Alert severity="error" className="m-4">{`Lỗi: ${error}`}</Alert>;
    }

    // Giao diện (Render)
    return (
        <div className='InteriorsTable p-4'>
            <div className="searchbar flex justify-end items-center px-4 pt-0 pb-4">
                <TextField
                    variant="standard"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><SearchIcon size={20} /></InputAdornment>),
                    }}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">

                {filteredInteriors.length === 0 && (
                    <Typography className="col-span-full text-center text-gray-500 py-8">
                        Không tìm thấy thiết kế nào.
                    </Typography>
                )}

                {filteredInteriors.map((item) => (
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
                        <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default InteriorsTable;