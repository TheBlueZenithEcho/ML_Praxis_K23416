import React from 'react';
import type { Message } from '@/types';
import { SenderRole } from '@/types';
import { Check, CheckCheck, Image as ImageIcon, FileText } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment) => {
          if (attachment.type === 'image') {
            return (
              <div key={attachment.id} className="relative rounded-lg overflow-hidden">
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="max-w-xs rounded-lg"
                />
              </div>
            );
          }

          if (attachment.type === 'file') {
            return (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FileText size={20} />
                <span className="text-sm flex-1 truncate">{attachment.name}</span>
              </a>
            );
          }

          if (attachment.type === 'product' && attachment.metadata) {
            return (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-3 bg-white/10 rounded-lg"
              >
                <div className="w-12 h-12 rounded bg-white/20 flex items-center justify-center overflow-hidden">
                  {attachment.thumbnailUrl ? (
                    <img
                      src={attachment.thumbnailUrl}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                  {attachment.metadata.price && (
                    <p className="text-xs opacity-80">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(attachment.metadata.price)}
                    </p>
                  )}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  const renderStatusIcon = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  if (message.senderRole === SenderRole.SYSTEM) {
    return (
      <div className="flex justify-center my-4">
        <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isOwn && (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {message.senderAvatar ? (
              <img
                src={message.senderAvatar}
                alt={message.senderName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-gray-600">
                {message.senderName[0]}
              </span>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          {!isOwn && (
            <p className="text-xs text-gray-600 mb-1 px-1">{message.senderName}</p>
          )}
          
          <div
            className={`
              rounded-2xl px-4 py-2
              ${isOwn 
                ? 'bg-[#2B7516] text-white rounded-br-sm' 
                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }
            `}
          >
            {message.content && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
            {renderAttachments()}
            
            {message.isEdited && (
              <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                (edited)
              </p>
            )}
          </div>

          {/* Time & Status */}
          <div className="flex items-center gap-1 mt-1 px-1">
            <p className="text-xs text-gray-500">
              {formatTime(message.sentAt)}
            </p>
            {renderStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;