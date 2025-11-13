// Message type
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  PRODUCT = 'product',      // Gửi sản phẩm
  DESIGN = 'design',        // Gửi thiết kế
  QUOTE = 'quote',          // Gửi báo giá
  SYSTEM = 'system'         // Thông báo hệ thống
}

// Message status
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

// Sender role
export enum SenderRole {
  DESIGNER = 'designer',
  CUSTOMER = 'customer',
  SYSTEM = 'system'
}

// Message attachment
export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'product' | 'design' | 'quote';
  name: string;
  url: string;
  thumbnailUrl?: string;
  size?: number;
  metadata?: Record<string, any>; // Extra data (product info, design info, etc.)
}

// Main Message interface
export interface Message {
  id: string;
  chatId: string;           // Lead ID or Project ID

  // Sender
  senderId: number | string;
  senderRole: SenderRole;
  senderName: string;
  senderAvatar?: string;

  // Message content
  type: MessageType;
  content: string;          // Text content or description
  attachments?: MessageAttachment[];

  // Status
  status: MessageStatus;

  // Metadata
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;

  // Reply/Thread
  replyToId?: string;       // If replying to another message

  // Timestamps
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;

  createdAt: string;
  updatedAt: string;
}

// Chat/Conversation interface
export interface Chat {
  id: string;
  type: 'lead' | 'project';
  referenceId: string;      // Lead ID or Project ID

  // Participants
  participants: ChatParticipant[];

  // Last message
  lastMessage?: Message;
  lastMessageAt?: string;

  // Unread count
  unreadCount: Record<string, number>; // userId: count

  // Status
  isActive: boolean;
  isLocked: boolean;        // True when project completed

  // Typing indicator
  typingUsers?: string[];   // Array of user IDs currently typing

  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  userId: string;
  role: SenderRole;
  name: string;
  avatar?: string;
  joinedAt: string;
  lastReadAt?: string;
}

// DTO for sending message
export interface SendMessageDTO {
  chatId: string;
  type: MessageType;
  content: string;
  attachments?: File[] | MessageAttachment[];
  replyToId?: string;
}

// DTO for editing message
export interface EditMessageDTO {
  messageId: string;
  content: string;
}

// DTO for deleting message
export interface DeleteMessageDTO {
  messageId: string;
}

// DTO for marking messages as read
export interface MarkAsReadDTO {
  chatId: string;
  messageIds?: string[];    // Specific messages, or all if not provided
}

// DTO for typing indicator
export interface TypingIndicatorDTO {
  chatId: string;
  isTyping: boolean;
}

// Chat list filters
export interface ChatFilters {
  type?: 'lead' | 'project';
  isActive?: boolean;
  hasUnread?: boolean;
  participantId?: string;
}

// Chat statistics
export interface ChatStatistics {
  totalChats: number;
  activeChats: number;
  totalMessages: number;
  averageResponseTime: number; // minutes
  unreadMessages: number;
}