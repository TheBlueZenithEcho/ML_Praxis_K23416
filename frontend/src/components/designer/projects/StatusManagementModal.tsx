import React, { useState } from 'react';
import { X, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { ProjectStatus } from '@/types';
import type { ProjectStatusHistory } from '@/types';

interface StatusManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: ProjectStatus;
  statusHistory: ProjectStatusHistory[];
  onUpdateStatus: (data: {
    newStatus: ProjectStatus;
    startDate?: string;
    dueDate?: string;
    notes?: string;
  }) => Promise<void>;
}

const StatusManagementModal: React.FC<StatusManagementModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  statusHistory,
  onUpdateStatus
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(currentStatus);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    {
      value: ProjectStatus.CONSULTATION,
      label: 'Tư vấn & Khảo sát',
      description: 'Giai đoạn thu thập thông tin, nắm bắt nhu cầu và không gian của khách hàng',
      color: 'blue',
      estimatedDays: 7
    },
    {
      value: ProjectStatus.PRODUCT_CURATION,
      label: 'Lên phương án Sản phẩm',
      description: 'Giai đoạn lựa chọn và sắp xếp các sản phẩm có sẵn thành một bộ sưu tập hoàn chỉnh',
      color: 'purple',
      estimatedDays: 14
    },
    {
      value: ProjectStatus.FINALIZE_QUOTE,
      label: 'Chốt Sản phẩm & Báo giá',
      description: 'Giai đoạn thống nhất danh sách sản phẩm cuối cùng và gửi báo giá chính thức',
      color: 'orange',
      estimatedDays: 7
    },
    {
      value: ProjectStatus.COMPLETED,
      label: 'Hoàn thành',
      description: 'Khách hàng đã đồng ý báo giá, kết thúc quy trình tư vấn',
      color: 'green',
      estimatedDays: 0
    }
  ];

  const currentOption = statusOptions.find(opt => opt.value === selectedStatus);

  const getCurrentStatusHistory = () => {
    return statusHistory.find(h => h.status === currentStatus);
  };

  const getStatusColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      green: 'bg-green-50 border-green-200 text-green-900'
    };
    return colors[color] || colors.blue;
  };

  const calculateEstimatedDueDate = (days: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleStatusChange = (status: ProjectStatus) => {
    setSelectedStatus(status);
    const option = statusOptions.find(opt => opt.value === status);
    if (option && option.estimatedDays > 0) {
      setDueDate(calculateEstimatedDueDate(option.estimatedDays));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStatus === currentStatus && !notes.trim()) {
      alert('Please select a different status or add notes');
      return;
    }

    if (selectedStatus !== ProjectStatus.COMPLETED && !dueDate) {
      alert('Please set a due date for this status');
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdateStatus({
        newStatus: selectedStatus,
        startDate,
        dueDate: dueDate || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Tiến độ Dự án</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Current Status Info */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle size={20} className="text-green-600" />
              <span className="font-semibold text-gray-700">Current Status:</span>
              <span className="font-bold text-gray-900">
                {statusOptions.find(opt => opt.value === currentStatus)?.label}
              </span>
            </div>
            {getCurrentStatusHistory() && (
              <div className="text-sm text-gray-600 ml-8">
                <p>Started: {new Date(getCurrentStatusHistory()!.startedAt).toLocaleDateString('vi-VN')}</p>
                {getCurrentStatusHistory()!.durationInDays && (
                  <p>Duration: {getCurrentStatusHistory()!.durationInDays} days</p>
                )}
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Status Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select New Status *
              </label>
              <div className="grid grid-cols-1 gap-3">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleStatusChange(option.value)}
                    disabled={option.value === ProjectStatus.COMPLETED && currentStatus !== ProjectStatus.FINALIZE_QUOTE}
                    className={`
                      text-left p-4 rounded-lg border-2 transition-all
                      ${selectedStatus === option.value
                        ? `${getStatusColor(option.color)} border-current`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                      }
                      ${option.value === currentStatus ? 'opacity-75' : ''}
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      {option.value === currentStatus && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                      {option.estimatedDays > 0 && (
                        <span className="text-xs text-gray-600">
                          ~{option.estimatedDays} days
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            {selectedStatus !== ProjectStatus.COMPLETED && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={startDate}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add notes about this status change..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent resize-none"
              />
            </div>

            {/* Warning for Completed */}
            {selectedStatus === ProjectStatus.COMPLETED && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Important!</p>
                  <p>
                    Marking project as "Completed" will lock all changes. Make sure the quote has been accepted by the customer.
                  </p>
                </div>
              </div>
            )}

            {/* Status History */}
            {statusHistory.length > 0 && (
              <div className="pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar size={18} />
                  Status History
                </h3>
                <div className="space-y-2">
                  {statusHistory.map((history, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-sm p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-[#2B7516]" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {statusOptions.find(opt => opt.value === history.status)?.label}
                        </p>
                        <p className="text-gray-600">
                          {new Date(history.startedAt).toLocaleDateString('vi-VN')}
                          {history.completedAt && ` - ${new Date(history.completedAt).toLocaleDateString('vi-VN')}`}
                          {history.durationInDays && ` (${history.durationInDays} days)`}
                        </p>
                        {history.notes && (
                          <p className="text-gray-600 italic mt-1">{history.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors disabled:opacity-50 font-medium"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusManagementModal;