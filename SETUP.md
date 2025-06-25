# Hướng Dẫn Thiết Lập Dự Án

## Yêu Cầu Hệ Thống

- Node.js (version 14 trở lên)
- MongoDB (có thể sử dụng MongoDB Atlas hoặc local)
- Git

## Bước 1: Cài Đặt Dependencies

### Cài đặt tất cả dependencies:
```bash
npm run install-all
```

Hoặc cài đặt từng phần:
```bash
# Cài đặt dependencies cho server
npm run install-server

# Cài đặt dependencies cho client
npm run install-client
```

## Bước 2: Cấu Hình Environment

### Server (.env trong thư mục server/):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/webbanlen
JWT_SECRET=webbanlen_secret_key_123
NODE_ENV=development

# Cloudinary config (tùy chọn - cho upload ảnh)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Bước 3: Khởi Động MongoDB

### MongoDB Local:
```bash
mongod
```

### MongoDB Atlas:
- Tạo cluster trên MongoDB Atlas
- Lấy connection string và thay vào MONGODB_URI

## Bước 4: Khởi Động Ứng Dụng

### Cách 1: Sử dụng PowerShell Script (Windows)
```powershell
.\start-dev.ps1
```

### Cách 2: Khởi động thủ công

#### Terminal 1 - Server:
```bash
cd server
npm run dev
```

#### Terminal 2 - Client:
```bash
cd client
npm start
```

### Cách 3: Sử dụng Concurrently (sau khi cài đặt)
```bash
npm install
npm run dev
```

## Bước 5: Truy Cập Ứng Dụng

- **Client (Frontend)**: http://localhost:3000
- **Server (Backend API)**: http://localhost:5000

## Bước 6: Tạo Dữ Liệu Mẫu (Tùy chọn)

```bash
cd server
npm run seed
```

Điều này sẽ tạo:
- Tài khoản admin: username=admin, password=admin123
- Tài khoản user: username=user, password=user123
- 8 sản phẩm len mẫu

## Thông Tin Đăng Nhập Mặc Định

### Admin:
- Username: admin
- Password: admin123

### User:
- Username: user
- Password: user123

## Lỗi Thường Gặp

### 1. "Module not found: Error: Can't resolve './App'"
- Đảm bảo đã cài đặt dependencies: `cd client && npm install`
- Tạo file tsconfig.json trong thư mục client nếu chưa có

### 2. "Proxy error: Could not proxy request"
- Đảm bảo server đang chạy trên port 5000
- Kiểm tra MongoDB đã khởi động

### 3. "MongooseServerSelectionError"
- Kiểm tra MongoDB đã khởi động
- Kiểm tra connection string trong .env

### 4. TypeScript errors
- Đảm bảo đã tạo tsconfig.json
- Chạy `npm install` để cài đặt type definitions

## Cấu Trúc Dự Án

```
webbanlen/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/     # React components
│   │   ├── pages/         # Trang web
│   │   ├── services/      # API calls
│   │   ├── types/         # TypeScript types
│   │   └── contexts/      # React contexts
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── scripts/          # Utility scripts
│   └── package.json
├── package.json          # Root package.json
├── start-dev.ps1         # PowerShell script khởi động
└── README.md
```

## Phát Triển

### Thêm sản phẩm mới:
1. Đăng nhập với tài khoản admin
2. Vào Admin Dashboard
3. Chọn "Quản lý sản phẩm"
4. Nhấn "Thêm sản phẩm"

### Quản lý người dùng:
1. Đăng nhập với tài khoản admin
2. Vào Admin Dashboard
3. Chọn "Quản lý người dùng" 