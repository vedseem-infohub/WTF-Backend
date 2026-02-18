import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Allow guest orders
  },
  entityType: {
    type: String,
    enum: ['occasion', 'service', 'category', 'package'], // Added 'package'
    required: true
  },
  entityId: {
    type: String, // Relaxed from ObjectId to String
    required: true
  },
  items: [{
    itemId: { type: String },
    name: String,
    category: String,
    quantity: Number,
    price: Number,
    baseQuantity: Number,
    measurement: String,
    type: { type: String }, // Explicit definition to avoid conflict with Mongoose 'type' keyword
    image: String
  }],
  bookingDetails: {
    date: String,
    time: String,
    vegGuests: Number,
    nonVegGuests: { type: Number, default: 0 }
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'zoho'],
    default: null
  },
  zohoTransactionId: {
    type: String,
    default: null
  },
  zohoPaymentId: {
    type: String,
    default: null
  },
  paymentGatewayResponse: {
    type: Object,
    default: {}
  },
  address: {
    type: String,
    default: null
  },
  notes: String
}, {
  timestamps: true
});

// Create indexes for common queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
