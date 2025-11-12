import React, { useState, useEffect } from 'react';
// 1. THÊM 'useParams'
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import type { Lead } from '@/types';
import { LeadStatus } from '@/types';
import type { Message } from '@/types';
import { SenderRole, MessageType } from '@/types';
import { RoomType } from '@/types';
import LeadStatusBadge from '@/components/designer/leads/LeadStatusBadge';
import ChatBox from '@/components/designer/chat/ChatBox';
import DesignRequestSection from '@/components/designer/leads/DesignRequestSection';
import AcceptLeadModal from '@/components/designer/leads/AcceptLeadModal';

const LeadDetailPage: React.FC = () => {
  // 2. SỬA 'useParams' ĐỂ LẤY CẢ 2 ID
  const { id: designerId, leadId } = useParams<{ id: string, leadId: string }>();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  // 3. SỬA 'useEffect' ĐỂ DÙNG 'leadId'
  useEffect(() => {
    if (!leadId) { // Sửa: Dùng leadId
      setError(new Error('No lead ID provided'));
      setIsLoading(false);
      return;
    }

    const fetchLeadDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const leadsApiUrl = 'https://api.npoint.io/8701a505fa63d2d0a315';
        const messagesApiUrl = 'https://api.npoint.io/9940945160e152064685';

        const [leadsResponse, messagesResponse] = await Promise.all([
          fetch(leadsApiUrl),
          fetch(messagesApiUrl)
        ]);

        if (!leadsResponse.ok || !messagesResponse.ok) {
          throw new Error('Failed to fetch data from one or more endpoints');
        }

        const allLeads: Lead[] = await leadsResponse.json();
        const allMessages: Message[] = await messagesResponse.json();

        // 4. SỬA 'id' THÀNH 'leadId'
        const foundLead = allLeads.find(l => l.id === leadId);
        if (foundLead) {
          setLead(foundLead);
        } else {
          // Sửa: Dùng leadId
          throw new Error(`Lead with ID "${leadId}" not found.`);
        }

        // 5. SỬA 'id' THÀNH 'leadId'
        const foundMessages = allMessages.filter(m => m.chatId === leadId);
        setMessages(foundMessages);

      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeadDetails();
  }, [leadId]); // 6. SỬA dependency thành 'leadId'

  // (Các hàm handler giữ nguyên, chỉ sửa hàm 'handleAcceptLead' và 'handleRejectLead')
  const handleSendMessage = (message: string, files?: File[]) => {
    if (!lead) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      chatId: lead.id, // Dùng lead.id (ví dụ '1') làm chatId
      senderId: 'd1',
      senderRole: SenderRole.DESIGNER,
      // ...
      content: message,
      status: 'sent' as any,
      isEdited: false,
      isDeleted: false,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAcceptLead = async (data: any) => {
    console.log('Converting lead to project:', data);
    // 7. SỬA HÀM NAVIGATE (thêm 'designerId')
    navigate(`/designer/${designerId}/projects/new-project-id`);
  };

  const handleRejectLead = () => {
    if (confirm('Are you sure you want to reject this lead?')) {
      console.log('Rejecting lead');
      // 8. SỬA HÀM NAVIGATE (thêm 'designerId')
      navigate(`/designer/${designerId}/leads`);
    }
  };

  // (Phần JSX Loading/Error/Not Found giữ nguyên)
  if (isLoading) {
    return (
      <div className="py-8 px-4 text-center text-gray-600 dark:text-gray-300">
        Loading lead details...
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-8 px-4 text-center text-red-600">
        <p className="font-semibold">Failed to load lead</p>
        <p>{error.message}</p>
      </div>
    );
  }
  if (!lead) {
    return (
      <div className="py-8 px-4 text-center text-gray-600 dark:text-gray-300">
        Lead not found.
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                // 9. SỬA HÀM NAVIGATE (thêm 'designerId')
                onClick={() => navigate(`/designer/${designerId}/leads`)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft size={20} />
              </button>
              {/* (Info, Badge... giữ nguyên) */}
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Lead: {lead.customerName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">{lead.customerEmail}</p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </div>
            {/* (Action Buttons giữ nguyên) */}
            {lead.status !== LeadStatus.CONVERTED && lead.LOCKED_OR_CANCELLED_LOGIC && (
              <div className="flex gap-2">
                 {/* ... (các nút Reject/Accept) ... */}
                 <button
                  onClick={handleRejectLead}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
                >
                  <XCircle size={18} />
                  Reject Lead
                </button>
                <button
                  onClick={() => setShowAcceptModal(true)}
                  className="px-4 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Accept & Convert to Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content (Toàn bộ JSX bên dưới giữ nguyên) */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Section */}
          <div className="h-[calc(100vh-200px)]">
            <ChatBox
              messages={messages}
              currentUserId="d1"
              customerName={lead.customerName}
              customerAvatar={lead.customerAvatar}
              onSendMessage={handleSendMessage}
              onSearchClick={() => setShowSearchOverlay(true)}
            />
          </div>
          {/* Design Requests Section */}
          <div className="h-[calc(100vh-200px)] overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
               {/* ... (Customer Interests) ... */}
               <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Customer Interests
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Budget</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {lead.budget ? new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(lead.budget) : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Preferred Styles</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {lead.preferredStyle?.join(', ') || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Design Requests
              </h2>
              <DesignRequestSection
                designRequests={lead.designRequests}
                onProductAdd={(designId, productId) => {
                  console.log('Add product to design:', designId);
                  setShowSearchOverlay(true);
                }}
                onProductRemove={(designId, productId) => {
                  console.log('Remove product:', designId, productId);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <AcceptLeadModal
        lead={lead}
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
        onConfirm={handleAcceptLead}
      />
      {showSearchOverlay && (
         <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
           {/* ... (Modal nội dung search) ... */}
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold dark:text-white">Search Products</h3>
              <button
                onClick={() => setShowSearchOverlay(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300">Product search component will be here...</p>
          </div>
         </div>
      )}
    </>
  );
};

export default LeadDetailPage;