import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import { Users, Shield, Trash2, UserCheck, UserX } from 'lucide-react';
import { usersAPI } from '../../services/api';
import { User } from '../../types';

const AdminUsers: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['admin-users', currentPage],
    () => usersAPI.getAdminUsers(currentPage, 10),
    {
      keepPreviousData: true,
    }
  );

  const updateRoleMutation = useMutation(
    ({ id, role }: { id: string; role: 'admin' | 'user' }) =>
      usersAPI.updateUserRole(id, role),
    {
      onSuccess: () => {
        toast.success('Cập nhật quyền thành công!');
        queryClient.invalidateQueries('admin-users');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cập nhật quyền thất bại');
      },
    }
  );

  const deleteMutation = useMutation(usersAPI.deleteUser, {
    onSuccess: () => {
      toast.success('Xóa người dùng thành công!');
      queryClient.invalidateQueries('admin-users');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xóa người dùng thất bại');
    },
  });

  const handleRoleChange = (user: User, newRole: 'admin' | 'user') => {
    if (
      window.confirm(
        `Bạn có chắc muốn thay đổi quyền của "${user.username}" thành ${
          newRole === 'admin' ? 'Admin' : 'User'
        }?`
      )
    ) {
      updateRoleMutation.mutate({ id: user.id, role: newRole });
    }
  };

  const handleDelete = (user: User) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa người dùng "${user.username}"?\nHành động này không thể hoàn tác.`
      )
    ) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pink">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient">Quản lý người dùng</h1>
          <p className="mt-2 text-sm text-primary-600">
            Danh sách tất cả người dùng trong hệ thống
          </p>
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="card-gradient shadow-xl rounded-2xl border-2 border-primary-100">
            <div className="px-4 py-5 sm:p-6">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-primary-200 rounded w-1/4"></div>
                      <div className="h-4 bg-primary-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="card-gradient shadow-xl rounded-2xl border-2 border-primary-100">
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="min-w-full divide-y divide-gray-200">
                <div className="bg-gray-50 px-6 py-3">
                  <div className="grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Người dùng</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Quyền</div>
                    <div className="col-span-2">Ngày tạo</div>
                    <div className="col-span-1">Thao tác</div>
                  </div>
                </div>
                <div className="bg-white divide-y divide-gray-200">
                  {data?.users?.map((user: User) => (
                    <div key={user.id} className="px-6 py-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4 flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-800">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.profile?.fullName || 'Chưa cập nhật'}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </div>
                        <div className="col-span-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {user.role === 'admin' ? (
                              <>
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                User
                              </>
                            )}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div className="flex space-x-2">
                            {user.role === 'admin' ? (
                              <button
                                onClick={() => handleRoleChange(user, 'user')}
                                className="text-orange-400 hover:text-orange-600"
                                title="Gỡ quyền admin"
                                disabled={updateRoleMutation.isLoading}
                              >
                                <UserX className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRoleChange(user, 'admin')}
                                className="text-green-400 hover:text-green-600"
                                title="Cấp quyền admin"
                                disabled={updateRoleMutation.isLoading}
                              >
                                <Shield className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user)}
                              className="text-red-400 hover:text-red-600"
                              title="Xóa người dùng"
                              disabled={deleteMutation.isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2 border text-sm font-medium rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.totalPages))}
                    disabled={currentPage === data.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {data?.users?.length === 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Chưa có người dùng nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Người dùng sẽ xuất hiện khi họ đăng ký tài khoản.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tổng người dùng
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {data?.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Admin
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {data?.users?.filter((u: User) => u.role === 'admin').length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCheck className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      User thường
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {data?.users?.filter((u: User) => u.role === 'user').length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 