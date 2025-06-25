# WebBanLen - Website Bán Hàng Sản Phẩm Len

Website bán hàng sản phẩm len handmade được xây dựng với Node.js, React, TailwindCSS và MongoDB.

## 🚀 Tính năng chính

### Cho người dùng (User):
- ✅ Xem danh sách sản phẩm với phân trang
- ✅ Tìm kiếm và lọc sản phẩm theo danh mục
- ✅ Xem chi tiết sản phẩm với gallery ảnh
- ✅ Nút mua hàng chuyển hướng đến Facebook
- ✅ Đăng ký và đăng nhập tài khoản
- ✅ Responsive design cho mobile và desktop

### Cho quản trị viên (Admin):
- ✅ Dashboard tổng quan thống kê
- ✅ Quản lý sản phẩm (CRUD operations)
- ✅ Upload và quản lý ảnh sản phẩm
- ✅ Quản lý người dùng và phân quyền
- ✅ Xem danh sách tất cả sản phẩm (cả ẩn và hiển thị)

## 🛠 Công nghệ sử dụng

### Backend:
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Multer** + **Cloudinary** - Upload và lưu trữ ảnh
- **bcryptjs** - Mã hóa mật khẩu

### Frontend:
- **React** + **TypeScript** - UI framework
- **TailwindCSS** - Styling
- **React Router** - Routing
- **React Query** - State management và API calls
- **React Hook Form** - Form handling
- **Lucide React** - Icons

## 📋 Yêu cầu hệ thống

- Node.js >= 14.x
- MongoDB >= 4.x
- npm hoặc yarn

## 🏃‍♂️ Hướng dẫn cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd webbanlen
```

### 2. Cài đặt dependencies
```bash
# Cài đặt tất cả dependencies
npm run install-all

# Hoặc cài đặt từng phần
npm run install-server
npm run install-client
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục `server`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/webbanlen
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Khởi động ứng dụng

#### Development mode (khuyên dùng):
```bash
npm run dev
```
Lệnh này sẽ chạy đồng thời server (port 5000) và client (port 3000).

#### Hoặc chạy riêng từng phần:
```bash
# Terminal 1 - Chạy server
npm run server

# Terminal 2 - Chạy client
npm run client
```

### 5. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👤 Tài khoản demo

### Admin:
- **Email**: admin@webbanlen.com
- **Mật khẩu**: admin123

### User thường:
- **Email**: user@webbanlen.com  
- **Mật khẩu**: user123

*Lưu ý: Bạn cần tạo các tài khoản này thông qua API hoặc đăng ký trên website.*

## 📁 Cấu trúc dự án

```
webbanlen/
├── server/                 # Backend Node.js
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Server entry point
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── public/            # Static files
└── package.json           # Root package.json
```

## 🔧 API Endpoints chính

### Authentication:
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Products (Public):
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm

### Products (Admin only):
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `GET /api/products/admin/all` - Lấy tất cả sản phẩm (admin)

### Users (Admin only):
- `GET /api/users/admin/all` - Danh sách tất cả users
- `PUT /api/users/admin/:id/role` - Cập nhật role user
- `DELETE /api/users/admin/:id` - Xóa user

## 🎨 Thiết kế và UX

- **Responsive Design**: Tương thích với mọi thiết bị
- **Modern UI**: Sử dụng TailwindCSS với design system nhất quán
- **Loading States**: Skeleton loading và loading indicators
- **Error Handling**: Toast notifications cho feedback
- **Accessibility**: ARIA labels và keyboard navigation

## 🔒 Bảo mật

- JWT token authentication
- Password hashing với bcryptjs
- Protected routes cho admin
- Input validation và sanitization
- CORS configuration

## 📱 Tích hợp Facebook

- Nút "Mua hàng" chuyển hướng đến Facebook page
- Có thể cấu hình link Facebook cho từng sản phẩm
- Hỗ trợ chia sẻ sản phẩm lên social media

## 🚀 Deploy

### Backend (Server):
- Có thể deploy lên Heroku, Railway, hoặc VPS
- Cần cấu hình MongoDB Atlas cho production
- Thiết lập Cloudinary cho lưu trữ ảnh

### Frontend (Client):
- Có thể deploy lên Vercel, Netlify hoặc static hosting
- Cần build production: `cd client && npm run build`

## 🔧 Customization

### Thêm danh mục sản phẩm mới:
1. Cập nhật enum trong `server/models/Product.js`
2. Cập nhật CATEGORIES trong `client/src/pages/HomePage.tsx`

### Thay đổi theme colors:
1. Cập nhật `client/tailwind.config.js`
2. Cập nhật CSS variables trong `client/src/index.css`

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: your-email@example.com
- **Facebook**: https://facebook.com/your-page

---

Made with ❤️ for Vietnamese handmade wool products 