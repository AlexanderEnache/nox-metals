import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  imageUrl: String,
});

// Auto-increment productId starting from 1
productSchema.plugin(AutoIncrement, { inc_field: 'productId' });

const Product = mongoose.model('Product', productSchema);

export default Product;