const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mai-crochet.vercel.app',
    'https://mai-crochet-*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webbanlen', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Kết nối MongoDB thành công'))
.catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to WebBanLen API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi server!' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
}); 