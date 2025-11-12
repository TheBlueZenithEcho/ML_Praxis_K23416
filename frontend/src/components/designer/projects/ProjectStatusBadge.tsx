import React from 'react';
import { ProjectStatus } from '@/types';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

// 1. ĐỊNH NGHĨA MỘT STYLE MẶC ĐỊNH
const defaultConfig = {
  label: 'Unknown',
  bgColor: 'bg-gray-100',
  textColor: 'text-gray-800',
  dotColor: 'bg-gray-500'
};

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    [ProjectStatus.CONSULTATION]: {
      label: 'Consultation',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      dotColor: 'bg-blue-500'
    },
    [ProjectStatus.PRODUCT_CURATION]: {
      label: 'Product Curation',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      dotColor: 'bg-purple-500'
    },
    [ProjectStatus.FINALIZE_QUOTE]: {
      label: 'Finalizing Quote',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      dotColor: 'bg-orange-500'
    },
    [ProjectStatus.COMPLETED]: {
      label: 'Completed',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      dotColor: 'bg-green-500'
    },
    [ProjectStatus.CANCELLED]: {
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
          Hiển thị label an toàn
      */}
      {config.label || status || 'Unknown'}
    </span>
  );
};

export default ProjectStatusBadge;