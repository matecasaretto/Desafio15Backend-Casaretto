import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, required: true } }],
});

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;

