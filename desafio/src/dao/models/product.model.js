import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  id: { type: Number, default: 1 }, 
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: Number, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  category: { type: String },
  owner: { type: String, default: 'admin' } 
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema, 'products');

export default Product;
