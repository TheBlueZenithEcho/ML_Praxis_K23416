import { ProjectStatus } from './project.types';

// Task status
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Task priority
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// Main Task interface
export interface Task {
  id: string;
  projectId: string;
  projectTitle: string;
  
  // Task details
  title: string;
  description?: string;
  
  // Assignment
  assigneeId: string; // Designer ID
  assigneeName: string;
  
  // Status
  status: TaskStatus;
  priority: TaskPriority;
  
  // Related to project status
  relatedProjectStatus?: ProjectStatus; // Task thuộc giai đoạn nào của dự án
  
  // Timeline
  dueDate?: string;
  startedAt?: string;
  completedAt?: string;
  
  // Attachments
  attachments?: TaskAttachment[];
  
  // Subtasks
  subtasks?: Subtask[];
  
  // Metadata
  tags?: string[];
  
  createdAt: string;
  updatedAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string; // file type
  size: number; // bytes
  uploadedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
}

// DTO for creating task
export interface CreateTaskDTO {
  projectId: string;
  title: string;
  description?: string;
  assigneeId: string;
  priority?: TaskPriority;
  relatedProjectStatus?: ProjectStatus;
  dueDate?: string;
  tags?: string[];
}

// DTO for updating task
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  tags?: string[];
}

// DTO for adding subtask
export interface AddSubtaskDTO {
  taskId: string;
  title: string;
}

// DTO for toggling subtask
export interface ToggleSubtaskDTO {
  taskId: string;
  subtaskId: string;
}

// Task list filters
export interface TaskFilters {
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  relatedProjectStatus?: ProjectStatus;
  dueDateFrom?: string;
  dueDateTo?: string;
  tags?: string[];
}

// Task statistics
export interface TaskStatistics {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number; // percentage
}