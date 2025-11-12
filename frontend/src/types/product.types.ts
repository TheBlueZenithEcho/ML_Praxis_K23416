// Product categories
export enum ProductCategory {
  FURNITURE = 'furniture',
  LIGHTING = 'lighting',
  DECORATION = 'decoration',
  TEXTILE = 'textile',
  STORAGE = 'storage',
  APPLIANCE = 'appliance',
  OTHER = 'other'
}

// Product subcategories (for furniture)
export enum FurnitureType {
  SOFA = 'sofa',
  CHAIR = 'chair',
  TABLE = 'table',
  BED = 'bed',
  CABINET = 'cabinet',
  SHELF = 'shelf',
  DESK = 'desk',
  OTHER = 'other'
}

// Main Product interface
export interface Product {
  id: string;
  sku: string; // Stock Keeping Unit
  name: string;
  description: string;
  images: string[];
  thumbnailImage: string;
  
  // Category
  category: ProductCategory;
  subcategory?: FurnitureType | string;
  
  // Pricing
  price: number;
  currency: string; // 'VND'
  discountPrice?: number;
  
  // Physical attributes
  dimensions?: ProductDimensions;
  weight?: number; // in kg
  material?: string;
  color?: string[];
  
  // Inventory
  stock: number;
  isAvailable: boolean;
  
  // Supplier info
  supplier?: string;
  supplierSKU?: string;
  
  // Metadata
  tags?: string[];
  views: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface ProductDimensions {
  length: number;  // cm
  width: number;   // cm
  height: number;  // cm
  unit: 'cm' | 'm';
}

// Product in a design or quote
export interface ProductItem {
  productId: string;
  product: Product; // Full product info
  quantity: number;
  customPrice?: number; // Giá tùy chỉnh (nếu có thương lượng)
  notes?: string; // Ghi chú đặc biệt
}

// DTO for product search/filter
export interface ProductSearchDTO {
  query?: string;
  category?: ProductCategory;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  inStock?: boolean;
  roomType?: string;
  style?: string;
}

// Image search
export interface ImageSearchDTO {
  imageFile: File;
  limit?: number;
}