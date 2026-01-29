import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  versionKey: false
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
