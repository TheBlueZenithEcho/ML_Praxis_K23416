import { RoomType } from './design.types';
import type { ProductItem } from './product.types';

// Project status - các giai đoạn của dự án
export enum ProjectStatus {
  CONSULTATION = 'consultation',          // Tư vấn & Khảo sát
  PRODUCT_CURATION = 'product_curation', // Lên phương án sản phẩm
  FINALIZE_QUOTE = 'finalize_quote',     // Chốt sản phẩm & Báo giá
  COMPLETED = 'completed',                // Hoàn thành
  CANCELLED = 'cancelled'                 // Đã hủy
}

// Project priority
export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Design included in project
export interface ProjectDesign {
  designId: string;
  designTitle: string;
  designImage: string;
  roomType: RoomType;
  products: ProductItem[]; // Customized products for this design
  finalizedAt?: string;
}

// Main Project interface
export interface Project {
  id: string;
  leadId: string; // Reference to original lead
  
  // Participants
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAvatar?: string;
  
  designerId: string;
  designerName: string;
  designerAvatar?: string;
  
  // Project details
  title: string;
  description?: string;
  designs: ProjectDesign[]; // Designs from lead conversion
  
  // Status management
  status: ProjectStatus;
  priority: ProjectPriority;
  
  // Timeline
  startDate: string;
  expectedEndDate?: string;
  completedAt?: string;
  
  // Status timeline (track when each status started)
  statusHistory: ProjectStatusHistory[];
  
  // Budget
  estimatedBudget?: number;
  finalBudget?: number;
  
  // Quote
  quoteId?: string; // Reference to quote
  quoteStatus?: 'draft' | 'pending' | 'approved' | 'sent' | 'accepted';
  
  // Metrics
  totalTasks: number;
  completedTasks: number;
  totalRevisions: number;
  
  // Flags
  isLocked: boolean; // True when completed
  
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStatusHistory {
  status: ProjectStatus;
  startedAt: string;
  completedAt?: string;
  durationInDays?: number;
  notes?: string;
}

// DTO for creating project (from lead conversion)
export interface CreateProjectDTO {
  leadId: string;
  title: string;
  description?: string;
  designIds: string[]; // Selected designs from lead
  expectedEndDate?: string;
  estimatedBudget?: number;
}

// DTO for updating project
export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  expectedEndDate?: string;
  estimatedBudget?: number;
}

// DTO for updating project status
export interface UpdateProjectStatusDTO {
  projectId: string;
  newStatus: ProjectStatus;
  startDate?: string;
  dueDate?: string;
  notes?: string;
}

// DTO for completing project
export interface CompleteProjectDTO {
  projectId: string;
  finalBudget: number;
  completionNotes?: string;
}

// DTO for cancelling project
export interface CancelProjectDTO {
  projectId: string;
  reason: string;
}

// Project statistics
export interface ProjectStatistics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  cancelledProjects: number;
  averageCompletionTime: number; // days
  conversionRate: number; // percentage
}