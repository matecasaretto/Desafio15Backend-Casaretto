import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaserEmail: { 
    type: String,
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
