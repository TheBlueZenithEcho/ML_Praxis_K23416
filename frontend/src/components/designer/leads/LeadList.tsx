import React from 'react';
import type { Lead, LeadStatus } from '@/types';
import LeadCard from './LeadCard';
import { Inbox } from 'lucide-react';

interface LeadListProps {
  leads: Lead[];
  isLoading?: boolean;
  onLeadClick: (leadId: string) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, isLoading, onLeadClick }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-10 h-10 border-4 border-[#2B7516] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Inbox size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads yet</h3>
        <p className="text-gray-600 max-w-md">
          When admin assigns leads to you, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.map(lead => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onClick={onLeadClick}
        />
      ))}
    </div>
  );
};

export default LeadList;