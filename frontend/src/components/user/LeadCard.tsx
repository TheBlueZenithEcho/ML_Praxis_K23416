import React from 'react';
import { MessageCircle, Clock, Image as ImageIcon } from 'lucide-react';

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

interface LeadCardProps {
    lead: CustomerLead;
    onClick: (leadId: string) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
    const allDesigns: Design[] = Object.values(lead.designRequests).flat();

    const getTimeDiff = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just now';
    };

    return (
        <div
            onClick={() => onClick(lead.id)}
            className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md border border-gray-200"
        >
            {/* Header lead */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {lead.customerAvatar ? (
                        <img
                            src={lead.customerAvatar}
                            alt={lead.customerName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-lg text-gray-600">{lead.customerName[0]}</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{lead.customerName}</h3>
                    <p className="text-sm text-gray-600 truncate">
                        {Object.keys(lead.designRequests)
                            .filter(type => lead.designRequests[type].length > 0)
                            .join(', ')}
                    </p>
                </div>
            </div>

            {/* Hiển thị từng thiết kế theo chiều dọc */}
            <div className="space-y-3 mb-4">
                {allDesigns.map(d => (
                    <div key={d.id} className="flex items-center gap-3 border p-2 rounded">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                                src={d.img || '/placeholder.png'}
                                alt={d.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{d.name}</h4>
                            <p className="text-sm text-gray-600 truncate">
                                Designer: {d.designer}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                                Room: {d['type room']}
                            </p>
                            <p className="text-sm text-gray-500">
                                Created: {new Date(d.createdt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{getTimeDiff(lead.lastContactAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle size={16} />
                    <span>{lead.totalMessages} messages</span>
                </div>
            </div>
        </div>
    );
};

export default LeadCard;
