import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom'; 
import { TextField, InputAdornment, Avatar, IconButton } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { Edit as EditIcon } from 'lucide-react'; 
import { supabase } from '../../lib/supabaseClient'; 
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Cập nhật Type để khớp 100% với hàm SQL 'get_all_products'
// (Giả định get_all_products trả về các trường này)
type ProductData = {
  id: string; // uuid
  thumbnailImage: string | null;
  name: string | null;
  category: string | null; // Tên
  price: string | null;
  createdAt: string; 
  isAvailable: boolean | null;
};

// Hàm tạo link (Sửa để trỏ đến đúng trang chi tiết)
const getProductProfileLink = (productId: string): string => {
    // Sửa route này cho đúng, vd: /admin/products/ID
    return `/products/${productId}`; 
};

// Định nghĩa cột (Khớp với 'get_all_products')
const productsColumns: GridColDef<ProductData>[] = [
    { field: 'id', headerName: 'ID', width: 60 }, 
    {
        field: 'thumbnailImage', 
        headerName: 'Image', 
        width: 100,
        renderCell: (params: GridRenderCellParams<ProductData>) => (
            <div className="w-full h-full flex items-center justify-center">
                <Link to={getProductProfileLink(params.row.id)}>
                    <Avatar 
                        src={params.row.thumbnailImage || undefined} 
                        variant="rounded" 
                        sx={{ width: 48, height: 48 }}
                    />
                </Link>
            </div>
        ),
        sortable: false, filterable: false, align: 'center', headerAlign: 'center',
    },
    { field: 'name', headerName: 'Name', minWidth: 250, flex: 1 },
    { field: 'category', headerName: 'Category', minWidth: 150, flex: 0.7 },
    { field: 'price', headerName: 'Price', minWidth: 100, flex: 0.5 },
    { field: 'createdAt', headerName: 'Created At', minWidth: 150, flex: 0.5 },
    { 
        field: 'isAvailable', 
        headerName: 'In Stock', 
        width: 100, 
        type: 'boolean' 
    },
];

const ProductsTable = () => {
    const [allProducts, setAllProducts] = useState<ProductData[]>([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);

    // SỬA 1: --- Xử lý Delete (Sửa p_id -> p_variant_id) ---
    const handleDelete = useCallback(async (id: string, name: string | null) => {
        if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${name || id}"?`)) {
            setLoading(true);
            try {
                // Gọi hàm RPC 'delete_product_admin'
                const { error } = await supabase.rpc('delete_product_admin', {
                    p_variant_id: id // <-- SỬA TÊN THAM SỐ Ở ĐÂY
                });

                if (error) {
                    throw new Error(`Lỗi khi xóa: ${error.message}`);
                }
                
                setAllProducts((prevProducts) => prevProducts.filter((row) => row.id !== id));
                alert(`Đã xóa thành công ${name || id}.`);

            } catch (err: any) {
                console.error("Lỗi khi xóa sản phẩm:", err);
                alert(err.message);
            } finally {
                setLoading(false);
            }
        }
    }, []);

    // Cột Action (Không đổi)
    const columnsWithActionProducts = useMemo<GridColDef<ProductData>[]>(() => [
        ...productsColumns,
        {
            field: 'action', headerName: 'Action', width: 120,
            sortable: false, filterable: false, align: 'center', headerAlign: 'center',
            renderCell: (params: GridRenderCellParams<ProductData>) => (
                <div className="w-full flex justify-center gap-2">
                    <Link to={getProductProfileLink(params.row.id)}>
                        <IconButton color="primary" title="Sửa"><EditIcon size={20}/></IconButton>
                    </Link>
                    <IconButton color="error" title="Xóa" onClick={() => handleDelete(params.row.id, params.row.name)}>
                        <DeleteOutlineIcon fontSize="small"/>
                    </IconButton>
                </div>
            )
        }
    ], [handleDelete]); 

    // useEffect (Dùng 'get_all_products')
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.rpc('get_all_products');
                if (error) throw error;
                if (data) {
                    setAllProducts(data as ProductData[]);
                }
            } catch (error) {
                console.error("Lỗi khi fetch products:", error);
                setAllProducts([]); 
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []); 

    // Logic filter (Dùng 'category')
    const filteredRows = useMemo(() => {
        if (!searchText) return allProducts;
        const lowerCaseSearch = searchText.toLowerCase();
        return allProducts.filter((product) => {
            const nameMatch = product.name?.toLowerCase().includes(lowerCaseSearch);
            const categoryMatch = product.category?.toLowerCase().includes(lowerCaseSearch);
            return nameMatch || categoryMatch;
        });
    }, [searchText, allProducts]);

    // SỬA 2: --- RETURN JSX (Đã xóa nút "Add New Product" bị dư) ---
    return (
        <div className='ProductsTable flex flex-col h-full w-full bg-white rounded shadow'>
            <div className="flex justify-between items-center px-4 pt-4 pb-2 flex-shrink-0">
                {/* Đã xóa nút "Add New Product" ở đây. 
                  Chỉ giữ lại thanh Search.
                */}
                <div className="w-[300px] ml-auto">
                    <TextField fullWidth variant="standard" placeholder="Search Products..." value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
                    />
                </div>
            </div>
            
            <div className="flex-grow w-full overflow-hidden px-4 pb-4">
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