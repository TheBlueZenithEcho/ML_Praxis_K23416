import React, { useState, useEffect, useMemo, useCallback } from 'react';
// SỬA 1: Sửa lại import react-router-dom nếu chưa đúng
import { Link } from 'react-router';
import { TextField, InputAdornment, Avatar, IconButton, Chip } from '@mui/material'; // Thêm Chip
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// Import icons cho Type Room (tùy chọn)
import WeekendIcon from '@mui/icons-material/Weekend';
import HotelIcon from '@mui/icons-material/Hotel';
import KitchenIcon from '@mui/icons-material/Kitchen';
import { EditIcon, SearchIcon } from 'lucide-react';

// --- API URLs ---
// (1) API Giả lập (đang dùng - API mới của bạn)
const MOCK_API_GET_URL = 'https://api.npoint.io/3619c3ea1583a5bd1216'; // <<<--- API MỚI CỦA BẠN

// (2) API Thật (comment lại)
// const REAL_API_BASE_URL = '...';
// const REAL_API_INTERIOR_ENDPOINT = '...';
// -----------------

// --- SỬA 2: KIỂU DỮ LIỆU (KHỚP API MỚI) ---
type InteriorData = {
    id: number;
    img: string;
    name: string; // API mới dùng 'name'
    designer: string;
    createdAt: string; // API mới có 'createdAt'
    "type room": "living room" | "bed room" | "kitchen" | string; // API mới có 'type room'
    // location, year, style không còn
};
// ----------------------------------------

// Hàm tạo link profile (giữ nguyên)
const getInteriorProfileLink = (interiorId: number | string): string => {
    return `/interior/${interiorId}`;
};

// --- SỬA 3: ĐỊNH NGHĨA CỘT (THEO API MỚI) ---
const interiorColumns: GridColDef<InteriorData>[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
        field: 'img', headerName: 'Image', width: 100,
        renderCell: (params: GridRenderCellParams<InteriorData>) => (
            <div className="w-full h-full flex items-center justify-center">
                <Link to={getInteriorProfileLink(params.row.id)}>
                    <Avatar src={params.value as string} variant='rounded' sx={{ width: 48, height: 48 }} />
                </Link>
            </div>
        ),
        sortable: false, filterable: false, align: 'center', headerAlign: 'center',
    },
    { field: 'name', headerName: 'Name', minWidth: 250, flex: 1 }, // Đổi header
    { field: 'designer', headerName: 'Designer', minWidth: 150, flex: 0.7 },
    { field: 'createdAt', headerName: 'Created At', minWidth: 150, flex: 0.5 }, // Thêm cột createdAt
    {
        field: 'type room', // Dùng key "type room"
        headerName: 'Type Room',
        minWidth: 150,
        flex: 0.6,
        // Tùy chọn: Dùng renderCell để hiển thị Chip cho đẹp
        renderCell: (params: GridRenderCellParams<InteriorData>) => {
             let icon = null;
             let color: "primary" | "secondary" | "success" | "warning" | "error" | "info" | "default" = "default";
             const type = params.value as string;
             switch (type) {
                 case 'living room': icon = <WeekendIcon fontSize="small"/>; color = "primary"; break;
                 case 'bed room': icon = <HotelIcon fontSize="small"/>; color = "secondary"; break;
                 case 'kitchen': icon = <KitchenIcon fontSize="small"/>; color = "warning"; break;
             }
             return <Chip icon={icon || undefined} label={type || 'N/A'} size="small" color={color} className="capitalize"/>;
        }
    },
    // Xóa cột location, year, style
];
// ---------------------------------------------

