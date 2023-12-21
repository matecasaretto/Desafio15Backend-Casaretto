import mongoose from 'mongoose';

const collection = "Product"

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: Number, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
});

const productModel = mongoose.model(collection, productSchema);

export default productModel;
 