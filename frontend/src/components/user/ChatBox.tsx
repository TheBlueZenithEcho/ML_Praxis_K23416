import React, { useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { Message } from '@/types';
import { Loader2 } from 'lucide-react';

interface ChatBoxProps {
  messages: Message[];
  currentUserId: number | string;
  customerName: string;
  customerAvatar?: string;
  isLocked?: boolean;
  isLoading?: boolean;
  onSendMessage: (message: string, files?: File[]) => void;
  onSearchClick?: () => void;
  onBack?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  currentUserId,
  customerName,
  customerAvatar,
  isLocked = false,
  isLoading = false,
  onSendMessage,
  onSearchClick,
  onBack
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <ChatHeader
        name={customerName}
        avatar={customerAvatar}
        status="online"
        onBack={onBack}
      />

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        style={{ maxHeight: 'calc(100vh - 250px)' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-[#2B7516]" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation with your customer</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.senderId === currentUserId}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      {isLocked ? (
        <div className="p-4 bg-gray-100 text-center text-sm text-gray-600">
          This conversation has been locked. No new messages can be sent.
        </div>
      ) : (
        <ChatInput
          onSend={onSendMessage}
          onSearchClick={onSearchClick}
          placeholder="Type a message..."
        />
      )}
    </div>
  );
};

export default ChatBox;