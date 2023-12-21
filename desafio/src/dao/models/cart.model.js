import mongoose from 'mongoose';

const collection = "Cart";

const cartSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  products: [
    {
      id: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ]
});

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;
