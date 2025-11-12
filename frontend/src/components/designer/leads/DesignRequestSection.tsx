import React, { useState } from 'react';
import type { DesignRequest } from '@/types';
import type { RoomType } from '@/types';
import { ChevronDown, Package, Plus, Minus } from 'lucide-react';

interface DesignRequestSectionProps {
  designRequests: Record<RoomType, DesignRequest[]>;
  onProductAdd?: (designId: string, productId: string) => void;
  onProductRemove?: (designId: string, productId: string) => void;
}

const DesignRequestSection: React.FC<DesignRequestSectionProps> = ({
  designRequests,
  onProductAdd,
  onProductRemove
}) => {
  const [expandedRooms, setExpandedRooms] = useState<Set<RoomType>>(
    new Set(Object.keys(designRequests) as RoomType[])
  );

  const toggleRoom = (roomType: RoomType) => {
    setExpandedRooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomType)) {
        newSet.delete(roomType);
      } else {
        newSet.add(roomType);
      }
      return newSet;
    });
  };

  const getRoomLabel = (roomType: RoomType) => {
    return roomType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Filter out empty rooms
  const nonEmptyRooms = Object.entries(designRequests).filter(
    ([_, requests]) => requests.length > 0
  );

  if (nonEmptyRooms.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No designs requested yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {nonEmptyRooms.map(([roomType, requests]) => {
        const room = roomType as RoomType;
        const isExpanded = expandedRooms.has(room);

        return (
          <div key={roomType} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Room Header */}
            <button
              onClick={() => toggleRoom(room)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#E6F3E6] rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-[#2B7516]" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    {getRoomLabel(room)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {requests.length} design{requests.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Design List */}
            {isExpanded && (
              <div className="border-t border-gray-200">
                {requests.map((request, index) => (
                  <div
                    key={request.designId}
                    className={`p-4 ${
                      index !== requests.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    {/* Design Info */}
                    <div className="flex gap-4 mb-3">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={request.designImage}
                          alt={request.designTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {request.designTitle}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Requested on {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                        {request.notes && (
                          <p className="text-sm text-gray-700 italic">
                            "{request.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Products */}
                    {request.products.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Products ({request.products.length})
                        </p>
                        <div className="space-y-2">
                          {request.products.map((productItem) => (
                            <div
                              key={productItem.productId}
                              className="flex items-center justify-between bg-white rounded p-2"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                {productItem.product.thumbnailImage && (
                                  <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                    <img
                                      src={productItem.product.thumbnailImage}
                                      alt={productItem.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {productItem.product.name}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <span>Qty: {productItem.quantity}</span>
                                    <span>•</span>
                                    <span className="font-medium">
                                      {formatPrice(
                                        productItem.customPrice || productItem.product.price
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {onProductRemove && (
                                <button
                                  onClick={() => onProductRemove(request.designId, productItem.productId)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Remove product"
                                >
                                  <Minus size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Product Button */}
                    {onProductAdd && (
                      <button
                        onClick={() => onProductAdd(request.designId, '')}
                        className="mt-3 w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#2B7516] hover:text-[#2B7516] hover:bg-[#E6F3E6] transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Add Product to this Design
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DesignRequestSection;