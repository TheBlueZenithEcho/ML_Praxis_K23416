import { RoomType } from './design.types';
import type { ProductItem } from './product.types';

// Lead status
export enum LeadStatus {
  NEW = 'new',                    // Mới tạo, chưa xử lý
  CONSULTING = 'consulting',      // Đang tư vấn
  QUALIFIED = 'qualified',        // Đã xác nhận tiềm năng
  CONVERTED = 'converted',        // Đã chuyển thành Project
  CANCELLED = 'cancelled'         // Đã hủy (không phù hợp)
}

// Lead priority
export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Design request - một thiết kế mà khách hàng quan tâm
export interface DesignRequest {
  designId: string;
  designTitle: string;
  designImage: string;
  roomType: RoomType;
  requestedAt: string;
  products: ProductItem[]; // Danh sách sản phẩm ban đầu
  notes?: string; // Ghi chú từ khách hàng
}

// Main Lead interface
export interface Lead {
  id: string;
  type: 'lead';
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAvatar?: string;

  // Assignment
  designerId?: string; // Admin có thể phân công
  designerName?: string;

  // Design requests grouped by room type
  // Key: room type, Value: array of design requests
  designRequests: Record<RoomType, DesignRequest[]>;

  // Lead info
  status: LeadStatus;
  priority: LeadPriority;
  budget?: number;
  preferredStyle?: string[];

  // Timeline
  firstContactAt: string;
  lastContactAt: string;
  convertedAt?: string; // Khi chuyển thành Project
  cancelledAt?: string;
  cancellationReason?: string;

  // Metrics
  totalMessages: number;
  averageResponseTime?: number; // minutes

  createdAt: string;
  updatedAt: string;
}

// DTO for creating a lead (from customer clicking "Tư vấn")
export interface CreateLeadDTO {
  customerId: string;
  designId: string;
}

// DTO for updating lead
export interface UpdateLeadDTO {
  status?: LeadStatus;
  priority?: LeadPriority;
  budget?: number;
  preferredStyle?: string[];
  designerId?: string;
}

// DTO for adding design to existing lead
export interface AddDesignToLeadDTO {
  leadId: string;
  designId: string;
}

// DTO for converting lead to project
export interface ConvertLeadDTO {
  leadId: string;
  timeRange: {
    startDate: string;
    endDate: string;
  };
  selectedDesignIds?: string[]; // Optional: specific designs to convert
}

// DTO for cancelling lead
export interface CancelLeadDTO {
  leadId: string;
  reason: string;
}