import React from 'react';
import { Calendar, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import type { Project } from '@/types';
import ProjectStatusBadge from './ProjectStatusBadge';

interface ProjectCardProps {
  project: Project;
  onClick: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTimeDiff = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const completionPercentage = project.totalTasks > 0 
    ? Math.round((project.completedTasks / project.totalTasks) * 100)
    : 0;

  // Get first design image
  const firstDesignImage = project.designs[0]?.designImage;

  return (
    <div
      onClick={() => onClick(project.id)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 hover:border-[#2B7516] overflow-hidden"
    >
      {/* Image Header */}
      {firstDesignImage && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={firstDesignImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <ProjectStatusBadge status={project.status} />
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Customer Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {project.customerAvatar ? (
              <img
                src={project.customerAvatar}
                alt={project.customerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-600">
                {project.customerName[0]}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {project.customerName}
            </h3>
            <p className="text-sm text-gray-600 truncate">{project.title}</p>
          </div>
        </div>

        {/* Designs Count */}
        <div className="mb-3 pb-3 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            {project.designs.length} design{project.designs.length > 1 ? 's' : ''} • 
            {' '}{project.designs.reduce((sum, d) => sum + d.products.length, 0)} products
          </p>
        </div>

        {/* Progress */}
        {project.totalTasks > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-600">Tasks Progress</p>
              <p className="text-xs font-semibold text-gray-900">
                {completionPercentage}%
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#2B7516] h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {project.completedTasks}/{project.totalTasks} tasks completed
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar size={16} />
            <span>{getTimeDiff(project.updatedAt)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Revisions Warning */}
            {project.totalRevisions > 5 && (
              <div className="flex items-center gap-1 text-orange-600" title="Many revisions">
                <AlertCircle size={16} />
                <span className="text-xs">{project.totalRevisions}</span>
              </div>
            )}
            
            {/* Quote Status */}
            {project.quoteStatus && (
              <div className="flex items-center gap-1 text-green-600" title="Quote ready">
                <CheckCircle size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Budget */}
        {project.estimatedBudget && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Budget: <span className="font-semibold text-gray-900">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(project.estimatedBudget)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;