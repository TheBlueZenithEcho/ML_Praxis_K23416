import type { ProductItem } from './product.types';

// Quote status - workflow phê duyệt
export enum QuoteStatus {
  DRAFT = 'draft',               // Designer đang soạn
  PENDING = 'pending',           // Chờ Admin duyệt
  APPROVED = 'approved',         // Admin đã duyệt
  REJECTED = 'rejected',         // Admin từ chối
  SENT = 'sent',                 // Đã gửi cho khách hàng
  ACCEPTED = 'accepted',         // Khách hàng chấp nhận
  NEGOTIATING = 'negotiating',   // Đang thương lượng
  EXPIRED = 'expired'            // Hết hạn
}

// Quote item - product with pricing details
export interface QuoteItem extends ProductItem {
  discount?: number;          // Percentage discount
  discountAmount?: number;    // Fixed discount amount
  subtotal: number;           // quantity * (customPrice || price)
  finalPrice: number;         // After discount
}

// Quote section - group items by room/category
export interface QuoteSection {
  id: string;
  title: string;              // e.g., "Living Room", "Bedroom"
  description?: string;
  items: QuoteItem[];
  subtotal: number;
}

// Main Quote interface
export interface Quote {
  id: string;
  quoteNumber: string;        // e.g., "QT-2024-001"
  projectId: string;
  projectTitle: string;
  
  // Participants
  customerId: string;
  customerName: string;
  customerEmail: string;
  
  designerId: string;
  designerName: string;
  
  // Quote details
  title: string;
  description?: string;
  sections: QuoteSection[];
  
  // Pricing
  subtotal: number;           // Tổng tiền hàng
  discount?: number;          // Giảm giá tổng (%)
  discountAmount?: number;    // Số tiền giảm
  tax?: number;               // Thuế (%)
  taxAmount?: number;         // Số tiền thuế
  shippingFee?: number;       // Phí vận chuyển
  totalAmount: number;        // Tổng cộng
  currency: string;           // 'VND'
  
  // Status workflow
  status: QuoteStatus;
  
  // Approval
  submittedAt?: string;       // Khi gửi cho Admin
  reviewedAt?: string;        // Khi Admin xem xét
  reviewedBy?: string;        // Admin ID
  approvedAt?: string;        // Khi Admin duyệt
  rejectionReason?: string;   // Lý do từ chối
  
  // Customer interaction
  sentToCustomerAt?: string;  // Khi gửi cho khách hàng
  viewedByCustomerAt?: string;
  acceptedAt?: string;        // Khi khách hàng chấp nhận
  
  // Validity
  validUntil?: string;        // Ngày hết hạn báo giá
  
  // Terms and conditions
  terms?: string;
  notes?: string;             // Ghi chú nội bộ
  customerNotes?: string;     // Ghi chú cho khách hàng
  
  // Versioning (for revisions)
  version: number;
  previousVersionId?: string;
  
  // File exports
  pdfUrl?: string;            // Link to PDF file
  
  createdAt: string;
  updatedAt: string;
}

// DTO for creating quote
export interface CreateQuoteDTO {
  projectId: string;
  title: string;
  description?: string;
  sections: CreateQuoteSectionDTO[];
  discount?: number;
  tax?: number;
  shippingFee?: number;
  validUntil?: string;
  terms?: string;
  customerNotes?: string;
}

export interface CreateQuoteSectionDTO {
  title: string;
  description?: string;
  items: CreateQuoteItemDTO[];
}

export interface CreateQuoteItemDTO {
  productId: string;
  quantity: number;
  customPrice?: number;
  discount?: number;
  discountAmount?: number;
  notes?: string;
}

// DTO for updating quote
export interface UpdateQuoteDTO {
  title?: string;
  description?: string;
  sections?: CreateQuoteSectionDTO[];
  discount?: number;
  tax?: number;
  shippingFee?: number;
  validUntil?: string;
  terms?: string;
  customerNotes?: string;
}

// DTO for submitting quote for approval
export interface SubmitQuoteDTO {
  quoteId: string;
  notes?: string; // Notes for Admin
}

// DTO for Admin review
export interface ReviewQuoteDTO {
  quoteId: string;
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

// DTO for sending quote to customer
export interface SendQuoteDTO {
  quoteId: string;
  sendEmail?: boolean;
  emailMessage?: string;
}

// Quote statistics
export interface QuoteStatistics {
  totalQuotes: number;
  pendingApproval: number;
  approved: number;
  sent: number;
  accepted: number;
  acceptanceRate: number; // percentage
  averageQuoteValue: number;
}