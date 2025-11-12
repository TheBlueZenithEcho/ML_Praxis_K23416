// Enum for user roles 
export enum UserRole {
  ADMIN = 'admin',
  DESIGNER = 'designer',
  CUSTOMER = 'user' 
}

export interface AuthUser {
  id: number;
  img: string;
  name: string;
  role: 'admin' | 'designer' | 'user'; // Khớp với JSON
  email: string;
  phone: string;
  createdAt: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string; 
  phone?: string;
  role: 'admin' | 'designer' | 'user';
}

export interface AuthResponse {
  user: AuthUser; 
  token: string;
  refreshToken: string;
}