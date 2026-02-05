import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: 'text'  // Full-text search
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    priceUnit: {
      type: String,
      enum: ['per_person', 'per_event', 'per_hour', 'per_day', 'custom'],
      default: 'per_event'
    }
  },
  availability: {
    daysInAdvance: {
      type: Number,
      default: 7
    },
    maxBookingsPerDay: Number,
    workingDays: [String]  // ['monday', 'tuesday', ...]
  },
  active: {
    type: Boolean,
    default: true,
    index: true
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  tags: [{
    type: String,
    index: true
  }],
  metadata: {
    views: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Compound indexes
serviceSchema.index({ category: 1, active: 1, isDeleted: 1 });
serviceSchema.index({ featured: 1, active: 1, isDeleted: 1 });
serviceSchema.index({ 'metadata.rating': -1, active: 1 });

// Slug generation
serviceSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;
