import React from 'react';
import type { ProductItem as ProductItemType } from '@/types';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface ProductItemProps {
  item: ProductItemType;
  onQuantityChange?: (productId: string, newQuantity: number) => void;
  onRemove?: (productId: string) => void;
  readOnly?: boolean;
}

const ProductItem: React.FC<ProductItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  readOnly = false
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const price = item.customPrice || item.product.price;
  const total = price * item.quantity;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Product Image */}
      <div className="w-20 h-20 rounded bg-white overflow-hidden flex-shrink-0">
        {item.product.thumbnailImage && (
          <img
            src={item.product.thumbnailImage}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 mb-1 truncate">
          {item.product.name}
        </h4>
        <p className="text-sm text-gray-600 mb-2">
          {formatPrice(price)} each
        </p>
        {item.notes && (
          <p className="text-xs text-gray-500 italic">
            Note: {item.notes}
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      {!readOnly && onQuantityChange && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(item.product.id, Math.max(1, item.quantity - 1))}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-semibold">
            {item.quantity}
          </span>
          <button
            onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
            disabled={item.quantity >= item.product.stock}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
      )}

      {readOnly && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Qty</p>
          <p className="font-semibold">{item.quantity}</p>
        </div>
      )}

      {/* Total Price */}
      <div className="text-right min-w-[120px]">
        <p className="text-sm text-gray-600">Total</p>
        <p className="font-bold text-[#2B7516]">
          {formatPrice(total)}
        </p>
      </div>

      {/* Remove Button */}
      {!readOnly && onRemove && (
        <button
          onClick={() => onRemove(item.product.id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Remove product"
        >
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
};

export default ProductItem;