import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Image, ShoppingCart, Upload } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCategory } from '@/types';

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
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  
  // --- State cho chọn sản phẩm ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Ref cho input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- GỌI API ĐỂ LẤY TẤT CẢ SẢN PHẨM ---
  useEffect(() => {
    // Chỉ gọi API khi modal được mở
    if (isOpen) {
      const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch('https://www.npoint.io/docs/e6dbee7a2c0933fc7af5');
          if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
          }
          const data: Product[] = await response.json();
          setProducts(data);
          setFilteredProducts(data); // Hiển thị tất cả lúc đầu
        } catch (e) {
          setError(e as Error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProducts();
    }
  }, [isOpen]); // Gọi lại API mỗi khi modal được mở

  // --- HÀM TÌM KIẾM (GỘP CHUNG) ---
  const handleSearch = () => {
    // TODO: Đây là nơi bạn sẽ gọi API ML của mình
    // (Gửi đi searchText, searchImage, selectedCategory)
    console.log('Searching with (ML model handles this):', {
      text: searchText,
      image: searchImage,
      category: selectedCategory,
    });

    // Tạm thời: Dùng logic filter client-side (chỉ dựa trên text)
    // Bạn sẽ thay thế logic này bằng kết quả trả về từ API ML
    setIsLoading(true);
    const query = searchText.toLowerCase();
    const filtered = products.filter(product => {
      const matchesQuery = searchText === '' || // Nếu không có text, cho qua
                         product.name.toLowerCase().includes(query) ||
                         product.description.toLowerCase().includes(query) ||
                         product.tags?.some(tag => tag.toLowerCase().includes(query));
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      return matchesQuery && matchesCategory;
    });
    
    setFilteredProducts(filtered);
    setIsLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Products</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* XÓA BỎ TABS */}

        {/* Search Section (Giao diện gộp - đã hỗ trợ dark mode) */}
        <div className="p-6 border-b bg-gray-50 dark:bg-gray-900 space-y-4">
          
          {/* Khu vực Upload/Preview ảnh */}
          <div className="flex gap-4 items-center">
            {imagePreview && (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border dark:border-gray-600">
                <img src={imagePreview} alt="Search preview" className="w-full h-full object-cover" />
                <button
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                  onClick={removeImage}
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | 'all')}
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
            <div className="text-center py-12 text-red-600">
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
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedProduct?.id === product.id
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
                      <span className="font-bold text-[#2B7516]">
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
              <div className="w-16 h-16 rounded bg-white dark:bg-gray-700 overflow-hidden">
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