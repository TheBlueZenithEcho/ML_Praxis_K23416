import React from 'react';
import type { Product } from '@/types';
import ProductCard from './ProductCard';
import { Package } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  selectedProduct?: Product | null;
  onProductSelect: (product: Product) => void;
  isLoading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedProduct,
  onProductSelect,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-10 h-10 border-4 border-[#2B7516] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Package size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Found {products.length} product{products.length !== 1 ? 's' : ''}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
            isSelected={selectedProduct?.id === product.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;