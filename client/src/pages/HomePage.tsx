import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Search, Filter, ExternalLink, Heart, Star } from 'lucide-react';
import { productsAPI } from '../services/api';
import { Product } from '../types';

const CATEGORIES = [
  { value: 'all', label: 'Tất cả' },
  { value: 'áo len', label: 'Áo len' },
  { value: 'khăn len', label: 'Khăn len' },
  { value: 'mũ len', label: 'Mũ len' },
  { value: 'găng tay len', label: 'Găng tay len' },
  { value: 'tất len', label: 'Tất len' },
  { value: 'túi len', label: 'Túi len' },
  { value: 'khác', label: 'Khác' },
];

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, debouncedSearch]);

  const { data, isLoading, error } = useQuery(
    ['products', currentPage, selectedCategory, debouncedSearch],
    () => productsAPI.getProducts(currentPage, 12, selectedCategory, debouncedSearch),
    {
      keepPreviousData: true,
    }
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleBuyClick = (fbLink: string) => {
    window.open(fbLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Hero Section with Banner */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            {/* Banner Image */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img 
                  src="/banner.png" 
                  alt="Mai Crochet Banner" 
                  className="h-32 w-32 md:h-40 md:w-40 object-contain drop-shadow-2xl"
                  onError={(e) => {
                    // Fallback nếu không tìm thấy hình
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="h-32 w-32 md:h-40 md:w-40 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center hidden">
                  <span className="text-pink-600 font-bold text-4xl md:text-6xl">MC</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
              Mai Crochet
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">
              Sản phẩm len crochet handmade đầy tình yêu
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Khám phá bộ sưu tập đồ len crochet xinh xắn, được đan tay với từng mũi kim tỉ mỉ và tình yêu thương
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm crochet..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="input-field pl-10 pr-8 appearance-none min-w-[200px]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="card p-4 animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Có lỗi xảy ra khi tải sản phẩm</p>
          </div>
        ) : data?.products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.products.map((product: Product) => (
                <div
                  key={product._id}
                  className="card overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-50">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-t-xl"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Không có ảnh
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        {product.category}
                      </span>
                    </div>

                    {/* Heart Icon */}
                    <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110">
                      <Heart className="h-4 w-4 text-pink-400" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link
                      to={`/product/${product._id}`}
                      className="block hover:text-gray-600 transition-colors"
                    >
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">(5.0)</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-800">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Kho: {product.stock}
                      </span>
                    </div>

                    {/* Colors */}
                    {product.colors.length > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-600">Màu:</span>
                        <div className="flex space-x-1">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                              {color}
                            </span>
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 btn-secondary text-center"
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        onClick={() => handleBuyClick(product.fbLink)}
                        className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
      </div>
    </div>
  );
};

export default HomePage; 