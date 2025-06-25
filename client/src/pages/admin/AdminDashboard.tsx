import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { productsAPI, usersAPI } from '../../services/api';

const AdminDashboard: React.FC = () => {
  // Fetch stats
  const { data: products } = useQuery(
    ['admin-products', 1],
    () => productsAPI.getProducts(1, 5),
    { keepPreviousData: true }
  );

  const { data: users } = useQuery(
    ['admin-users', 1],
    () => usersAPI.getAdminUsers(1, 5),
    { keepPreviousData: true }
  );

  const totalProducts = products?.total || 0;
  const totalUsers = users?.total || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img 
              src="/logo.png" 
              alt="Mai Crochet Logo" 
              className="h-8 w-8 mr-3 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 hidden">
              <span className="text-pink-600 font-bold text-sm">MC</span>
            </div>
            <h1 className="text-3xl font-bold text-gradient">Trang quản trị</h1>
          </div>
          <p className="text-gray-600">Quản lý sản phẩm và người dùng của Mai Crochet</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 text-gray-700">
                <Package className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-700">
                <Users className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Người dùng</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-700">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
                <p className="text-2xl font-bold text-gray-800">42</p>
              </div>
            </div>
          </div>

          <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-pink-100 text-pink-700">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">{formatPrice(15420000)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thao tác nhanh</h3>
            <div className="space-y-3">
              <Link
                to="/admin/products"
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-600 mr-3" />
                  <span className="font-medium text-gray-700">Quản lý sản phẩm crochet</span>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </div>
              </Link>
              
              <Link
                to="/admin/users"
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="font-medium text-blue-700">Quản lý người dùng</span>
                </div>
                <div className="text-blue-400 group-hover:text-blue-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </div>
              </Link>

              <Link
                to="/admin/products"
                className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center">
                  <Plus className="h-5 w-5 text-green-600 mr-3" />
                  <span className="font-medium text-green-700">Thêm sản phẩm crochet mới</span>
                </div>
                <div className="text-green-400 group-hover:text-green-600 transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê nhanh</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sản phẩm còn hàng</span>
                <span className="font-semibold text-green-600">
                  {products?.products?.filter((p: any) => p.stock > 0).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sản phẩm hết hàng</span>
                <span className="font-semibold text-red-600">
                  {products?.products?.filter((p: any) => p.stock === 0).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Admin</span>
                <span className="font-semibold text-blue-600">
                  {users?.users?.filter((u: any) => u.role === 'admin').length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Người dùng thường</span>
                <span className="font-semibold text-gray-600">
                  {users?.users?.filter((u: any) => u.role === 'user').length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Sản phẩm crochet gần đây</h3>
              <Link
                to="/admin/products"
                className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center"
              >
                Xem tất cả
                <Eye className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {products?.products?.slice(0, 3).map((product: any) => (
                <div key={product._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0">
                    {product.images?.[0] && (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatPrice(product.price)} • Kho: {product.stock}
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  Chưa có sản phẩm crochet nào
                </div>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Người dùng mới</h3>
              <Link
                to="/admin/users"
                className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center"
              >
                Xem tất cả
                <Eye className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {users?.users?.slice(0, 3).map((user: any) => (
                <div key={user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  Chưa có người dùng nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 