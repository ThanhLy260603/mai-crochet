import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, Package, X, Upload } from 'lucide-react';
import { productsAPI } from '../../services/api';
import { Product, ProductFormData } from '../../types';

const CATEGORIES = [
  'áo len',
  'khăn len',
  'mũ len',
  'găng tay len',
  'tất len',
  'túi len',
  'khác',
];

const AdminProducts: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['admin-products', currentPage],
    () => productsAPI.getAdminProducts(currentPage, 10),
    {
      keepPreviousData: true,
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>();

  // Mutations
  const createMutation = useMutation(productsAPI.createProduct, {
    onSuccess: () => {
      toast.success('Tạo sản phẩm thành công!');
      queryClient.invalidateQueries('admin-products');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Tạo sản phẩm thất bại');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<ProductFormData> & { removeImages?: string[] } }) =>
      productsAPI.updateProduct(id, data),
    {
      onSuccess: () => {
        toast.success('Cập nhật sản phẩm thành công!');
        queryClient.invalidateQueries('admin-products');
        resetForm();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Cập nhật sản phẩm thất bại');
      },
    }
  );

  const deleteMutation = useMutation(productsAPI.deleteProduct, {
    onSuccess: () => {
      toast.success('Xóa sản phẩm thành công!');
      queryClient.invalidateQueries('admin-products');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xóa sản phẩm thất bại');
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const resetForm = () => {
    setShowCreateModal(false);
    setEditingProduct(null);
    setPreviewImages([]);
    setImagesToRemove([]);
    setNewImageFiles([]);
    reset();
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    
    // Populate form with product data
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('category', product.category);
    setValue('material', product.material);
    setValue('stock', product.stock);
    setValue('fbLink', product.fbLink);
    setValue('colors', product.colors);
    setValue('sizes', product.sizes);
    
    // Set existing images for preview
    setPreviewImages(product.images.map(img => img.url));
    setImagesToRemove([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setNewImageFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews: string[] = [];
      newFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === newFiles.length) {
              setPreviewImages(prev => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePreviewImage = (index: number) => {
    if (editingProduct && index < editingProduct.images.length) {
      // Đây là ảnh cũ - thêm vào danh sách xóa
      const imageToRemove = editingProduct.images[index];
      setImagesToRemove(prev => [...prev, imageToRemove.publicId]);
    } else {
      // Đây là ảnh mới - xóa khỏi files mới
      const newImageIndex = editingProduct ? index - editingProduct.images.length : index;
      setNewImageFiles(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      deleteMutation.mutate(product._id);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        // Update existing product
        const updateData: any = {
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          material: data.material,
          stock: data.stock,
          fbLink: data.fbLink,
          colors: data.colors,
          sizes: data.sizes,
        };

        // Thêm ảnh cần xóa
        if (imagesToRemove.length > 0) {
          updateData.removeImages = imagesToRemove;
        }

        // Thêm ảnh mới
        if (newImageFiles.length > 0) {
          const fileList = new DataTransfer();
          newImageFiles.forEach(file => fileList.items.add(file));
          updateData.images = fileList.files;
        }
        
        updateMutation.mutate({
          id: editingProduct._id,
          data: updateData,
        });
      } else {
        // Create new product
        createMutation.mutate(data);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const watchColors = watch('colors') || [];
  const watchSizes = watch('sizes') || [];

  const addColor = () => {
    const newColor = (document.getElementById('newColor') as HTMLInputElement)?.value?.trim();
    if (newColor && !watchColors.includes(newColor)) {
      setValue('colors', [...watchColors, newColor]);
      (document.getElementById('newColor') as HTMLInputElement).value = '';
    }
  };

  const removeColor = (index: number) => {
    setValue('colors', watchColors.filter((_, i) => i !== index));
  };

  const addSize = () => {
    const newSize = (document.getElementById('newSize') as HTMLInputElement)?.value?.trim();
    if (newSize && !watchSizes.includes(newSize)) {
      setValue('sizes', [...watchSizes, newSize]);
      (document.getElementById('newSize') as HTMLInputElement).value = '';
    }
  };

  const removeSize = (index: number) => {
    setValue('sizes', watchSizes.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center mb-8">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold text-gradient">Quản lý sản phẩm crochet</h1>
            <p className="mt-2 text-sm text-gray-600">
              Danh sách tất cả sản phẩm crochet trong hệ thống
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={openCreateModal}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Product List */}
        {isLoading ? (
          <div className="card shadow-xl rounded-2xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="card shadow-xl rounded-2xl">
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</p>
            </div>
          </div>
        ) : (
          <>
            <div className="card shadow-xl rounded-2xl overflow-hidden">
              <div className="min-w-full divide-y divide-gray-200">
                <div className="bg-gray-50 px-6 py-3">
                  <div className="grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <div className="col-span-4">Sản phẩm</div>
                    <div className="col-span-2">Danh mục</div>
                    <div className="col-span-2">Giá</div>
                    <div className="col-span-1">Kho</div>
                    <div className="col-span-1">Trạng thái</div>
                    <div className="col-span-2">Thao tác</div>
                  </div>
                </div>
                <div className="bg-white divide-y divide-gray-100">
                  {data?.products?.map((product: Product) => (
                    <div key={product._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-4 flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            {product.images.length > 0 ? (
                              <img
                                className="h-16 w-16 rounded-lg object-cover"
                                src={product.images[0].url}
                                alt={product.name}
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {product.description}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(product.price)}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <div className="text-sm text-gray-900">
                            {product.stock}
                          </div>
                        </div>
                        <div className="col-span-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.isAvailable ? 'Hiển thị' : 'Ẩn'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(`/product/${product._id}`, '_blank')}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                              title="Xem sản phẩm"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-blue-400 hover:text-blue-600 p-1 rounded transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="text-red-400 hover:text-red-600 p-1 rounded transition-colors"
                              title="Xóa"
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
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Trước
                  </button>
                  
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2 border-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                          currentPage === pageNumber
                            ? 'bg-gray-800 text-white border-gray-800 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.totalPages))}
                    disabled={currentPage === data.totalPages}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || editingProduct) && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={resetForm}></div>

              <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                    <div className="sm:flex sm:items-start">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                          </h3>
                          <button
                            type="button"
                            onClick={resetForm}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-4">
                            {/* Name */}
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Tên sản phẩm *
                              </label>
                              <input
                                type="text"
                                id="name"
                                className="input-field"
                                {...register('name', { required: 'Tên sản phẩm là bắt buộc' })}
                              />
                              {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                              )}
                            </div>

                            {/* Description */}
                            <div>
                              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Mô tả *
                              </label>
                              <textarea
                                id="description"
                                rows={4}
                                className="input-field"
                                {...register('description', { required: 'Mô tả là bắt buộc' })}
                              />
                              {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                              )}
                            </div>

                            {/* Price */}
                            <div>
                              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Giá (VND) *
                              </label>
                              <input
                                type="number"
                                id="price"
                                min="0"
                                className="input-field"
                                {...register('price', { 
                                  required: 'Giá là bắt buộc',
                                  min: { value: 0, message: 'Giá phải lớn hơn 0' }
                                })}
                              />
                              {errors.price && (
                                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                              )}
                            </div>

                            {/* Category */}
                            <div>
                              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Danh mục *
                              </label>
                              <select
                                id="category"
                                className="input-field"
                                {...register('category', { required: 'Danh mục là bắt buộc' })}
                              >
                                <option value="">Chọn danh mục</option>
                                {CATEGORIES.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                              {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                              )}
                            </div>

                            {/* Material */}
                            <div>
                              <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                                Chất liệu *
                              </label>
                              <input
                                type="text"
                                id="material"
                                className="input-field"
                                {...register('material', { required: 'Chất liệu là bắt buộc' })}
                              />
                              {errors.material && (
                                <p className="mt-1 text-sm text-red-600">{errors.material.message}</p>
                              )}
                            </div>

                            {/* Stock */}
                            <div>
                              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                                Số lượng trong kho *
                              </label>
                              <input
                                type="number"
                                id="stock"
                                min="0"
                                className="input-field"
                                {...register('stock', { 
                                  required: 'Số lượng trong kho là bắt buộc',
                                  min: { value: 0, message: 'Số lượng phải lớn hơn hoặc bằng 0' }
                                })}
                              />
                              {errors.stock && (
                                <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                              )}
                            </div>

                            {/* Facebook Link */}
                            <div>
                              <label htmlFor="fbLink" className="block text-sm font-medium text-gray-700">
                                Link Facebook *
                              </label>
                              <input
                                type="url"
                                id="fbLink"
                                className="input-field"
                                {...register('fbLink', { required: 'Link Facebook là bắt buộc' })}
                              />
                              {errors.fbLink && (
                                <p className="mt-1 text-sm text-red-600">{errors.fbLink.message}</p>
                              )}
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                            {/* Images */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hình ảnh
                              </label>
                              
                              {/* Image Preview */}
                              {previewImages.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                  {previewImages.map((url, index) => (
                                    <div key={index} className="relative">
                                      <img
                                        src={url}
                                        alt={`Preview ${index}`}
                                        className="w-full h-20 object-cover rounded-lg"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removePreviewImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Upload Button */}
                              <div className="flex items-center justify-center w-full">
                                <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                      <span className="font-semibold">Click để upload</span> hoặc kéo thả
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG hoặc JPEG</p>
                                  </div>
                                  <input
                                    id="images"
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Colors */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Màu sắc
                              </label>
                              <div className="flex space-x-2 mb-2">
                                <input
                                  type="text"
                                  id="newColor"
                                  placeholder="Thêm màu mới"
                                  className="input-field flex-1"
                                />
                                <button
                                  type="button"
                                  onClick={addColor}
                                  className="btn-secondary"
                                >
                                  Thêm
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {watchColors.map((color, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                                  >
                                    {color}
                                    <button
                                      type="button"
                                      onClick={() => removeColor(index)}
                                      className="ml-2 text-gray-500 hover:text-red-500"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Sizes */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kích thước
                              </label>
                              <div className="flex space-x-2 mb-2">
                                <input
                                  type="text"
                                  id="newSize"
                                  placeholder="Thêm size mới"
                                  className="input-field flex-1"
                                />
                                <button
                                  type="button"
                                  onClick={addSize}
                                  className="btn-secondary"
                                >
                                  Thêm
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {watchSizes.map((size, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                                  >
                                    {size}
                                    <button
                                      type="button"
                                      onClick={() => removeSize(index)}
                                      className="ml-2 text-pink-500 hover:text-red-500"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={createMutation.isLoading || updateMutation.isLoading}
                      className="w-full inline-flex justify-center btn-primary sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {createMutation.isLoading || updateMutation.isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {editingProduct ? 'Đang cập nhật...' : 'Đang tạo...'}
                        </div>
                      ) : (
                        editingProduct ? 'Cập nhật' : 'Tạo sản phẩm'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-3 w-full inline-flex justify-center btn-secondary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts; 