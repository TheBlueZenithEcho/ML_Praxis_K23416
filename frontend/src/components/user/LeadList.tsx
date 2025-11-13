import React from 'react';
import LeadCard from './LeadCard';

interface Design {
    id: number;
    img: string;
    name: string;
    designer: string;
    createdt: string;
    "type room": string;
}

interface CustomerLead {
    id: string;
    customerName: string;
    customerAvatar?: string;
    designRequests: Record<string, Design[]>;
    lastContactAt: string;
    totalMessages: number;
    budget?: number;
}

interface LeadListProps {
    leads: CustomerLead[];
    onLeadClick: (leadId: string) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, onLeadClick }) => {
    if (!leads || leads.length === 0) {
        return (
            <div className="text-gray-500 text-center py-6">
                Không có thiết kế nào trong Design Tab.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onClick={onLeadClick} />
            ))}
        </div>
    );
};

export default LeadList;
