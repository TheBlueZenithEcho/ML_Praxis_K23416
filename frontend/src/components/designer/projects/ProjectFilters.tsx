import React from 'react';
import { ProjectStatus, ProjectPriority } from '@/types';
import { Filter, SortAsc } from 'lucide-react';

interface ProjectFiltersProps {
  selectedStatus: ProjectStatus | 'all';
  selectedPriority: ProjectPriority | 'all';
  sortBy: 'date' | 'name' | 'progress';
  onStatusChange: (status: ProjectStatus | 'all') => void;
  onPriorityChange: (priority: ProjectPriority | 'all') => void;
  onSortChange: (sort: 'date' | 'name' | 'progress') => void;
  onSearch: (query: string) => void;
  totalCount: number;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  selectedStatus,
  selectedPriority,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onSearch,
  totalCount
}) => {
  const statusOptions: Array<{ value: ProjectStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Status' },
    { value: ProjectStatus.CONSULTATION, label: 'Consultation' },
    { value: ProjectStatus.PRODUCT_CURATION, label: 'Product Curation' },
    { value: ProjectStatus.FINALIZE_QUOTE, label: 'Finalizing Quote' },
    { value: ProjectStatus.COMPLETED, label: 'Completed' }
  ];

  const priorityOptions: Array<{ value: ProjectPriority | 'all'; label: string }> = [
    { value: 'all', label: 'All Priority' },
    { value: ProjectPriority.URGENT, label: 'Urgent' },
    { value: ProjectPriority.HIGH, label: 'High' },
    { value: ProjectPriority.MEDIUM, label: 'Medium' },
    { value: ProjectPriority.LOW, label: 'Low' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Recent' },
    { value: 'name', label: 'Name' },
    { value: 'progress', label: 'Progress' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by customer name or project title..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as ProjectStatus | 'all')}
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
            onChange={(e) => onPriorityChange(e.target.value as ProjectPriority | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent bg-white"
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc size={18} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'date' | 'name' | 'progress')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent bg-white"
          >
            {sortOptions.map(option => (
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
          Showing <span className="font-semibold text-gray-900">{totalCount}</span> project{totalCount !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default ProjectFilters;