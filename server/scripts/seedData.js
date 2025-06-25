const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/webbanlen');
    console.log('Đã kết nối MongoDB');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // Tạo users mẫu
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@webbanlen.com',
      password: 'admin123',
      role: 'admin'
    });

    const normalUser = await User.create({
      username: 'user',
      email: 'user@webbanlen.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Đã tạo users mẫu');

    // Tạo sản phẩm mẫu
    const sampleProducts = [
      {
        name: 'Áo len cổ tròn màu đỏ',
        description: 'Áo len handmade với chất liệu len cao cấp, màu đỏ tươi đẹp. Phù hợp cho mùa đông lạnh.',
        price: 350000,
        category: 'áo len',
        images: [],
        colors: ['Đỏ', 'Đỏ đậm'],
        sizes: ['S', 'M', 'L', 'XL'],
        material: 'Len cao cấp',
        stock: 10,
        isAvailable: true,
        fbLink: 'https://facebook.com',
        createdBy: adminUser._id
      },
      {
        name: 'Khăn len ấm áp',
        description: 'Khăn len dệt thủ công, mềm mại và ấm áp. Thiết kế đơn giản nhưng thanh lịch.',
        price: 150000,
        category: 'khăn len',
        images: [],
        colors: ['Xanh navy', 'Xám', 'Be'],
        sizes: ['Freesize'],
        material: 'Len merino',
        stock: 15,
        isAvailable: true,
        fbLink: 'https://facebook.com',
        createdBy: adminUser._id
      },
      {
        name: 'Mũ len trẻ em',
        description: 'Mũ len dễ thương cho bé với họa tiết ngộ nghĩnh. An toàn cho làn da nhạy cảm.',
        price: 80000,
        category: 'mũ len',
        images: [],
        colors: ['Hồng', 'Xanh', 'Vàng'],
        sizes: ['Kids'],
        material: 'Len organic',
        stock: 20,
        isAvailable: true,
        fbLink: 'https://facebook.com',
        createdBy: adminUser._id
      },
      {
        name: 'Găng tay len cao cấp',
        description: 'Găng tay len thiết kế hiện đại, giữ ấm tuyệt vời trong mùa đông.',
        price: 120000,
        category: 'găng tay len',
        images: [],
        colors: ['Đen', 'Nâu', 'Xám'],
        sizes: ['S', 'M', 'L'],
        material: 'Len cashmere',
        stock: 8,
        isAvailable: true,
        fbLink: 'https://facebook.com',
        createdBy: adminUser._id
      },
      {
        name: 'Tất len dày ấm',
        description: 'Tất len dày, ấm chân trong những ngày lạnh giá. Chất liệu thoáng khí.',
        price: 45000,
        category: 'tất len',
        images: [],
        colors: ['Đen', 'Trắng', 'Xám'],
        sizes: ['35-37', '38-40', '41-43'],
        material: 'Len cotton blend',
        stock: 25,
        isAvailable: true,
        fbLink: 'https://facebook.com',
        createdBy: adminUser._id
      },
      {
        name: 'Túi len handmade',
        description: 'Túi len đan thủ công với thiết kế độc đáo. Vừa thời trang vừa tiện dụng.',
        price: 200000,
        category: 'túi len',
        images: [],
        colors: ['Be', 'Nâu', 'Xanh rêu'],
        sizes: ['Medium', 'Large'],
        material: 'Len thiên nhiên',
        stock: 5,
        isAvailable: true,
        fbLink: 'https://facebook.com',
        createdBy: adminUser._id
      },
      {
        name: 'Áo khoác len dáng dài',
        description: 'Áo khoác len dáng dài, phong cách Hàn Quốc. Giữ ấm hiệu quả.',
        price: 650000,
        category: 'áo len',
        images: [],
        colors: ['Kem', 'Xám', 'Camel'],
        sizes: ['S', 'M', 'L'],
        material: 'Len wool',
        stock: 7,
        isAvailable: true,
        fbLink: 'https://facebook.com',
        createdBy: adminUser._id
      },
      {
        name: 'Khăn choàng len cao cấp',
        description: 'Khăn choàng len mềm mại, sang trọng. Phụ kiện hoàn hảo cho outfit.',
        price: 280000,
        category: 'khăn len',
        images: [],
        colors: ['Đỏ burgundy', 'Xanh navy', 'Đen'],
        sizes: ['Freesize'],
        material: 'Len alpaca',
        stock: 12,
        isAvailable: true,
        fbLink: 'https://facebook.com',
        createdBy: adminUser._id
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('Đã tạo sản phẩm mẫu');

    console.log('✅ Seed data thành công!');
    console.log('\n📊 Dữ liệu đã tạo:');
    console.log(`- ${await User.countDocuments()} users`);
    console.log(`- ${await Product.countDocuments()} products`);
    
    console.log('\n👤 Tài khoản test:');
    console.log('Admin: admin@webbanlen.com / admin123');
    console.log('User: user@webbanlen.com / user123');

  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối MongoDB');
    process.exit(0);
  }
};

// Chạy script
seedData(); 