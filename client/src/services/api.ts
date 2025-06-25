import axios from 'axios';
import { 
  AuthResponse, 
  LoginData, 
  RegisterData, 
  ProductsResponse, 
  Product, 
  User,
  ProductFormData 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getProducts: async (
    page: number = 1,
    limit: number = 12,
    category?: string,
    search?: string
  ): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (category && category !== 'all') {
      params.append('category', category);
    }

    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/products?${params}`);
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: ProductFormData): Promise<{ message: string; product: Product }> => {
    const formData = new FormData();
    
    // Thêm các field vào FormData
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('material', data.material);
    formData.append('stock', data.stock.toString());
    formData.append('fbLink', data.fbLink);
    
    // Debug log
    console.log('Sending colors:', data.colors);
    console.log('Sending sizes:', data.sizes);
    
    // Chỉ append colors và sizes nếu có dữ liệu thực sự
    if (data.colors && Array.isArray(data.colors) && data.colors.length > 0) {
      const filteredColors = data.colors.filter(color => color && color.trim() !== '');
      if (filteredColors.length > 0) {
        formData.append('colors', JSON.stringify(filteredColors));
      }
    }
    
    if (data.sizes && Array.isArray(data.sizes) && data.sizes.length > 0) {
      const filteredSizes = data.sizes.filter(size => size && size.trim() !== '');
      if (filteredSizes.length > 0) {
        formData.append('sizes', JSON.stringify(filteredSizes));
      }
    }

    // Thêm ảnh
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (
    id: string, 
    data: Partial<ProductFormData> & { removeImages?: string[] }
  ): Promise<{ message: string; product: Product }> => {
    const formData = new FormData();
    
    // Thêm các field vào FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formData.append('images', file);
        });
      } else if (key === 'colors' || key === 'sizes') {
        // Chỉ append nếu có dữ liệu thực sự
        if (value && Array.isArray(value) && value.length > 0) {
          const filteredArray = value.filter(item => item && item.toString().trim() !== '');
          if (filteredArray.length > 0) {
            formData.append(key, JSON.stringify(filteredArray));
          }
        }
      } else if (key === 'removeImages') {
        if (value && Array.isArray(value) && value.length > 0) {
          formData.append(key, JSON.stringify(value));
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  getAdminProducts: async (page: number = 1, limit: number = 10): Promise<ProductsResponse> => {
    const response = await api.get(`/products/admin/all?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  updateProfile: async (data: { fullName?: string; phone?: string; address?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  getAdminUsers: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/users/admin/all?page=${page}&limit=${limit}`);
    return response.data;
  },

  updateUserRole: async (id: string, role: 'admin' | 'user') => {
    const response = await api.put(`/users/admin/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/admin/${id}`);
    return response.data;
  },
};

export default api; 