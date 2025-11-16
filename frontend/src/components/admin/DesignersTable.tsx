import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Import từ 'react-router-dom'
import { TextField, InputAdornment, Avatar, IconButton } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Edit as EditIcon } from 'lucide-react'; // Đổi tên 'EditIcon' để tránh trùng

// Import Supabase client
import { supabase } from '../../lib/supabaseClient';

// Cập nhật Interface để khớp 100% với SQL View 'all_designers'
type DesignerData = {
    id: string;         // p.id (uuid -> string)
    img: string | null; // p.avatar_url (text -> string | null)
    name: string | null;// p.name (text -> string | null)
    // role: string;    // <-- Không còn trả về từ RPC
    email: string | null; // p.email (text -> string | null)
    phone: string | null; // p.phone (text -> string | null)
    createdAt: string;  // p.created_at (timestamptz -> string)
};
// Hàm tạo link (Đã đơn giản hóa vì view này CHỈ trả về designer)
const getProfileLink = (user: DesignerData): string => {
    return `/desad/${user.id}`;
};

// Định nghĩa cột (Không đổi)
const designersColumns: GridColDef<DesignerData>[] = [
    { field: 'id', headerName: 'ID', width: 60 },
    {
        field: 'img', headerName: 'Avatar', width: 100,
        renderCell: (params: GridRenderCellParams<DesignerData>) => (
            <div className="w-full h-full flex items-center justify-center">
                <Link to={getProfileLink(params.row)}>
                    {/* Sửa: Thêm `|| undefined` để xử lý null */}
                    <Avatar src={params.value || undefined} />
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

    // Xử lý Delete (Gọi RPC an toàn)
    const handleDelete = useCallback(async (id: string, name: string | null) => {
        if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn designer "${name || id}"?`)) {
            setLoading(true);
            try {
                // Gọi hàm RPC 'delete_user_as_admin' đã tạo ở File 1
                const { error } = await supabase.rpc('delete_user_as_admin', {
                    user_id_to_delete: id
                });

                if (error) {
                    // Lỗi này xảy ra nếu người gọi không phải Admin
                    throw new Error(`Lỗi khi xóa: ${error.message}`);
                }

                // Xóa thành công, cập nhật UI
                setAllDesigners((prevDesigners) => prevDesigners.filter((row) => row.id !== id));
                alert(`Đã xóa thành công ${name || id}.`);

            } catch (err: any) {
                console.error("Lỗi khi xóa designer:", err);
                alert(err.message);
            } finally {
                setLoading(false);
            }
        }
    }, []);

    // Cột Action (Cập nhật để truyền 'name' vào handleDelete)
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
                    <IconButton color="error" title="Xóa" onClick={() => handleDelete(params.row.id, params.row.name)}>
                        <DeleteOutlineIcon />
                    </IconButton>
                </div>
            )
        }
    ], [handleDelete]);

    useEffect(() => {
        const fetchDesigners = async () => {
            setLoading(true);
            try {
                // Gọi hàm RPC 'get_all_designers'
                const { data, error } = await supabase
                    .rpc('get_all_designers');
                if (error) {
                    console.error('Lỗi khi lấy dữ liệu designers:', error);
                    throw error;
                }

                if (data) {
                    // Gán dữ liệu (đã được gõ 'DesignerData[]') vào state
                    setAllDesigners(data as DesignerData[]);
                }

            } catch (error) {
                console.error("Lỗi khi fetch designers:", error);
                setAllDesigners([]); // Đặt về mảng rỗng nếu lỗi
            } finally {
                setLoading(false);
            }
        };
        fetchDesigners();
    }, []); // Chỉ chạy 1 lần khi component mount

    // Logic filter (Cập nhật để xử lý 'null')
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

    // JSX (Giữ nguyên như code của bạn)
    return (
        <div className='DesignersTable flex flex-col h-full w-full bg-white rounded shadow'>
            <div className="flex justify-between items-center px-4 pt-4 pb-2 flex-shrink-0">
                <div className="w-[300px] ml-auto">
                    <TextField fullWidth variant="standard" placeholder="Search Designers..." value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                    />
                </div>
            </div>

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