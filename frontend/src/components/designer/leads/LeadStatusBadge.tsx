import React from 'react';
import { LeadStatus } from '@/types';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

// 1. ĐỊNH NGHĨA MỘT STYLE MẶC ĐỊNH
const defaultConfig = {
  label: 'Unknown',
  bgColor: 'bg-gray-100',
  textColor: 'text-gray-800',
  dotColor: 'bg-gray-500'
};

const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    [LeadStatus.NEW]: {
      label: 'New',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      dotColor: 'bg-blue-500'
    },
    [LeadStatus.CONSULTING]: {
      label: 'Consulting',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      dotColor: 'bg-yellow-500'
    },
    [LeadStatus.QUALIFIED]: {
      label: 'Qualified',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      dotColor: 'bg-green-500'
    },
    [LeadStatus.CONVERTED]: {
      label: 'Converted',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      dotColor: 'bg-purple-500'
    },
    [LeadStatus.CANCELLED]: {
      label: 'Cancelled',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      dotColor: 'bg-gray-500'
    }
  };

  const config = statusConfig[status] || defaultConfig;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        ${config.bgColor} ${config.textColor} ${className}
      `}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      
      {/* 
          Hiển thị label từ config, hoặc 'status' gốc, hoặc 'Unknown' 
      */}
      {config.label || status || 'Unknown'}
    </span>
  );
};

export default LeadStatusBadge;