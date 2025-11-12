import React, { useState, useMemo, useEffect } from 'react';
// 1. THÊM 'useParams'
import { useNavigate, useParams } from 'react-router-dom'; 
import type { Project } from '@/types';
import { ProjectStatus, ProjectPriority } from '@/types';
import { RoomType } from '@/types';
import ProjectFilters from '@/components/designer/projects/ProjectFilters';
import ProjectList from '@/components/designer/projects/ProjectList';

const ProjectManagementPage: React.FC = () => {
  const navigate = useNavigate();
  // 2. LẤY ID CỦA DESIGNER TỪ URL
  const { id: designerId } = useParams<{ id: string }>();
  
  // (State, useEffect, useMemo giữ nguyên)
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<ProjectPriority | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'progress'>('date');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://api.npoint.io/b27c21ad8a89bfdfbb86');
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      if (selectedStatus !== 'all' && project.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && project.priority !== selectedPriority) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.customerName.toLowerCase().includes(query) ||
          project.title.toLowerCase().includes(query)
        );
      }
      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.customerName.localeCompare(b.customerName);
        case 'progress':
          const progressA = a.totalTasks > 0 ? a.completedTasks / a.totalTasks : 0;
          const progressB = b.totalTasks > 0 ? b.completedTasks / b.totalTasks : 0;
          return progressB - progressA;
        case 'date':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [projects, selectedStatus, selectedPriority, sortBy, searchQuery]);

  // 3. SỬA LẠI HÀM CLICK ĐỂ THÊM 'designerId'
  const handleProjectClick = (projectId: string) => {
    navigate(`/designer/${designerId}/projects/${projectId}`);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* (Toàn bộ JSX Header, Summary Cards, Filters giữ nguyên) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your active interior design projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Projects</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {projects.filter(p => 
                p.status === ProjectStatus.CONSULTATION || 
                p.status === ProjectStatus.PRODUCT_CURATION
              ).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Pending Quote</p>
            <p className="text-2xl font-bold text-orange-600">
              {projects.filter(p => p.status === ProjectStatus.FINALIZE_QUOTE).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {projects.filter(p => p.status === ProjectStatus.COMPLETED).length}
            </p>
          </div>
        </div>
        <ProjectFilters
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          sortBy={sortBy}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
          onSearch={setSearchQuery}
          totalCount={filteredProjects.length}
        />
        
        {/* (Phần JSX Loading/Error/List giữ nguyên) */}
        {isLoading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading projects...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-10 text-red-600">
            <p className="font-semibold">Failed to load projects</p>
            <p>{error.message}</p>
          </div>
        )}
        {!isLoading && !error && (
          <ProjectList
            projects={filteredProjects}
            isLoading={isLoading} 
            onProjectClick={handleProjectClick}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectManagementPage;