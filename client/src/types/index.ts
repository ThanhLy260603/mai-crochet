export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  profile?: {
    fullName?: string;
    phone?: string;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'áo len' | 'khăn len' | 'mũ len' | 'găng tay len' | 'tất len' | 'túi len' | 'khác';
  images: {
    url: string;
    publicId: string;
  }[];
  colors: string[];
  sizes: string[];
  material: string;
  stock: number;
  isAvailable: boolean;
  fbLink: string;
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: Product['category'];
  colors: string[];
  sizes: string[];
  material: string;
  stock: number;
  fbLink: string;
  images: FileList | null;
} 