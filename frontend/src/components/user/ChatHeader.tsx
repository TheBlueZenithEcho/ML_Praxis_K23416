import React from 'react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'typing';
  onBack?: () => void;
  onMoreClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  avatar,
  status,
  onBack,
  onMoreClick
}) => {
  const renderStatus = () => {
    if (!status) return null;

    switch (status) {
      case 'online':
        return (
          <div className="flex items-center gap-1 text-xs text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Online
          </div>
        );
      case 'typing':
        return (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span className="flex gap-0.5">
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            Typing...
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
          )}

          {/* Avatar */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-600">
                  {name[0]}
                </span>
              )}
            </div>
            {status === 'online' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* Name & Status */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            {renderStatus()}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 text-gray-500 hover:text-[#2B7516] hover:bg-gray-100 rounded-lg transition-colors"
            title="Voice call"
          >
            <Phone size={20} />
          </button>
          <button
            className="p-2 text-gray-500 hover:text-[#2B7516] hover:bg-gray-100 rounded-lg transition-colors"
            title="Video call"
          >
            <Video size={20} />
          </button>
          {onMoreClick && (
            <button
              onClick={onMoreClick}
              className="p-2 text-gray-500 hover:text-[#2B7516] hover:bg-gray-100 rounded-lg transition-colors"
              title="More options"
            >
              <MoreVertical size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;