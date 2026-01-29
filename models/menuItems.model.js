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
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: Number, // Using ID as per existing frontend logic (1=Starter, etc.)
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
  portionSize: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
