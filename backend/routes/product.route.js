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
router.get('/get-product/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/products?page=1&limit=10
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
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

router.delete('/delete-product/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error while deleting product.' });
  }
});

router.put('/edit-products/:id', async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, imageUrl },
      { new: true } // return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product updated successfully.', product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating product.' });
  }
});

export default router;