import React, { useState, useMemo, useEffect } from 'react';
// 1. THÊM 'useParams'
import { useNavigate, useParams } from 'react-router-dom'; 
import type { Lead } from '@/types';
import { LeadStatus, LeadPriority } from '@/types';
import { RoomType } from '@/types';
import LeadFilters from '@/components/designer/leads/LeadFilters';
import LeadList from '@/components/designer/leads/LeadList';


const LeadManagementPage: React.FC = () => {
  const navigate = useNavigate();
  // 2. LẤY ID CỦA DESIGNER TỪ URL
  const { id: designerId } = useParams<{ id: string }>();

  // (State, useEffect, useMemo giữ nguyên)
  const [leads, setLeads] = useState<Lead[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<LeadPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('https://api.npoint.io/64fd51b557b604029f4b');
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        const data: Lead[] = await response.json();
        setLeads(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (selectedStatus !== 'all' && lead.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && lead.priority !== selectedPriority) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          lead.customerName.toLowerCase().includes(query) ||
          lead.customerEmail.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [leads, selectedStatus, selectedPriority, searchQuery]);

  // 3. SỬA LẠI HÀM CLICK ĐỂ THÊM 'designerId'
  const handleLeadClick = (leadId: string) => {
    navigate(`/designer/${designerId}/leads/${leadId}`);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* (Toàn bộ JSX Header, Summary Cards, Filters giữ nguyên) */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leads</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your assigned consultation requests
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{leads.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">New</p>
            <p className="text-2xl font-bold text-blue-600">
              {leads.filter(l => l.status === LeadStatus.NEW).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Consulting</p>
            <p className="text-2xl font-bold text-yellow-600">
              {leads.filter(l => l.status === LeadStatus.CONSULTING).length}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Qualified</p>
            <p className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.status === LeadStatus.QUALIFIED).length}
            </p>
          </div>
        </div>
        <LeadFilters
          selectedStatus={selectedStatus}
          selectedPriority={selectedPriority}
          onStatusChange={setSelectedStatus}
          onPriorityChange={setSelectedPriority}
          onSearch={setSearchQuery}
          totalCount={filteredLeads.length}
        />
        
        {/* (Phần JSX Loading/Error/List giữ nguyên) */}
        {isLoading && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600 dark:text-gray-300">Loading leads...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-10 text-red-600">
            <p className="font-semibold">Failed to load leads</p>
            <p>{error.message}</p>
          </div>
        )}
        {!isLoading && !error && (
          <LeadList
            leads={filteredLeads}
            isLoading={isLoading}
            onLeadClick={handleLeadClick}
          />
        )}
      </div>
    </div>
  );
};

export default LeadManagementPage;