// User types
export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Style types
export interface Style {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prompt: string; // Hidden from users, only visible to admins
  categoryId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Generation types
export interface Generation {
  id: string;
  userId: string;
  styleId: string;
  styleName: string;
  originalImageUrl: string;
  generatedImageUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Analytics types
export interface UserActivity {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'generate' | 'download' | 'share' | 'upload';
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface AnalyticsSummary {
  totalUsers: number;
  totalGenerations: number;
  totalStyles: number;
  activeUsers: number;
  generationsToday: number;
  generationsThisWeek: number;
  generationsThisMonth: number;
  topStyles: { styleId: string; styleName: string; count: number }[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form types
export interface StyleFormData {
  name: string;
  description: string;
  prompt: string;
  categoryId: string;
  isActive: boolean;
  image?: File;
}

export interface CategoryFormData {
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}
