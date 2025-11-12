import React from 'react';
import { LeadStatus, LeadPriority } from '@/types';
import { Filter } from 'lucide-react';

interface LeadFiltersProps {
  selectedStatus: LeadStatus | 'all';
  selectedPriority: LeadPriority | 'all';
  onStatusChange: (status: LeadStatus | 'all') => void;
  onPriorityChange: (priority: LeadPriority | 'all') => void;
  onSearch: (query: string) => void;
  totalCount: number;
}

const LeadFilters: React.FC<LeadFiltersProps> = ({
  selectedStatus,
  selectedPriority,
  onStatusChange,
  onPriorityChange,
  onSearch,
  totalCount
}) => {
  const statusOptions: Array<{ value: LeadStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: LeadStatus.NEW, label: 'New' },
    { value: LeadStatus.CONSULTING, label: 'Consulting' },
    { value: LeadStatus.QUALIFIED, label: 'Qualified' },
    { value: LeadStatus.CANCELLED, label: 'Cancelled' }
  ];

  const priorityOptions: Array<{ value: LeadPriority | 'all'; label: string }> = [
    { value: 'all', label: 'All Priority' },
    { value: LeadPriority.URGENT, label: 'Urgent' },
    { value: LeadPriority.HIGH, label: 'High' },
    { value: LeadPriority.MEDIUM, label: 'Medium' },
    { value: LeadPriority.LOW, label: 'Low' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by customer name or email..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as LeadStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent bg-white"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as LeadPriority | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent bg-white"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Count */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{totalCount}</span> lead{totalCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default LeadFilters;