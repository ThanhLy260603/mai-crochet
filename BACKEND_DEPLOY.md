# 🚂 Deploy Backend lên Railway

## 🎯 **Lý do tách riêng:**
- Vercel có giới hạn với Node.js serverless functions
- Railway chuyên về backend deployment
- Dễ quản lý và scale riêng biệt

## 🚀 **Bước 1: Chuẩn bị Railway**

1. Truy cập: https://railway.app
2. Đăng ký bằng GitHub
3. Click **"New Project"**
4. Chọn **"Deploy from GitHub repo"**
5. Chọn repository: `mai-crochet`

## ⚙️ **Bước 2: Cấu hình Railway**

### **Root Directory:**
- Set **Root Directory**: `server`

### **Start Command:**
- Set **Start Command**: `npm start`

### **Environment Variables:**
```
CLOUDINARY_CLOUD_NAME=dkychnilg
CLOUDINARY_API_KEY=391679348121271
CLOUDINARY_API_SECRET=kAfwyJ3jSDBCcqfktPiTmKT8A
MONGODB_URI=mongodb+srv://maicrochet:123@mai-crochet.ogylbvd.mongodb.net/maicrochet?retryWrites=true&w=majority&appName=mai-crochet
JWT_SECRET=mai-crochet-super-secret-key-2024
NODE_ENV=production
PORT=5000
```

## 🔗 **Bước 3: Cập nhật Frontend**

Sau khi deploy backend, bạn sẽ có URL như:
`https://mai-crochet-backend.railway.app`

### **Thêm vào Vercel Environment Variables:**
```
REACT_APP_API_URL=https://mai-crochet-backend.railway.app/api
```

## 🌐 **Kết quả cuối cùng:**
- **Frontend**: https://mai-crochet.vercel.app
- **Backend**: https://mai-crochet-backend.railway.app
- **API**: https://mai-crochet-backend.railway.app/api

---

# 🆘 **Phương án thay thế: Render**

## **Nếu Railway không hoạt động:**

1. Truy cập: https://render.com
2. Đăng ký bằng GitHub
3. **New Web Service**
4. Connect GitHub repository
5. **Root Directory**: `server`
6. **Build Command**: `npm install`
7. **Start Command**: `npm start`
8. Thêm Environment Variables tương tự

---

# 🛠️ **Sửa CORS cho production:**

Trong `server/server.js`, thêm:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mai-crochet.vercel.app',
    'https://mai-crochet-*.vercel.app'
  ],
  credentials: true
}));
```

---

# 🔄 **Auto-deploy workflow:**

1. Push code → GitHub
2. Railway tự động deploy backend
3. Vercel tự động deploy frontend
4. Website update automatically! 