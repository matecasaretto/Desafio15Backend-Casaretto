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
  documents: [
    {
      name: String,
      reference: String
    }
  ],
  last_connection: Date
});


userSchema.methods.login = function() {
  this.last_connection = new Date();
};

userSchema.methods.logout = function() {
  this.last_connection = new Date();
};

const User = mongoose.model('User', userSchema);

export default User;
