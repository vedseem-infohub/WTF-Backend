import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  icon: {
    type: String  // e.g., "🍽️", "🎨", "📸"
  },
  displayOrder: {
    type: Number,
    default: 0,
    index: true
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  metadata: {
    serviceCount: { type: Number, default: 0 },
    lastServiceAddedAt: Date
  }
}, {
  timestamps: true,
  versionKey: false
});

// Compound index for common queries
categorySchema.index({ active: 1, isDeleted: 1, displayOrder: 1 });

// Pre-save hook to generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
