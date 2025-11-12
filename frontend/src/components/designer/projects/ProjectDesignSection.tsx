import React, { useState } from 'react';
import type { ProjectDesign } from '@/types';
import { ChevronDown, Package, Plus, Minus, Edit2 } from 'lucide-react';

interface ProjectDesignSectionProps {
  designs: ProjectDesign[];
  onProductAdd?: (designId: string) => void;
  onProductRemove?: (designId: string, productId: string) => void;
  onProductEdit?: (designId: string, productId: string) => void;
  isLocked?: boolean;
}

const ProjectDesignSection: React.FC<ProjectDesignSectionProps> = ({
  designs,
  onProductAdd,
  onProductRemove,
  onProductEdit,
  isLocked = false
}) => {
  const [expandedDesigns, setExpandedDesigns] = useState<Set<string>>(
    new Set(designs.map(d => d.designId))
  );

  const toggleDesign = (designId: string) => {
    setExpandedDesigns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(designId)) {
        newSet.delete(designId);
      } else {
        newSet.add(designId);
      }
      return newSet;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDesignTotal = (design: ProjectDesign) => {
    return design.products.reduce((sum, item) => {
      const price = item.customPrice || item.product.price;
      return sum + (price * item.quantity);
    }, 0);
  };

  if (designs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        <p>No designs in this project</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {designs.map((design) => {
        const isExpanded = expandedDesigns.has(design.designId);
        const designTotal = calculateDesignTotal(design);

        return (
          <div key={design.designId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Design Header */}
            <button
              onClick={() => toggleDesign(design.designId)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Design Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={design.designImage}
                    alt={design.designTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Design Info */}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{design.designTitle}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <span>{design.roomType.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{design.products.length} products</span>
                    <span>•</span>
                    <span className="font-medium text-[#2B7516]">
                      {formatPrice(designTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <ChevronDown
                size={20}
                className={`text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Products List */}
            {isExpanded && (
              <div className="border-t border-gray-200 p-4">
                {design.products.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No products added yet
                  </p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {design.products.map((productItem) => (
                      <div
                        key={productItem.productId}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded bg-white overflow-hidden flex-shrink-0">
                          {productItem.product.thumbnailImage && (
                            <img
                              src={productItem.product.thumbnailImage}
                              alt={productItem.product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {productItem.product.name}
                          </h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span>Qty: {productItem.quantity}</span>
                            <span>•</span>
                            <span>
                              {formatPrice(productItem.customPrice || productItem.product.price)} each
                            </span>
                          </div>
                          {productItem.notes && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              Note: {productItem.notes}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(
                              (productItem.customPrice || productItem.product.price) * productItem.quantity
                            )}
                          </p>
                        </div>

                        {/* Actions */}
                        {!isLocked && (
                          <div className="flex items-center gap-1">
                            {onProductEdit && (
                              <button
                                onClick={() => onProductEdit(design.designId, productItem.productId)}
                                className="p-2 text-gray-600 hover:bg-white hover:text-[#2B7516] rounded transition-colors"
                                title="Edit product"
                              >
                                <Edit2 size={16} />
                              </button>
                            )}
                            {onProductRemove && (
                              <button
                                onClick={() => onProductRemove(design.designId, productItem.productId)}
                                className="p-2 text-gray-600 hover:bg-white hover:text-red-600 rounded transition-colors"
                                title="Remove product"
                              >
                                <Minus size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Product Button */}
                {!isLocked && onProductAdd && (
                  <button
                    onClick={() => onProductAdd(design.designId)}
                    className="w-full px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#2B7516] hover:text-[#2B7516] hover:bg-[#E6F3E6] transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Product to this Design
                  </button>
                )}

                {/* Design Total */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="font-medium text-gray-700">Design Total</span>
                  <span className="text-lg font-bold text-[#2B7516]">
                    {formatPrice(designTotal)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Grand Total */}
      <div className="bg-[#E6F3E6] rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Project Total</span>
          <span className="text-2xl font-bold text-[#2B7516]">
            {formatPrice(
              designs.reduce((sum, design) => sum + calculateDesignTotal(design), 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDesignSection;