import React, { useState, useRef } from 'react';
import { Send, Image, Paperclip, Search } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  onSearchClick?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onSearchClick,
  disabled = false,
  placeholder = 'Type a message...'
}) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && selectedFiles.length === 0) return;
    
    onSend(message, selectedFiles);
    setMessage('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="p-3 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="relative flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm"
              >
                <span className="truncate max-w-xs">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end gap-2">
          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Image Upload */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={disabled}
              className="p-2 text-gray-500 hover:text-[#2B7516] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Send image"
            >
              <Image size={20} />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* File Upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="p-2 text-gray-500 hover:text-[#2B7516] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Send file"
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Product Search */}
            {onSearchClick && (
              <button
                type="button"
                onClick={onSearchClick}
                disabled={disabled}
                className="p-2 text-gray-500 hover:text-[#2B7516] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Search products"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              placeholder={placeholder}
              rows={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7516] focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                height: 'auto'
              }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={disabled || (!message.trim() && selectedFiles.length === 0)}
            className="p-2 bg-[#2B7516] text-white rounded-lg hover:bg-[#1f5510] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;