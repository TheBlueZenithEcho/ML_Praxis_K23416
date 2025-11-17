import React, { useState, useEffect, useMemo, useCallback } from 'react';
// SỬA 1: Đã đổi sang react-router-dom
import { Link } from 'react-router-dom';
import { TextField, InputAdornment, Avatar, IconButton } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Edit as EditIcon } from 'lucide-react';

import { supabase } from '../../lib/supabaseClient';

type UserData = {
    id: string;
    img: string | null;
    name: string | null;
    role: string;
    email: string;
    phone: string | null;
    created_at: string;
};

const getProfileLink = (user: UserData): string => {
    return `/users/${user.id}`;
};

const userColumns: GridColDef<UserData>[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    {
        field: 'img', headerName: 'Avatar', width: 100,
        renderCell: (params: GridRenderCellParams<UserData>) => (
            <div className="w-full h-full flex items-center justify-center">
                <Link to={getProfileLink(params.row)}>
                    <Avatar src={params.value || undefined} />
                </Link>
            </div>
        ),
        sortable: false, filterable: false, align: 'center', headerAlign: 'center',
    },
    { field: 'name', headerName: 'Full Name', minWidth: 250, flex: 1 },
    { field: 'email', headerName: 'Email', minWidth: 200, flex: 1 },
    { field: 'phone', headerName: 'Phone', minWidth: 80, flex: 1 },
    {
        field: 'created_at',
        headerName: 'Created at',
        minWidth: 100,
        flex: 1
    },
];

const UsersTable = () => {
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    // Xử lý Delete (Gọi RPC an toàn)
    const handleDelete = useCallback(async (id: string, name: string | null) => {
        if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn customer "${name || id}"?`)) {
            setLoading(true);
            try {
                // Gọi hàm RPC 'delete_user_as_admin'
                const { error } = await supabase.rpc('delete_user_as_admin', {
                    user_id_to_delete: id
                });

                if (error) {
                    throw new Error(`Lỗi khi xóa: ${error.message}`);
                }

                // Xóa thành công, cập nhật UI
                setAllUsers((prevUsers) => prevUsers.filter((row) => row.id !== id));
                alert(`Đã xóa thành công ${name || id}.`);

            } catch (err: any) {
                console.error("Lỗi khi xóa customer:", err);
                alert(err.message);
            } finally {
                setLoading(false);
            }
        }
    }, []);


    // Cột Action (Cập nhật để truyền 'name' vào handleDelete)
    const columnsWithActionUsers = useMemo<GridColDef<UserData>[]>(() => [
        ...userColumns,
        {
            field: 'action', headerName: 'Action', width: 150,
            sortable: false, filterable: false, align: 'center', headerAlign: 'center',
            renderCell: (params: GridRenderCellParams<UserData>) => (
                <div className="w-full flex justify-center gap-2">
                    <Link to={getProfileLink(params.row)}>
                        <IconButton color="primary" title="Sửa"><EditIcon /></IconButton>
                    </Link>
                    <IconButton color="error" title="Xóa" onClick={() => handleDelete(params.row.id, params.row.name)}>
                        <DeleteOutlineIcon />
                    </IconButton>
                </div>
            )
        }
    ], [handleDelete]);


    // useEffect fetch (Dọn dẹp logic)
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // SỬA 3: Gọi hàm RPC 'get_all_users' theo logic của DesignersTable
                const { data, error } = await supabase
                    .rpc('get_all_users');

                if (error) {
                    console.error('Lỗi khi lấy dữ liệu customer:', error);
                    throw error;
                }

                if (data) {
                    // Gán dữ liệu (đã được gõ 'DesignerData[]') vào state
                    setAllUsers(data as UserData[]);
                }

            } catch (error) {
                console.error("Lỗi khi fetch users:", error);
                setAllUsers([]); // Đặt về mảng rỗng nếu lỗi
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Logic filter
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


    // JSX
    return (
        <div className='UsersTable flex flex-col h-full w-full bg-white rounded shadow'>
            <div className="flex justify-between items-center px-4 pt-4 pb-2 flex-shrink-0">
                <div className="w-[300px] ml-auto">
                    <TextField fullWidth variant="standard" placeholder="Search Users..." value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                    />
                </div>
            </div>

            <div className="flex-grow w-full overflow-hidden px-4 pb-4">
                <DataGrid
                    rows={filteredRows}
                    columns={columnsWithActionUsers}
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

export default UsersTable;