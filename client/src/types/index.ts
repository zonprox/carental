// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Car types
export interface Car {
  id: string;
  name: string;
  brand: string;
  type: string;
  dailyPrice: number;
  featured: boolean;
  description: string | null;
  imageUrl: string | null;
  transmission: string;
  fuelType: string;
  seats: number;
  year: number | null;
  mileage: string | null;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CarFormData {
  name: string;
  brand: string;
  type: string;
  dailyPrice: number;
  featured?: boolean;
  description?: string;
  imageUrl?: string;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  year?: number;
  mileage?: string;
  features?: string[];
}

// Pagination types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
}

export interface CarResponse {
  car: Car;
}

export interface CarsResponse {
  cars: Car[];
  pagination: Pagination;
}

// Query types
export interface CarFilters {
  search?: string;
  type?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  limit?: number;
}

// Health check types
export interface HealthResponse {
  status: string;
  configured: boolean;
}

// Setup types
export interface SetupData {
  databaseUrl?: string;
  jwtSecret?: string;
  appUrl: string;
  adminEmail: string;
  adminPassword: string;
  adminPasswordConfirm?: string;
  adminName?: string;
  serverPort?: number;
  clientPort?: number;
  dbMode?: 'local' | 'external';
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUser?: string;
  dbPassword?: string;
  dbSslMode?: string;
}

export interface SetupResponse {
  configured: boolean;
  databaseUrl?: string;
  appUrl?: string;
}
