import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router'; // Đã sửa import
import { TextField, InputAdornment, Avatar, IconButton } from '@mui/material'; 
import { DataGrid, type GridColDef, type GridRowsProp, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// --- API URLs ---
// (1) API Giả lập (đang dùng)
const MOCK_API_GET_URL = 'https://api.npoint.io/4a915d88732882680a44'; 
// (2) API Thật (comment lại)
// const REAL_API_BASE_URL = 'https://api-backend-that.cuaban.com'; // !!! THAY BẰNG API THẬT CỦA BẠN !!!
// const API_GET_URL = `${REAL_API_BASE_URL}/users`; // Ví dụ URL GET thật
// -----------------

// Kiểu dữ liệu (có role)
type UserData = {
    id: number; img: string; name: string; email: string; phone: string; createdAt: string;
    role: 'user' | 'designer' | 'admin'; 
};

// Hàm tạo link profile
const getProfileLink = (user: UserData): string => {
    switch (user.role) {
        case 'admin': return `/admin/${user.id}`;
        case 'designer': return `/designer/${user.id}`;
        case 'user': default: return `/users/${user.id}`;
    }
};

// Định nghĩa cột
const userColumns: GridColDef<UserData>[] = [ 
    { field: 'id', headerName: 'ID', width: 60 },
    { 
        field: 'img', headerName: 'Avatar', width: 100, 
        renderCell: (params: GridRenderCellParams<UserData>) => (
            <div className="w-full h-full flex items-center justify-center">
                <Link to={getProfileLink(params.row)}> 
                    <Avatar src={params.value as string} /> 
                </Link>
            </div> 
        ),
        sortable: false, filterable: false, align: 'center', headerAlign: 'center',
    },
    { field: 'name', headerName: 'Full Name', minWidth: 250, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 300, flex: 1 },
    { field: 'phone', headerName: 'Phone', minWidth: 200, flex: 0.5 },
    { field: 'createdAt', headerName: 'Created at', minWidth: 180, flex: 0.5 },
];

const UsersTable = () => {
    const [allUsers, setAllUsers] = useState<UserData[]>([]); 
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    
    // --- Xử lý Delete ---
    // (1) Giả lập (đang dùng)
    const handleDelete = useCallback((id: number) => {
        if (window.confirm(`(Giả lập) Bạn có chắc muốn xóa user ${id}?`)) {
            setAllUsers((prevUsers) => prevUsers.filter((row) => row.id !== id));
            console.log(`(Giả lập) Đã xóa user ${id} khỏi giao diện.`);
        }
    }, []);

    // (2) Code thật (comment lại)
    /*
    const handleDelete = useCallback(async (id: number) => {
        if (!window.confirm(`Bạn có chắc muốn xóa user ${id}?`)) return;
        try {
            const response = await fetch(`${REAL_API_BASE_URL}/users/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setAllUsers((prevUsers) => prevUsers.filter((row) => row.id !== id));
                alert("Đã xóa user thành công!");
            } else {
                alert("Xóa thất bại.");
            }
        } catch (error) {
            console.error("Lỗi khi xóa user:", error);
            alert("Lỗi kết nối khi xóa user.");
        }
    }, []); 
    */
    // -------------------

    // Thêm cột Action
    const columnsWithAction = useMemo<GridColDef<UserData>[]>(() => [
        ...userColumns, 
        {
            field: 'action', headerName: 'Action', width: 150, 
            sortable: false, filterable: false, align: 'center', headerAlign: 'center',
            renderCell: (params: GridRenderCellParams<UserData>) => (
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

    // useEffect để LẤY và LỌC dữ liệu (chỉ lấy role 'user')
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); 
            try {
                // Sử dụng API giả lập
                const response = await fetch(MOCK_API_GET_URL); 
                // Khi dùng API thật: const response = await fetch(API_GET_URL);
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data: UserData[] = await response.json();
                const filteredData = data.filter(user => user.role === 'user'); 
                setAllUsers(filteredData); 
            } catch (error) {
                console.error("Lỗi khi fetch users:", error);
                setAllUsers([]); 
            } finally {
                setLoading(false); 
            }
        };
        fetchUsers();
    }, []); 

    // Logic filter tìm kiếm (giữ nguyên)
    const filteredRows = useMemo(() => {
        if (!searchText) return allUsers;
        const lowerCaseSearch = searchText.toLowerCase();
        return allUsers.filter((user) => {
            const nameMatch = user.name?.toLowerCase().includes(lowerCaseSearch);
            const emailMatch = user.email?.toLowerCase().includes(lowerCaseSearch);
            const phoneMatch = user.phone?.toLowerCase().includes(lowerCaseSearch);
            return nameMatch || emailMatch || phoneMatch;
        });
    }, [searchText, allUsers]);

    // Return JSX (giữ nguyên)
    return (
        <div className='UsersTable flex flex-col h-screen p-4 gap-4'>
             <div className="flex justify-between items-center justify-end">
                 <div className="w-[300px]">
                     <TextField fullWidth variant="standard" placeholder="Search" value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                     />
                 </div>
             </div>
            <div className="flex-grow w-full"> 
                <DataGrid
                    rows={filteredRows} 
                    columns={columnsWithAction} 
                    loading={loading}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    disableColumnResize={false}
                    rowHeight={60}
                />
            </div>
        </div>
    );
}

export default UsersTable;