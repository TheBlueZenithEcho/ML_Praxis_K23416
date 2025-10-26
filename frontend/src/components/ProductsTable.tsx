import React, { useState, useEffect, useMemo, useCallback } from 'react';
// SỬA: Sửa import Link
import { Link } from 'react-router';
import { TextField, InputAdornment, Avatar, IconButton } from '@mui/material';
import { DataGrid, type GridColDef, type GridRowsProp, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// --- API URLs ---
// (1) API Giả lập (đang dùng - API mới của bạn)
const MOCK_API_GET_URL = 'https://api.npoint.io/9ff8af5e261b401bea53'; // <<-- API MỚI
// (2) API Thật (comment lại)
// const REAL_API_BASE_URL = 'https://api-backend-that.cuaban.com';
// const REAL_API_PRODUCT_ENDPOINT = `${REAL_API_BASE_URL}/products`;
// -----------------

// Kiểu dữ liệu (khớp API mới)
type ProductData = {
    id: number; img: string; name: string; producer: string; price: string; createdAt: string; inStock?: boolean;
};

// Hàm tạo link profile SP
const getProductProfileLink = (productId: number | string): string => {
    return `/products/${productId}`;
};

// Định nghĩa cột (sử dụng 'name')
const productsColumns: GridColDef<ProductData>[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
        field: 'img', headerName: 'Image', width: 100,
        renderCell: (params: GridRenderCellParams<ProductData>) => (
            <div className="w-full h-full flex items-center justify-center">
                <Link to={getProductProfileLink(params.row.id)}>
                    <Avatar src={params.value as string} variant="rounded" sx={{ width: 48, height: 48 }}/>
                </Link>
            </div>
        ),
        sortable: false, filterable: false, align: 'center', headerAlign: 'center',
    },
    { field: 'name', headerName: 'Name', minWidth: 250, flex: 1 }, // <<-- Đã dùng 'name'
    { field: 'producer', headerName: 'Producer', minWidth: 150, flex: 0.7 },
    { field: 'price', headerName: 'Price', minWidth: 100, flex: 0.5 },
    { field: 'createdAt', headerName: 'Created At', minWidth: 150, flex: 0.5 },
    { field: 'inStock', headerName: 'In Stock', width: 100, type: 'boolean' },
];

const ProductsTable = () => {
    const [allProducts, setAllProducts] = useState<ProductData[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    // --- Xử lý Delete --- (Giữ nguyên logic phân biệt API)
    const handleDelete = useCallback((id: number) => {
        const useRealApi = false;
        if (window.confirm(`Xóa sản phẩm ID: ${id}?`)) {
            if (useRealApi) { /* // Code API thật */ alert("API thật đang bị comment."); }
            else {
                // Giả lập
                setAllProducts(prev => prev.filter(p => p.id !== id));
                console.log(`(Giả lập) Đã xóa sản phẩm ${id}`);
            }
        }
    }, []);
    // -------------------

    // Thêm cột Action
    const columnsWithActionProducts = useMemo<GridColDef<ProductData>[]>(() => [
        ...productsColumns,
        {
            field: 'action', headerName: 'Action', width: 120,
            sortable: false, filterable: false, align: 'center', headerAlign: 'center',
            renderCell: (params: GridRenderCellParams<ProductData>) => (
                <div className="w-full flex justify-center gap-2">
                    <Link to={getProductProfileLink(params.row.id)}>
                        <IconButton color="primary" title="Sửa"><EditIcon fontSize="small"/></IconButton>
                    </Link>
                    <IconButton color="error" title="Xóa" onClick={() => handleDelete(params.row.id)}>
                        <DeleteOutlineIcon fontSize="small"/>
                    </IconButton>
                </div>
            )
        }
    ], [handleDelete]);

    // useEffect để LẤY dữ liệu (dùng API mới)
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            let apiUrlToFetch = '';
            const useRealApi = false;
            if(useRealApi) { /* apiUrlToFetch = REAL_API_PRODUCT_ENDPOINT || ''; */ alert("API thật chưa cấu hình."); return; }
            else { apiUrlToFetch = MOCK_API_GET_URL; }

            try {
                const response = await fetch(apiUrlToFetch);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data: ProductData[] = await response.json(); // API mới đã đúng định dạng
                setAllProducts(data);
            } catch (error) {
                console.error("Lỗi khi fetch products:", error);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Logic filter tìm kiếm (dùng 'name')
    const filteredRows = useMemo(() => {
        if (!searchText) return allProducts;
        const lowerCaseSearch = searchText.toLowerCase();
        return allProducts.filter((product) => {
            const nameMatch = product.name?.toLowerCase().includes(lowerCaseSearch);
            const producerMatch = product.producer?.toLowerCase().includes(lowerCaseSearch);
            return nameMatch || producerMatch;
        });
    }, [searchText, allProducts]);

    // Return JSX
    return (
        <div className='ProductsTable flex flex-col h-full w-full'>
             <div className="flex justify-between items-center px-4 pt-4 pb-2 flex-shrink-0">
                 <div className="w-[300px] ml-auto">
                     <TextField fullWidth variant="standard" placeholder="Search Products..." value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                     />
                 </div>
             </div>
            <div className="flex-grow w-full overflow-hidden">
                <DataGrid
                    rows={filteredRows}
                    columns={columnsWithActionProducts}
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

export default ProductsTable;