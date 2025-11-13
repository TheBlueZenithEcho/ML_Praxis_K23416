import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import type { Lead } from '@/types';

interface AcceptLeadModalProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { startDate: string; endDate: string; selectedDesignIds: string[] }) => Promise<void>;
}

const AcceptLeadModal: React.FC<AcceptLeadModalProps> = ({
  lead,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get all design IDs
  const allDesignIds = Object.values(lead.designRequests)
    .flat()
    .map(req => req.designId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onConfirm({
        startDate,
        endDate,
        selectedDesignIds: allDesignIds
      });
      onClose();
    } catch (error) {
      console.error('Failed to convert lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      {/* SỬA 1: Thêm 'flex flex-col' và xóa 'overflow-hidden' */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header (Thêm 'flex-shrink-0' để không bị co lại) */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Convert Lead to Project
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-300" />
          </button>
        </div>

        {/* SỬA 2: Thêm 'flex-1 overflow-hidden' vào form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          
          {/* SỬA 3: Thêm 'div' bọc nội dung, cho phép cuộn ('overflow-y-auto') */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Customer Info (xóa mb-6) */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Customer</p>
              <p className="font-semibold text-gray-900 dark:text-white">{lead.customerName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{lead.customerEmail}</p>
            </div>

            {/* Time Range Selection (xóa mb-6) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Select Time Range to Convert *
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Only messages and designs within this time range will be converted to the project.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Designs to Include (xóa mb-6) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Designs to Include
              </label>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
                  <strong>{allDesignIds.length}</strong> design(s) will be included in the project
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  {Object.entries(lead.designRequests).map(([roomType, requests]) => {
                    if (requests.length === 0) return null;
                    return (
                      <li key={roomType}>
                        • {roomType.replace('_', ' ')}: {requests.length} design(s)
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Warning (xóa mb-6) */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg border border-yellow-200 dark:border-yellow-700 flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Important</p>
                <p>All chat history within the selected time range will be saved to the new project.</p>
              </div>
            </div>

            {/* Success Info (xóa mb-6) */}
            <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-700 flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800 dark:text-green-200">
                <p>After conversion, you can manage the project with advanced tools like status tracking, task management, and quote creation.</p>
              </div>
            </div>
          </div>
          
          {/* SỬA 4: Di chuyển Actions (nút bấm) ra khỏi 'div' cuộn */}
          {/* Thêm 'flex-shrink-0' và 'border-t' */}
          <div className="flex gap-3 p-6 border-t dark:border-gray-700 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Converting...' : 'Convert to Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcceptLeadModal;