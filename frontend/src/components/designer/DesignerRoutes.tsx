import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DesignerLayout from './layout/DesignerLayout';
import ProfilePage from '@/pages/designer/Profile';
import DashboardPage from '@/pages/designer/Dashboard';
import LeadManagementPage from '@/pages/designer/LeadManagement';
import LeadDetailPage from '@/pages/designer/LeadDetail';
import ProjectManagementPage from '@/pages/designer/ProjectManagement';
import CreateDesignPage from '@/pages/designer/CreateDesign';
import ProjectDetailPage from '@/pages/designer/ProjectDetail';

const DesignerRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Wrap all routes in DesignerLayout */}
      <Route element={<DesignerLayout />}>
        {/* Default redirect to profile */}
        <Route index element={<Navigate to="profile" replace />} />

        {/* Profile */}
        <Route path="profile" element={<ProfilePage />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Leads */}
        <Route path="leads" element={<LeadManagementPage />} />
        <Route path="leads/:id" element={<LeadDetailPage />} />

        {/* Projects */}
        <Route path="projects" element={<ProjectManagementPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />

        {/* Designs */}
        <Route path="designs/create" element={<CreateDesignPage />} />

        {/* 404 within designer */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600">Designer page not found</p>
            </div>
          </div>
        } />
      </Route>
    </Routes>
  );
};

export default DesignerRoutes;