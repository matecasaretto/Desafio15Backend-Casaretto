import mongoose from 'mongoose';

const collection = 'Message';

const messageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
});

const messageModel = mongoose.model(collection, messageSchema);

export default messageModel;