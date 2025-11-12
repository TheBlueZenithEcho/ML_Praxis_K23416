import React from 'react';
import { MessageCircle, Clock, Image as ImageIcon } from 'lucide-react';
import type { Lead } from '@/types';
import LeadStatusBadge from './LeadStatusBadge';

interface LeadCardProps {
  lead: Lead;
  onClick: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  // Count total designs across all room types
  const totalDesigns = Object.values(lead.designRequests)
    .reduce((sum, requests) => sum + requests.length, 0);

  // Get time difference
  const getTimeDiff = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  // Get first design image
  const getFirstDesignImage = () => {
    for (const requests of Object.values(lead.designRequests)) {
      if (requests.length > 0) {
        return requests[0].designImage;
      }
    }
    return null;
  };

  const firstImage = getFirstDesignImage();

  return (
    <div
      onClick={() => onClick(lead.id)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#2B7516]"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {lead.customerAvatar ? (
                <img
                  src={lead.customerAvatar}
                  alt={lead.customerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-600">
                  {lead.customerName[0]}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {lead.customerName}
              </h3>
              <p className="text-sm text-gray-600 truncate">{lead.customerEmail}</p>
            </div>
          </div>

          {/* Status Badge */}
          <LeadStatusBadge status={lead.status} />
        </div>

        {/* Design Preview */}
        <div className="flex items-center gap-3 mb-4">
          {firstImage && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={firstImage}
                alt="Design"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
              <ImageIcon size={16} />
              <span className="font-medium">
                {totalDesigns} Design{totalDesigns > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {Object.keys(lead.designRequests)
                .filter(roomType => lead.designRequests[roomType as keyof typeof lead.designRequests].length > 0)
                .map(type => type.replace('_', ' '))
                .join(', ')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{getTimeDiff(lead.lastContactAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            <span>{lead.totalMessages} messages</span>
          </div>
        </div>

        {/* Budget (if available) */}
        {lead.budget && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Budget: <span className="font-semibold text-gray-900">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(lead.budget)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCard;