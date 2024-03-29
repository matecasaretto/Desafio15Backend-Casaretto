import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'], 
    default: 'user' 
  },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, 
});

const User = mongoose.model('User', userSchema);

export default User;