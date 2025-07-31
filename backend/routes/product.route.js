import express from 'express';
import Product from '../models/product.model.js';

const router = express.Router();

// POST /api/products - Add a new product
router.post('/add-product', async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  try {
    const newProduct = new Product({ name, price, description, imageUrl });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add product.' });
  }
});

// GET /api/products - Get all products
router.get('/get-product', async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// GET /api/products?page=1&limit=10
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;