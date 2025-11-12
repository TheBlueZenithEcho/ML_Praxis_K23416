import React, { useState, useEffect } from 'react'; 
// 1. THÊM 'useParams'
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Save, Send } from 'lucide-react';
import type { Project } from '@/types';
import { ProjectStatus } from '@/types';
import type { Message, MessageAttachment } from '@/types';
import { SenderRole, MessageType } from '@/types';
import { RoomType } from '@/types';
import type { Product } from '@/types';
import ProjectStatusBadge from '@/components/designer/projects/ProjectStatusBadge';
import ChatBox from '@/components/designer/chat/ChatBox';
import ProjectTimeline from '@/components/designer/projects/ProjectTimeline';
import ProjectDesignSection from '@/components/designer/projects/ProjectDesignSection';
import ProductSearchOverlay from '@/components/designer/products/ProductSearchOverlay';

const ProjectDetailPage: React.FC = () => {
  // 2. SỬA 'useParams' ĐỂ LẤY CẢ 2 ID
  const { id: designerId, projectId } = useParams<{ id: string, projectId: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null); 
  const [messages, setMessages] = useState<Message[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 3. SỬA 'useEffect' ĐỂ DÙNG 'projectId'
  useEffect(() => {
    if (!projectId) { // Sửa: Dùng projectId
      setError(new Error('No project ID provided'));
      setIsLoading(false);
      return;
    }

    const fetchProjectDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const projectsApiUrl = 'https://api.npoint.io/9cdfdb79e1cae97f23a7'; 
        const messagesApiUrl = 'https://api.npoint.io/d0ebcfa8b04becebc837'; 

        const [projectResponse, messagesResponse] = await Promise.all([
          fetch(projectsApiUrl),
          fetch(messagesApiUrl)
        ]);

        if (!projectResponse.ok || !messagesResponse.ok) {
          throw new Error('Failed to fetch data from one or more endpoints');
        }

        const allProjects: Project[] = await projectResponse.json();
        const allMessages: Message[] = await messagesResponse.json();

        // 4. SỬA 'id' THÀNH 'projectId'
        const foundProject = allProjects.find(p => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        } else {
          // Sửa: Dùng projectId
          throw new Error(`Project with ID "${projectId}" not found.`);
        }

        // 5. SỬA 'id' THÀNH 'projectId'
        const foundMessages = allMessages.filter(m => m.chatId === projectId);
        setMessages(foundMessages);

      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]); // 6. SỬA dependency thành 'projectId'

  
  // (Các hàm handler từ 118 đến 268 giữ nguyên, chỉ sửa hàm 'handleExportQuote')
  const handleSendMessage = (message: string, files?: File[]) => {
    if (!project) return;
    const newMessage: Message = {
      id: `m${Date.now()}`,
      chatId: project.id, // Dùng project.id (ví dụ: 'p1') làm chatId
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
  const handleStatusChange = (newStatus: ProjectStatus) => {
    if (!project) return;
    setProject(prev => prev ? ({ ...prev, status: newStatus }) : null);
  };
  const handleProductAdd = (designId: string) => {
    setShowSearchOverlay(true);
  };
  const handleProductRemove = (designId: string, productId: string) => {
    if (!project) return;
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        designs: prev.designs.map(design =>
          design.designId === designId
            ? { ...design, products: design.products.filter(p => p.productId !== productId) }
            : design
        )
      };
    });
    setHasUnsavedChanges(true);
  };
  const handleProductEdit = (designId: string, productId: string) => {
    console.log('Edit product:', designId, productId);
  };
  const handleProductSelect = (product: Product, quantity: number) => {
    if (!project) return;
    const firstDesign = project.designs[0];
    if (!firstDesign) return;
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        designs: prev.designs.map((design, index) =>
          index === 0
            ? { ...design, products: [...design.products, { productId: product.id, product, quantity }] }
            : design
        )
      };
    });
    setHasUnsavedChanges(true);
    setShowSearchOverlay(false);
  };
  const sendProductListToChat = () => {
    if (!project) return;
    const productAttachments: MessageAttachment[] = [];
    project.designs.forEach(design => {
      design.products.forEach(item => {
        productAttachments.push({
          id: `att-${item.productId}`,
          type: 'product',
          name: item.product.name,
          url: item.product.thumbnailImage,
          thumbnailUrl: item.product.thumbnailImage,
          metadata: { /* ... */ }
        });
      });
    });
    const productListMessage: Message = {
      id: `m${Date.now()}`,
      chatId: project.id,
      senderId: 'd1',
      senderRole: SenderRole.DESIGNER,
      // ...
      content: `Đã cập nhật danh sách sản phẩm...`,
      attachments: productAttachments,
      status: 'sent' as any,
      isEdited: false,
      isDeleted: false,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, productListMessage]);
  };
  const handleSaveChanges = async () => {
    if (!project) return;
    if (!hasUnsavedChanges) return alert('No changes to save');
    setIsSaving(true);
    try {
      console.log('Saving product changes:', project.designs);
      await new Promise(resolve => setTimeout(resolve, 1500));
      sendProductListToChat();
      setHasUnsavedChanges(false);
      alert('Product list saved and sent to customer!');
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportQuote = async () => {
    if (!project) return;
    setIsExporting(true);
    try {
      console.log('Exporting quote for approval:', { /* ... */ });
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Quote sent to admin for approval!');
      // 7. SỬA HÀM NAVIGATE (thêm 'designerId')
      navigate(`/designer/${designerId}/projects`);
    } catch (error) {
      console.error('Failed to export quote:', error);
      alert('Failed to export quote. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // (Phần JSX Loading/Error/Not Found giữ nguyên)
  if (isLoading) {
    return (
      <div className="py-8 px-4 text-center text-gray-600 dark:text-gray-300">
        Loading project details...
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-8 px-4 text-center text-red-600">
        <p className="font-semibold">Failed to load project</p>
        <p>{error.message}</p>
      </div>
    );
  }
  if (!project) {
    return (
      <div className="py-8 px-4 text-center text-gray-600 dark:text-gray-300">
        Project not found.
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
                // 8. SỬA HÀM NAVIGATE (thêm 'designerId')
                onClick={() => navigate(`/designer/${designerId}/projects`)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft size={20} />
              </button>
              {/* (Info, Badge... giữ nguyên) */}
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {project.customerName} • Started {new Date(project.startDate).toLocaleDateString()}
                </p>
              </div>
              <ProjectStatusBadge status={project.status} />
              {hasUnsavedChanges && (
                <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full">
                  Unsaved Changes
                </span>
              )}
            </div>
            {/* (Action Buttons giữ nguyên) */}
            {!project.isLocked && (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveChanges}
                  disabled={!hasUnsavedChanges || isSaving}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleExportQuote}
                  disabled={hasUnsavedChanges || isExporting}
                  className="px-4 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  title={hasUnsavedChanges ? 'Please save changes first' : 'Export quote for admin approval'}
                >
                  <Send size={18} />
                  {isExporting ? 'Exporting...' : 'Export Quote'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content (Toàn bộ JSX bên dưới giữ nguyên) */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chat */}
          <div className="lg:col-span-2">
            <div className="h-[calc(100vh-200px)]">
              <ChatBox
                messages={messages}
                currentUserId="d1"
                customerName={project.customerName}
                customerAvatar={project.customerAvatar}
                isLocked={project.isLocked}
                onSendMessage={handleSendMessage}
                onSearchClick={() => setShowSearchOverlay(true)}
              />
            </div>
          </div>
          {/* Right Column - Project Info */}
          <div className="space-y-6">
            <ProjectTimeline
              currentStatus={project.status}
              onStatusChange={handleStatusChange}
              isLocked={project.isLocked}
            />
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Info</h3>
              <div className="space-y-3 text-sm">
                 {/* ... (các trường Budget, End, Tasks, Revisions) ... */}
                 <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Budget</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(project.estimatedBudget || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Expected End</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(project.expectedEndDate || '').toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Tasks</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {project.completedTasks}/{project.totalTasks} completed
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Revisions</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {project.totalRevisions}
                  </span>
                </div>
              </div>
            </div>
            {!project.isLocked && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                 {/* ... (Info Box) ... */}
                 <p className="text-sm text-blue-900 font-semibold mb-2">💡 Workflow:</p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Adjust products based on customer feedback</li>
                  <li><strong>Save</strong> → Products sent to customer chat</li>
                  <li><strong>Export</strong> → Quote sent to admin for approval</li>
                </ol>
              </div>
            )}
          </div>
        </div>
        {/* Designs Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Designs & Products</h2>
          <ProjectDesignSection
            designs={project.designs}
            isLocked={project.isLocked}
            onProductAdd={handleProductAdd}
            onProductRemove={handleProductRemove}
            onProductEdit={handleProductEdit}
          />
        </div>
      </div>
      {/* Product Search Overlay */}
      <ProductSearchOverlay
        isOpen={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
        onProductSelect={handleProductSelect}
      />
    </>
  );
};

export default ProjectDetailPage;