const InteriorsTable = () => {
    const [allInteriors, setAllInteriors] = useState<InteriorData[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Xử lý Delete --- (Giữ nguyên logic phân biệt API)
    const handleDelete = useCallback((id: number) => {
        const useRealApi = false;
        const itemToDelete = allInteriors.find(item => item.id === id);
        // Sửa confirm message dùng 'name'
        const confirmMsg = itemToDelete ? `(Giả lập) Xóa "${itemToDelete.name}"?` : `(Giả lập) Xóa ID: ${id}?`;
        if (window.confirm(confirmMsg)) {
            if (useRealApi) { /* // Code API thật */ alert("API thật đang bị comment."); }
            else {
                setAllInteriors(prev => prev.filter(item => item.id !== id));
                console.log(`(Giả lập) Đã xóa interior ${id}`);
            }
        }
    }, [allInteriors]);
    // -------------------

    // Thêm cột Action (Giữ nguyên)
    const columnsWithActionInterior = useMemo<GridColDef<InteriorData>[]>(() => [
        ...interiorColumns,
        {
            field: 'action', headerName: 'Action', width: 120,
            sortable: false, filterable: false, align: 'center', headerAlign: 'center',
            renderCell: (params: GridRenderCellParams<InteriorData>) => (
                <div className="w-full flex justify-center gap-2">
                    <Link to={getInteriorProfileLink(params.row.id)}>
                        <IconButton color="primary" title="Sửa"><EditIcon fontSize="small"/></IconButton>
                    </Link>
                    <IconButton color="error" title="Xóa" onClick={() => handleDelete(params.row.id)}>
                        <DeleteOutlineIcon fontSize="small"/>
                    </IconButton>
                </div>
            )
        }
    ], [handleDelete]);

    // useEffect để LẤY dữ liệu (Giữ nguyên logic API)
    useEffect(() => {
        const fetchInteriors = async () => {
            setLoading(true); setError(null);
            let apiUrlToFetch = '';
            const useRealApi = false;
            if(useRealApi) { /* // Code API thật */ alert("API thật đang bị comment."); setLoading(false); return; }
            else { apiUrlToFetch = MOCK_API_GET_URL; }

            try {
                const response = await fetch(apiUrlToFetch);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                // API mới trả về đúng kiểu InteriorData
                const data: InteriorData[] = await response.json();
                setAllInteriors(data);
            } catch (error) {
                console.error("Lỗi khi fetch interiors:", error);
                setError(error instanceof Error ? error.message : 'Lỗi không xác định');
                setAllInteriors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchInteriors();
    }, []);

    // --- SỬA 4: LOGIC FILTER TÌM KIẾM (THEO API MỚI) ---
    const filteredRows = useMemo(() => {
        if (!searchText) return allInteriors;
        const lowerCaseSearch = searchText.toLowerCase();
        return allInteriors.filter((item) => {
            // Tìm theo name, designer, type room
            const nameMatch = (item.name || '').toLowerCase().includes(lowerCaseSearch);
            const designerMatch = (item.designer || '').toLowerCase().includes(lowerCaseSearch);
            const typeRoomMatch = (item["type room"] || '').toLowerCase().includes(lowerCaseSearch);
            // Xóa location, style
            return nameMatch || designerMatch || typeRoomMatch;
        });
    }, [searchText, allInteriors]);
    // ---------------------------------------------

    // Return JSX (Giữ nguyên)
    return (
        <div className='InteriorsTable flex flex-col h-full w-full'>
             <div className="flex justify-between items-center px-4 pt-4 pb-2 flex-shrink-0">
                 <div className="w-[300px] ml-auto">
                     <TextField fullWidth variant="standard" placeholder="Search Interiors..." value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                     />
                 </div>
             </div>
             {error && <div className="px-4 py-2 text-red-600 bg-red-100 border border-red-400 rounded mx-4">{`Fetch Error: ${error}`}</div>}
            <div className="flex-grow w-full overflow-hidden px-4 pb-4">
                <DataGrid
                    rows={filteredRows}
                    columns={columnsWithActionInterior} // Đã cập nhật columns
                    loading={loading}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    disableColumnResize={false}
                    rowHeight={60}
                    sx={{ border: 'none', height: '100%', width: '100%' }}
                />
            </div>
        </div>
    );
}

export default InteriorsTable;