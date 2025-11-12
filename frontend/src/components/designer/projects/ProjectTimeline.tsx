import React from 'react';
import { ProjectStatus } from '@/types';
// SỬA 1: Thêm 'Calendar' vào import
import { CheckCircle, Circle, ArrowRight, Calendar } from 'lucide-react';

interface ProjectTimelineProps {
  currentStatus: ProjectStatus;
  onStatusChange?: (status: ProjectStatus) => void;
  isLocked?: boolean;
  onDetailedStatusUpdate?: () => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  currentStatus,
  onStatusChange,
  isLocked = false,
  onDetailedStatusUpdate
}) => {
  const statuses = [
    {
      value: ProjectStatus.CONSULTATION,
      label: 'Consultation',
      description: 'Initial consultation & survey'
    },
    {
      value: ProjectStatus.PRODUCT_CURATION,
      label: 'Product Curation',
      description: 'Selecting & arranging products'
    },
    {
      value: ProjectStatus.FINALIZE_QUOTE,
      label: 'Finalize & Quote',
      description: 'Finalizing products & creating quote'
    },
    {
      value: ProjectStatus.COMPLETED,
      label: 'Completed',
      description: 'Project completed'
    }
  ];

  const currentIndex = statuses.findIndex(s => s.value === currentStatus);

  const getStatusStyle = (index: number) => {
    if (index < currentIndex) {
      // Completed
      return {
        iconBg: 'bg-green-500',
        iconText: 'text-white',
        textColor: 'text-gray-900',
        lineColor: 'bg-green-500'
      };
    } else if (index === currentIndex) {
      // Current
      return {
        iconBg: 'bg-[#2B7516]',
        iconText: 'text-white',
        textColor: 'text-gray-900',
        lineColor: 'bg-gray-300'
      };
    } else {
      // Upcoming
      return {
        iconBg: 'bg-gray-200',
        iconText: 'text-gray-400',
        textColor: 'text-gray-500',
        lineColor: 'bg-gray-300'
      };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Status</h3>

      <div className="relative">
        {statuses.map((status, index) => {
          const style = getStatusStyle(index);
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = !isLocked && onStatusChange && (index <= currentIndex + 1);

          return (
            <div key={status.value} className="relative">
              {/* Timeline item */}
              <div className="flex items-start gap-4 mb-8 last:mb-0">
                {/* Icon */}
                <button
                  onClick={() => isClickable && onStatusChange(status.value)}
                  disabled={!isClickable}
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${style.iconBg} ${style.iconText}
                    ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                    transition-all duration-200
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Circle size={20} fill={isCurrent ? 'white' : 'none'} />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold ${style.textColor}`}>
                      {status.label}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-1 bg-[#E6F3E6] text-[#2B7516] text-xs font-semibold rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{status.description}</p>
                </div>
              </div>

              {/* Connecting line */}
              {index < statuses.length - 1 && (
                <div className="absolute left-5 top-10 w-0.5 h-8 -translate-x-1/2">
                  <div className={`w-full h-full ${style.lineColor}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      {!isLocked && currentIndex < statuses.length - 1 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => onStatusChange && onStatusChange(statuses[currentIndex + 1].value)}
            className="w-full px-4 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors flex items-center justify-center gap-2"
          >
            Move to {statuses[currentIndex + 1].label}
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Detailed Status Management Button */}
      {!isLocked && onDetailedStatusUpdate && (
        <div className={`${currentIndex < statuses.length - 1 ? 'mt-3' : 'mt-6 pt-6 border-t'}`}>
          <button
            type="button"
            onClick={onDetailedStatusUpdate}
            className="w-full px-4 py-2 border-2 border-[#2B7516] text-[#2B7516] rounded-lg hover:bg-[#E6F3E6] transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Calendar size={18} />
            Manage Progress Details
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectTimeline;