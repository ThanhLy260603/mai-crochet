const express = require('express');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { upload, cloudinary, hasCloudinaryConfig } = require('../middleware/upload');

const router = express.Router();

// Lấy tất cả sản phẩm (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search } = req.query;
    const query = {};

    // Filter theo category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Tìm kiếm
    if (search) {
      query.$text = { $search: search };
    }

    // Chỉ hiển thị sản phẩm có sẵn
    query.isAvailable = true;

    const products = await Product.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
});

// Lấy sản phẩm theo ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'username');

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
});

// Tạo sản phẩm mới (chỉ admin)
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      colors,
      sizes,
      material,
      stock,
      fbLink
    } = req.body;

    // Debug log
    console.log('Received colors:', colors, 'Type:', typeof colors);
    console.log('Received sizes:', sizes, 'Type:', typeof sizes);

    // Xử lý ảnh upload
    const images = req.files?.map(file => {
      if (hasCloudinaryConfig) {
        return {
          url: file.path,
          publicId: file.filename
        };
      } else {
        // Local storage - tạo URL tương đối
        return {
          url: `/uploads/${file.filename}`,
          publicId: file.filename
        };
      }
    }) || [];

    // Xử lý colors và sizes an toàn hơn
    let parsedColors = [];
    let parsedSizes = [];

    if (colors && colors !== 'undefined' && colors !== 'null') {
      try {
        parsedColors = JSON.parse(colors);
      } catch (e) {
        console.error('Error parsing colors:', e);
        parsedColors = [];
      }
    }

    if (sizes && sizes !== 'undefined' && sizes !== 'null') {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch (e) {
        console.error('Error parsing sizes:', e);
        parsedSizes = [];
      }
    }

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      images,
      colors: parsedColors,
      sizes: parsedSizes,
      material,
      stock: parseInt(stock) || 0,
      fbLink,
      createdBy: req.user._id
    });

    await product.save();
    await product.populate('createdBy', 'username');

    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm' });
  }
});

// Cập nhật sản phẩm (chỉ admin)
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const {
      name,
      description,
      price,
      category,
      colors,
      sizes,
      material,
      stock,
      fbLink,
      isAvailable,
      removeImages
    } = req.body;

    // Xóa ảnh cũ nếu có yêu cầu
    if (removeImages && removeImages !== 'undefined') {
      const imagesToRemove = JSON.parse(removeImages);
      for (const publicId of imagesToRemove) {
        if (hasCloudinaryConfig && cloudinary) {
          await cloudinary.uploader.destroy(publicId);
        } else {
          // Xóa file local
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(__dirname, '../uploads', publicId);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        product.images = product.images.filter(img => img.publicId !== publicId);
      }
    }

    // Thêm ảnh mới
    if (req.files?.length > 0) {
      const newImages = req.files.map(file => {
        if (hasCloudinaryConfig) {
          return {
            url: file.path,
            publicId: file.filename
          };
        } else {
          return {
            url: `/uploads/${file.filename}`,
            publicId: file.filename
          };
        }
      });
      product.images.push(...newImages);
    }

    // Cập nhật các field khác
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    
    // Xử lý colors an toàn
    if (colors && colors !== 'undefined' && colors !== 'null') {
      try {
        product.colors = JSON.parse(colors);
      } catch (e) {
        console.error('Error parsing colors in update:', e);
      }
    }
    
    // Xử lý sizes an toàn  
    if (sizes && sizes !== 'undefined' && sizes !== 'null') {
      try {
        product.sizes = JSON.parse(sizes);
      } catch (e) {
        console.error('Error parsing sizes in update:', e);
      }
    }
    
    if (material) product.material = material;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (fbLink) product.fbLink = fbLink;
    if (isAvailable !== undefined) product.isAvailable = isAvailable === 'true';

    await product.save();
    await product.populate('createdBy', 'username');

    res.json({
      message: 'Cập nhật sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm' });
  }
});

// Xóa sản phẩm (chỉ admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    // Xóa ảnh
    for (const image of product.images) {
      if (hasCloudinaryConfig && cloudinary) {
        await cloudinary.uploader.destroy(image.publicId);
      } else {
        // Xóa file local
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '../uploads', image.publicId);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
  }
});

// Lấy tất cả sản phẩm cho admin
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const products = await Product.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments();

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
});

module.exports = router; 