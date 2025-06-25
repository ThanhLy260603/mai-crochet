# 🚀 Hướng dẫn Deploy Mai Crochet lên Web

## 📋 Yêu cầu trước khi deploy:
- Tài khoản GitHub
- Tài khoản Vercel (free)
- Tài khoản MongoDB Atlas (free)
- Tài khoản Cloudinary (free)

---

## 🌐 **Phương án 1: Vercel + MongoDB Atlas (Khuyến nghị)**

### Bước 1: Chuẩn bị MongoDB Atlas
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Tạo tài khoản free
3. Tạo cluster mới (M0 - Free tier)
4. Trong **Database Access**: Tạo user với quyền readWrite
5. Trong **Network Access**: Thêm IP `0.0.0.0/0` (cho phép tất cả)
6. Lấy **Connection String**: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/maicrochet`

### Bước 2: Push code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit - Mai Crochet"
git branch -M main
git remote add origin https://github.com/username/mai-crochet.git
git push -u origin main
```

### Bước 3: Deploy với Vercel
1. Truy cập [Vercel](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Import repository từ GitHub
5. **Framework Preset**: Other
6. **Root Directory**: ./
7. Click **"Deploy"**

### Bước 4: Cấu hình Environment Variables
Trong Vercel Dashboard > Settings > Environment Variables, thêm:

```
CLOUDINARY_CLOUD_NAME=dkychnilg
CLOUDINARY_API_KEY=391679348121271
CLOUDINARY_API_SECRET=kAfwyJ3jSDBCcqfktPiTmKT8A
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/maicrochet
JWT_SECRET=mai-crochet-super-secret-key-2024
NODE_ENV=production
```

### Bước 5: Redeploy
Sau khi thêm environment variables, click **"Redeploy"**

---

## 🐋 **Phương án 2: Docker + DigitalOcean/Heroku**

### Tạo Dockerfile cho server:
```dockerfile
# server/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Tạo docker-compose.yml:
```yaml
version: '3.8'
services:
  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
      - JWT_SECRET=${JWT_SECRET}
  
  client:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - server
```

---

## 🛠️ **Phương án 3: Netlify + Railway**

### Frontend (Netlify):
1. Build client: `cd client && npm run build`
2. Upload thư mục `build` lên Netlify
3. Cấu hình redirects trong `client/public/_redirects`:
```
/api/* https://your-railway-app.railway.app/api/:splat 200
/* /index.html 200
```

### Backend (Railway):
1. Tạo tài khoản [Railway](https://railway.app)
2. Connect GitHub repository
3. Deploy server folder
4. Thêm environment variables tương tự Vercel

---

## 📱 **Sau khi deploy thành công:**

### Kiểm tra:
- ✅ Trang chủ hiển thị đúng
- ✅ Đăng ký/đăng nhập hoạt động
- ✅ Upload ảnh lên Cloudinary
- ✅ CRUD sản phẩm trong admin
- ✅ API endpoints hoạt động

### Domain tùy chỉnh (Tùy chọn):
1. Mua domain từ Namecheap, GoDaddy, etc.
2. Trong Vercel: Settings > Domains > Add domain
3. Cấu hình DNS theo hướng dẫn

---

## 🔧 **Troubleshooting:**

### Lỗi CORS:
Cập nhật `server/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-vercel-app.vercel.app'],
  credentials: true
}));
```

### Lỗi Environment Variables:
- Đảm bảo tất cả biến đã được thêm
- Restart/redeploy sau khi thêm biến
- Kiểm tra syntax không có space thừa

### Lỗi Database Connection:
- Kiểm tra MongoDB Atlas Network Access
- Đảm bảo user có quyền readWrite
- Kiểm tra connection string đúng format

---

## 💡 **Tips:**
- Sử dụng Vercel cho simple deployment
- MongoDB Atlas M0 free tier đủ cho development
- Cloudinary free tier: 25GB storage, 25GB bandwidth/tháng
- Luôn backup database trước khi deploy production

## 🎯 **URL Demo sau khi deploy:**
- **Frontend**: https://mai-crochet.vercel.app
- **Backend API**: https://mai-crochet.vercel.app/api
- **Admin**: https://mai-crochet.vercel.app/admin 