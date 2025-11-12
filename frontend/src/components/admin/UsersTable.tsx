import React, { useState, useEffect, useMemo, useCallback } from 'react';
// SỬA 1: Đổi sang react-router-dom
import { Link } from 'react-router'; 
import { TextField, InputAdornment, Avatar, IconButton } from '@mui/material'; 
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EditIcon } from 'lucide-react';

// --- API URLs ---
const MOCK_API_GET_URL = 'https://api.npoint.io/4a915d88732882680a44'; 
// (API Thật giữ nguyên)

// Kiểu dữ liệu (Giữ nguyên)
type UserData = {
    id: number; img: string; name: string; email: string; phone: string; createdAt: string;
    role: 'user' | 'designer' | 'admin'; 
};

// Hàm tạo link profile (Giữ nguyên)
const getProfileLink = (user: UserData): string => {
    switch (user.role) {
        case 'admin': return `/admin/${user.id}`;
        case 'designer': return `/designer/${user.id}`;
        case 'user': default: return `/users/${user.id}`;
    }
};

// Định nghĩa cột (Giữ nguyên)
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
    { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
    { field: 'phone', headerName: 'Phone', minWidth: 80, flex:1 },
    { field: 'createdAt', headerName: 'Created at', minWidth: 100, flex:1 },
];

const UsersTable = () => {
    const [allUsers, setAllUsers] = useState<UserData[]>([]); 
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    
    // Xử lý Delete (Giữ nguyên)
    const handleDelete = useCallback((id: number) => {
        if (window.confirm(`(Giả lập) Bạn có chắc muốn xóa user ${id}?`)) {
            setAllUsers((prevUsers) => prevUsers.filter((row) => row.id !== id));
            console.log(`(Giả lập) Đã xóa user ${id} khỏi giao diện.`);
        }
    }, []);

    // Cột Action (Giữ nguyên)
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

    // useEffect fetch (Giữ nguyên)
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); 
            try {
                const response = await fetch(MOCK_API_GET_URL); 
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

    // Logic filter (Giữ nguyên)
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

    // SỬA 2: Thay đổi JSX
    return (
        // Thêm 'bg-white rounded shadow' và thay 'h-screen' bằng 'h-full'
        <div className='UsersTable flex flex-col h-full w-full bg-white rounded shadow'>
             {/* Thêm các class padding/flex cho div này */}
             <div className="flex justify-between items-center px-4 pt-4 pb-2 flex-shrink-0">
                 {/* Thêm 'ml-auto' */}
                 <div className="w-[300px] ml-auto">
                     <TextField fullWidth variant="standard" placeholder="Search Users..." value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                     />
                 </div>
             </div>
            
            {/* Thêm 'overflow-hidden px-4 pb-4' */}
            <div className="flex-grow w-full overflow-hidden px-4 pb-4"> 
                <DataGrid
                    rows={filteredRows} 
                    columns={columnsWithAction} 
                    loading={loading}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    disableColumnResize={false}
                    rowHeight={60}
                    // Thêm sx prop
                    sx={{ border: 'none', height: '100%', width: '100%' }}
                />
            </div>
        </div>
    );
}

export default UsersTable;