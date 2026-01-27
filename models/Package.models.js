import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 8,
  },
  image: {
    type: String, // Cloudinary URL
    required: true,
  },
  isVeg: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

export default Package;
