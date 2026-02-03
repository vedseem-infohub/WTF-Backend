import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Veg', 'Non-Veg'],
    default: 'Veg',
  },
  category: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  people: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  measurement: {
    type: String,
    enum: ['kg', 'pcs'],
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
