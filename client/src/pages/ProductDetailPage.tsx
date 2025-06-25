import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { ArrowLeft, Star, ExternalLink, Heart, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { productsAPI } from '../services/api';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => productsAPI.getProduct(id!),
    {
      enabled: !!id,
    }
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleBuyClick = () => {
    if (product?.fbLink) {
      window.open(product.fbLink, '_blank');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép link sản phẩm!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-300 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-light flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Không tìm thấy sản phẩm
          </h1>
          <Link to="/" className="btn-primary">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Quay lại trang chủ
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse">
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                <div className="grid grid-cols-4 gap-6">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-24 bg-white rounded-xl flex items-center justify-center text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-4 border-2 ${
                        index === selectedImageIndex
                          ? 'border-pink-300 shadow-lg'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <span className="absolute inset-0 rounded-xl overflow-hidden">
                        <img
                          src={image.url}
                          alt=""
                          className="w-full h-full object-center object-cover rounded-xl"
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Image */}
            <div className="w-full aspect-w-1 aspect-h-1">
              <div className="w-full h-96 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImageIndex]?.url}
                    alt={product.name}
                    className="w-full h-full object-center object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Heart className="h-16 w-16 mx-auto mb-2" />
                      <p>Không có ảnh</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                {product.category}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="p-3 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-gray-100"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-3 text-gray-400 hover:text-pink-500 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-gray-100">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gradient">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="ml-3 text-sm text-gray-500">(5.0 - 128 đánh giá)</span>
            </div>

            {/* Price */}
            <div className="mt-6">
              <p className="text-3xl font-bold text-gray-800">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Description */}
            <div className="mt-6 card p-6 rounded-2xl">
              <h3 className="text-sm font-medium text-gray-800 mb-3">Mô tả sản phẩm</h3>
              <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <div className="mt-6 space-y-4">
              <div className="card p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-800">Chất liệu</h3>
                <p className="mt-1 text-sm text-gray-700 font-medium">{product.material}</p>
              </div>

              {product.colors.length > 0 && (
                <div className="card p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Màu sắc có sẵn</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes.length > 0 && (
                <div className="card p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-gray-800 mb-3">Kích thước</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-200"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="card p-4 rounded-xl">
                <h3 className="text-sm font-medium text-gray-800">Tình trạng kho</h3>
                <p className="mt-1 text-sm font-medium">
                  <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </p>
              </div>
            </div>

            {/* Buy Button */}
            <div className="mt-8">
              <button
                onClick={handleBuyClick}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                {product.stock > 0 ? 'Mua ngay trên Facebook' : 'Hết hàng'}
              </button>
              <p className="mt-2 text-xs text-center text-gray-600">
                * Bạn sẽ được chuyển đến trang Facebook để đặt hàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 