import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ChatBox from '@/components/user/ChatBox';
import LeadList from '@/components/user/LeadList';
import {
    Message,
    MessageType,
    MessageStatus,
    SenderRole,
    MessageAttachment,
} from '@/types';

// --- Interface ---
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

const ConsultationPage: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [leads, setLeads] = useState<CustomerLead[]>([]);

    // --- Load từ localStorage + xử lý pending designs ---
    useEffect(() => {
        if (!user?.id) return;

        // 1️⃣ Load leads + messages từ localStorage
        const savedLeads: CustomerLead[] = JSON.parse(localStorage.getItem(`leads_${user.id}`) || "[]");
        const savedMessages: Message[] = JSON.parse(localStorage.getItem(`messages_${user.id}`) || "[]");
        setLeads(savedLeads);
        setMessages(savedMessages);

        // 2️⃣ Kiểm tra pending designs từ DesignTab
        const pendingKey = `pendingDesigns_${user.id}`;
        const pendingDesigns: Design[] = JSON.parse(localStorage.getItem(pendingKey) || '[]');

        if (pendingDesigns.length > 0) {
            const grouped: Record<string, Design[]> = {};
            pendingDesigns.forEach(d => {
                const type = d["type room"] || "Unknown Room";
                if (!grouped[type]) grouped[type] = [];
                grouped[type].push(d);
            });

            const newLead: CustomerLead = {
                id: 'lead-' + Date.now(),
                customerName: user.name,
                customerAvatar: user.img,
                designRequests: grouped,
                lastContactAt: new Date().toISOString(),
                totalMessages: 0,
            };

            setLeads(prev => {
                const updated = [newLead, ...prev];
                localStorage.setItem(`leads_${user.id}`, JSON.stringify(updated));
                return updated;
            });

            const designMessages: Message[] = pendingDesigns.map((design, idx) => ({
                id: Date.now().toString() + idx,
                chatId: 'consultation',
                senderId: user.id,
                senderRole: SenderRole.CUSTOMER,
                senderName: user.name,
                senderAvatar: user.img,
                type: MessageType.DESIGN,
                content: '',
                attachments: [
                    {
                        id: design.id.toString(),
                        type: MessageType.DESIGN,
                        name: design.name,
                        url: design.img || '/placeholder.png',
                        thumbnailUrl: design.img || '/placeholder.png',
                        metadata: {
                            designer: design.designer,
                            roomType: design['type room'] || 'Unknown Room',
                            createdAt: design.createdt,
                        },
                    },
                ],
                status: MessageStatus.SENT,
                isEdited: false,
                isDeleted: false,
                sentAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));

            setMessages(prev => {
                const updatedMessages = [...prev, ...designMessages];
                localStorage.setItem(`messages_${user.id}`, JSON.stringify(updatedMessages));
                return updatedMessages;
            });

            localStorage.removeItem(pendingKey);
        }
    }, [user]);

    // --- Gửi tin nhắn văn bản ---
    const handleSendMessage = useCallback(
        (content: string, attachments?: File[] | MessageAttachment[]) => {
            if (!user) return;

            const newMessage: Message = {
                id: Date.now().toString() + Math.random(),
                chatId: 'consultation',
                senderId: user.id,
                senderRole: SenderRole.CUSTOMER,
                senderName: user.name,
                senderAvatar: user.img,
                type: MessageType.TEXT,
                content,
                attachments: attachments
                    ? Array.isArray(attachments)
                        ? attachments.map((a, idx) =>
                            'id' in a
                                ? a
                                : {
                                    id: Date.now().toString() + idx,
                                    type: MessageType.FILE,
                                    name: (a as File).name,
                                    url: URL.createObjectURL(a as File),
                                }
                        )
                        : []
                    : [],
                status: MessageStatus.SENT,
                isEdited: false,
                isDeleted: false,
                sentAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setMessages(prev => {
                const updated = [...prev, newMessage];
                localStorage.setItem(`messages_${user.id}`, JSON.stringify(updated));
                return updated;
            });
        },
        [user]
    );

    // --- Lắng nghe event từ DesignTab ---
    useEffect(() => {
        const handleDesignTabChange = (e: Event) => {
            const customEvent = e as CustomEvent<Design[]>;
            const savedDesigns = customEvent.detail;
            if (!savedDesigns || savedDesigns.length === 0) return;
            if (!user?.id) return;

            const grouped: Record<string, Design[]> = {};
            savedDesigns.forEach(d => {
                const type = d["type room"] || "Unknown Room";
                if (!grouped[type]) grouped[type] = [];
                grouped[type].push(d);
            });

            const newLead: CustomerLead = {
                id: 'lead-' + Date.now(),
                customerName: user.name,
                customerAvatar: user.img,
                designRequests: grouped,
                lastContactAt: new Date().toISOString(),
                totalMessages: 0,
            };

            setLeads(prev => {
                const updatedLeads = [newLead, ...prev];
                localStorage.setItem(`leads_${user.id}`, JSON.stringify(updatedLeads));
                return updatedLeads;
            });

            const designMessages: Message[] = savedDesigns.map((design, idx) => ({
                id: Date.now().toString() + idx,
                chatId: 'consultation',
                senderId: user.id,
                senderRole: SenderRole.CUSTOMER,
                senderName: user.name,
                senderAvatar: user.img,
                type: MessageType.DESIGN,
                content: '',
                attachments: [
                    {
                        id: design.id.toString(),
                        type: MessageType.DESIGN,
                        name: design.name,
                        url: design.img || '/placeholder.png',
                        thumbnailUrl: design.img || '/placeholder.png',
                        metadata: {
                            designer: design.designer,
                            roomType: design['type room'] || 'Unknown Room',
                            createdAt: design.createdt,
                        },
                    },
                ],
                status: MessageStatus.SENT,
                isEdited: false,
                isDeleted: false,
                sentAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }));

            setMessages(prev => {
                const updatedMessages = [...prev, ...designMessages];
                localStorage.setItem(`messages_${user.id}`, JSON.stringify(updatedMessages));
                return updatedMessages;
            });
        };

        window.addEventListener('sendDesignsToChat', handleDesignTabChange);
        return () => window.removeEventListener('sendDesignsToChat', handleDesignTabChange);
    }, [user]);

    // --- Render ---
    return (
        <div className="h-screen flex flex-col md:flex-row bg-gray-50">
            {/* Bên trái: LeadList */}
            <div className="w-full md:w-96 border-b md:border-r border-gray-200 p-4 overflow-y-auto">
                <LeadList
                    leads={leads}
                    onLeadClick={id => console.log('Clicked lead', id)}
                />
            </div>

            {/* Bên phải: ChatBox */}
            <div className="flex-1 w-full p-4 flex flex-col overflow-hidden">
                <ChatBox
                    messages={messages}
                    currentUserId={user?.id || ''}
                    customerName="Designer"
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default ConsultationPage;
