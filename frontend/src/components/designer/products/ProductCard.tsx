import React from 'react';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
  isSelected?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  isSelected = false
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div
      onClick={() => onSelect?.(product)}
      className={`
        border rounded-lg p-4 cursor-pointer transition-all
        ${isSelected
          ? 'border-[#2B7516] bg-[#E6F3E6]'
          : 'border-gray-200 hover:border-[#2B7516]'
        }
      `}
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        <img
          src={product.thumbnailImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 truncate">
        {product.name}
      </h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#2B7516]">
          {formatPrice(product.price)}
        </span>
        <span className="text-xs text-gray-500">
          Stock: {product.stock}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;