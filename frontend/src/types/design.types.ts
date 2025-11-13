// Design status for approval workflow
export enum DesignStatus {
  DRAFT = 'draft',           // Designer đang làm
  PENDING = 'pending',       // Đã gửi duyệt, chờ Admin
  APPROVED = 'approved',     // Admin đã duyệt, công khai
  REJECTED = 'rejected',     // Admin từ chối
  ARCHIVED = 'archived'      // Đã lưu trữ
}

// Room types
export enum RoomType {
  LIVING_ROOM = 'living_room',
  BEDROOM = 'bedroom',
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom',
  DINING_ROOM = 'dining_room',
  OFFICE = 'office',
  OTHER = 'other'
}

// Design styles
export enum DesignStyle {
  MODERN = 'modern',
  MINIMALIST = 'minimalist',
  INDUSTRIAL = 'industrial',
  SCANDINAVIAN = 'scandinavian',
  TRADITIONAL = 'traditional',
  CONTEMPORARY = 'contemporary',
  RUSTIC = 'rustic',
  BOHEMIAN = 'bohemian'
}

// Main Design interface
export interface Design {
  id: string;
  designerId: string;
  designerName: string;
  title: string;
  description: string;
  images: string[]; // Array of image URLs
  thumbnailImage: string; // Main thumbnail

  // Classification
  roomType: RoomType;
  style: DesignStyle;
  tags?: string[];

  // Products associated with this design
  productIds: string[]; // References to products

  // Approval workflow
  status: DesignStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string; // Admin ID
  rejectionReason?: string;

  // Metadata
  views: number;
  likes: number;
  consultationRequests: number; // Số lần khách hàng nhấn "Tư vấn"

  createdAt: string;
  updatedAt: string;
}

// DTO for creating/submitting a design
export interface CreateDesignDTO {
  title: string;
  description: string;
  images: File[] | string[]; // File objects for upload or URLs
  thumbnailImage: File | string;
  roomType: RoomType;
  style: DesignStyle;
  tags?: string[];
  productIds: string[];
}

// DTO for updating a design
export interface UpdateDesignDTO {
  title?: string;
  description?: string;
  images?: string[];
  thumbnailImage?: string;
  roomType?: RoomType;
  style?: DesignStyle;
  tags?: string[];
  productIds?: string[];
}

// Admin review action
export interface ReviewDesignDTO {
  designId: string;
  action: 'approve' | 'reject';
  rejectionReason?: string;
}
