import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Image, ShoppingCart, Upload } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCategory } from '@/types';
import { supabase } from '../../../lib/supabaseClient'


interface ProductSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSelect: (product: Product, quantity: number) => void;
}

const ProductSearchOverlay: React.FC<ProductSearchOverlayProps> = ({
  isOpen,
  onClose,
  onProductSelect
}) => {
  // --- State cho API ---
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // --- State cho tìm kiếm (GỘP CHUNG) ---
  const [searchText, setSearchText] = useState('');
  const [searchImage, setSearchImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // --- State cho chọn sản phẩm ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Ref cho input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 2. LOGIC TÌM KIẾM MỚI (Direct API: Python xử lý trọn gói) ---
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TRƯỜNG HỢP 1: Nếu không nhập gì -> Load mặc định (fallback)
      if (!searchText && !searchImage) {
        // Bạn có thể gọi API search rỗng hoặc dùng logic cũ để load random
        // Ở đây tôi giữ logic cũ là load từ Supabase client để tiết kiệm request cho server AI
        const { data } = await supabase
          .from('products')
          .select('*')
          .limit(20);
        if (data) setFilteredProducts(data as Product[]);
        setIsLoading(false);
        return;
      }

      console.log("🚀 B1: Gọi API Search Python...");

      // Chuẩn bị dữ liệu request
      const requestData: any = {
        text: searchText || "", // Luôn gửi chuỗi rỗng nếu không có text
        match_count: 30         // Số lượng kết quả mong muốn
      };

      // Xử lý ảnh sang Raw Base64 (Cần thiết để khớp với lệnh curl)
      if (searchImage) {
        const reader = new FileReader();
        const imageBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(searchImage);
        });

        // QUAN TRỌNG: FileReader trả về "data:image/jpeg;base64,JD8s..."
        // Python base64 decode thường chỉ nhận phần sau dấu phẩy
        const rawBase64 = imageBase64.split(',')[1];
        requestData.image = rawBase64;
      }
      console.log(requestData)
      // ⚠️ Đổi IP tại đây nếu chạy trên điện thoại hoặc môi trường khác
      const pythonUrl = 'http://127.0.0.1:5000/api/search';

      const response = await fetch(pythonUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi Server: ${response.statusText}`);
      }

      // Server Python trả về danh sách sản phẩm (JSON)
      const responseData = await response.json();
      console.log("📦 Response từ Server:", responseData);

      // --- PHẦN SỬA ĐỔI QUAN TRỌNG BẮT ĐẦU TỪ ĐÂY ---

      // 1. Lấy mảng raw data từ key "products" (như JSON bạn cung cấp)
      const rawList = responseData.products || [];

      // 2. Map dữ liệu từ Backend sang Frontend Type (Product)
      let results: Product[] = rawList.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        // Xử lý ảnh: Ưu tiên thumbnailImage, nếu null thì lấy phần tử đầu của mảng images
        thumbnailImage: item.thumbnailImage || (item.images && item.images.length > 0 ? item.images[0] : ''),
        // Xử lý description: Nếu null thì để chuỗi rỗng
        description: item.description || '',
        category: item.category, // Ép kiểu nếu cần thiết
        stock: item.stock || 0,
        // Các trường phụ khác nếu cần
        sku: item.sku,
        images: item.images || []
      }));
      results = results.slice(5);
      // Kiểm tra cấu trúc trả về (Tùy thuộc code Python của bạn trả về list hay object)
      // Giả sử Python trả về: { "results": [...] } hoặc trực tiếp [...]
      if (Array.isArray(responseData)) {
        results = responseData;
        console.log("search results ", results);

      } else if (responseData.results && Array.isArray(responseData.results)) {
        results = responseData.results;
      } else {
        // Nếu server trả về structure khác, log ra để debug
        console.warn("⚠️ Cấu trúc dữ liệu lạ:", responseData);
      }

      console.log(`✅ Đã nhận ${results.length} sản phẩm từ API Python`);

      // Lọc Category ở Client (nếu API Python chưa hỗ trợ lọc category)
      if (selectedCategory !== 'all') {
        results = results.filter(p => p.category === selectedCategory);
      }

      setFilteredProducts(results);

    } catch (e) {
      console.error("❌ Lỗi tìm kiếm:", e);
      setError(e as Error);

      // Fallback: Nếu API Python chết, tìm kiếm text thường bằng Supabase
      if (searchText) {
        const { data } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${searchText}%`)
          .limit(20);
        if (data) setFilteredProducts(data as Product[]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Hàm xử lý ảnh ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSearchImage(file);
      // Tạo link preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSearchImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input file
    }
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    onProductSelect(selectedProduct, quantity);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {/* Modal (đã hỗ trợ dark mode) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header (đã hỗ trợ dark mode) */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Products</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Search by text, image, or both for better results
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* Search Section (Giao diện gộp - đã hỗ trợ dark mode) */}
        <div className="p-6 border-b bg-gray-50 dark:bg-gray-900 space-y-4">

          {/* Khu vực Upload/Preview ảnh */}
          <div className="flex gap-4 items-center">
            {imagePreview && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[#2B7516] dark:border-green-600">
                <img src={imagePreview} alt="Search preview" className="w-full h-full object-cover" />
                <button
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 shadow-lg"
                  onClick={removeImage}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:border-[#2B7516] dark:hover:border-green-500 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <Upload size={18} />
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {imagePreview && (
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                <Image size={16} />
                Image ready for search
              </span>
            )}
          </div>

          {/* Thanh tìm kiếm */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by text, or combine with image..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value={ProductCategory.FURNITURE}>Furniture</option>
              <option value={ProductCategory.LIGHTING}>Lighting</option>
              <option value={ProductCategory.DECORATION}>Decoration</option>
              <option value={ProductCategory.TEXTILE}>Textile</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors flex items-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>

          {/* Search Mode Indicator */}
          <div className="flex gap-2 items-center text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Search mode:</span>
            {!searchText && !searchImage && (
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Showing all products</span>
            )}
            {searchText && !searchImage && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">Text only</span>
            )}
            {!searchText && searchImage && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">Image only</span>
            )}
            {searchText && searchImage && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded">Combined (Text + Image)</span>
            )}
          </div>
        </div>

        {/* Results Section (đã hỗ trợ dark mode) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Hiển thị Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-300">Loading products...</p>
            </div>
          )}

          {/* Hiển thị Lỗi */}
          {error && (
            <div className="text-center py-12 text-red-600 dark:text-red-400">
              <p className="font-semibold">Failed to load products</p>
              <p>{error.message}</p>
            </div>
          )}

          {/* Hiển thị Kết quả */}
          {!isLoading && !error && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedProduct?.id === product.id
                        ? 'border-[#2B7516] bg-[#E6F3E6] dark:border-green-700 dark:bg-green-900/50'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#2B7516] dark:hover:border-green-500'
                      }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-3">
                      <img
                        src={product.thumbnailImage}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2B7516] dark:text-green-400">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-300">No products found matching your criteria</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Add Product (đã hỗ trợ dark mode) */}
        {selectedProduct && (
          <div className="border-t dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded bg-white dark:bg-gray-700 overflow-hidden border dark:border-gray-600">
                <img
                  src={selectedProduct.thumbnailImage}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{formatPrice(selectedProduct.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-300">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                onClick={handleAddProduct}
                className="px-6 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors flex items-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Design
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSearchOverlay;