import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Sửa: Đổi sang react-router-dom
import { Link } from 'react-router'; 
import { TextField, InputAdornment, Avatar, IconButton } from '@mui/material'; 
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EditIcon } from 'lucide-react';

// --- API URLs ---
const MOCK_API_GET_URL = 'https://api.npoint.io/4a915d88732882680a44'; 

// Kiểu dữ liệu (Giữ nguyên)
type DesignerData = {
    id: number; img: string; name: string; email: string; phone: string; createdAt: string;
    role: 'user' | 'designer' | 'admin'; 
};

// Hàm tạo link profile (Giữ nguyên)
const getProfileLink = (user: DesignerData): string => {
    switch (user.role) {
        case 'admin': return `/admin/${user.id}`;
        case 'designer': return `/desad/${user.id}`;
        case 'user': default: return `/users/${user.id}`;
    }
};



// Định nghĩa cột (Giữ nguyên)
const designersColumns: GridColDef<DesignerData>[] = [ 
    { field: 'id', headerName: 'ID', width: 60 },
    { 
        field: 'img', headerName: 'Avatar', width: 100, 
        renderCell: (params: GridRenderCellParams<DesignerData>) => (
            <div className="w-full h-full flex items-center justify-center">
                <Link to={getProfileLink(params.row)}> 
                    <Avatar src={params.value as string} /> 
                </Link>
            </div> 
        ),
        sortable: false, filterable: false, align: 'center', headerAlign: 'center',
    },
    { field: 'name', headerName: 'Full Name', minWidth: 250, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
    { field: 'phone', headerName: 'Phone', minWidth: 80, flex: 1 },
    { field: 'createdAt', headerName: 'Created at', minWidth: 100, flex: 1 },
];

const DesignersTable = () => {
    const [allDesigners, setAllDesigners] = useState<DesignerData[]>([]); 
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    
    // Xử lý Delete (Giữ nguyên)
    const handleDelete = useCallback((id: number) => {
        if (window.confirm(`(Giả lập) Bạn có chắc muốn xóa designer ${id}?`)) {
            setAllDesigners((prevDesigners) => prevDesigners.filter((row) => row.id !== id));
        }
    }, []);

    // Cột Action (Giữ nguyên)
    const columnsWithActionDesigners = useMemo<GridColDef<DesignerData>[]>(() => [
        ...designersColumns, 
        {
            field: 'action', headerName: 'Action', width: 150, 
            sortable: false, filterable: false, align: 'center', headerAlign: 'center',
            renderCell: (params: GridRenderCellParams<DesignerData>) => (
                <div className="w-full flex justify-center gap-2">
                    <Link to={getProfileLink(params.row)}> 
                        <IconButton color="primary" title="Sửa"><EditIcon /></IconButton>
                    </Link>
                    <IconButton color="error" title="Xóa" onClick={() => handleDelete(params.row.id)}>
                        <DeleteOutlineIcon />
                    </IconButton>
                </div>
            )
        }
    ], [handleDelete]); 

    // useEffect fetch (Giữ nguyên)
    useEffect(() => {
        const fetchDesigners = async () => {
            setLoading(true); 
            try {
                const response = await fetch(MOCK_API_GET_URL); 
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data: DesignerData[] = await response.json();
                const filteredData = data.filter(user => user.role === 'designer'); 
                setAllDesigners(filteredData); 
            } catch (error) {
                console.error("Lỗi khi fetch designers:", error);
                setAllDesigners([]); 
            } finally {
                setLoading(false); 
            }
        };
        fetchDesigners();
    }, []); 

    // Logic filter (Giữ nguyên)
    const filteredRows = useMemo(() => {
        if (!searchText) return allDesigners;
        const lowerCaseSearch = searchText.toLowerCase();
        return allDesigners.filter((designer) => {
            const nameMatch = designer.name?.toLowerCase().includes(lowerCaseSearch);
            const emailMatch = designer.email?.toLowerCase().includes(lowerCaseSearch);
            const phoneMatch = designer.phone?.toLowerCase().includes(lowerCaseSearch);
            return nameMatch || emailMatch || phoneMatch;
        });
    }, [searchText, allDesigners]);

    // *** SỬA LỖI TẠI ĐÂY ***
    return (
        // Thêm 'bg-white rounded shadow' vào div gốc này
        <div className='DesignersTable flex flex-col h-full w-full bg-white rounded shadow'> 
             {/* Thanh tìm kiếm giờ sẽ nằm bên trong nền trắng */}
             <div className="flex justify-between items-center px-4 pt-4 pb-2 flex-shrink-0">
                 <div className="w-[300px] ml-auto">
                     <TextField fullWidth variant="standard" placeholder="Search Designers..." value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                     />
                 </div>
             </div>
            
            {/* Bảng DataGrid */}
            <div className="flex-grow w-full overflow-hidden px-4 pb-4"> 
                <DataGrid
                    rows={filteredRows} 
                    columns={columnsWithActionDesigners} 
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

export default DesignersTable;