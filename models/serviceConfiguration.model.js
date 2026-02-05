import mongoose from 'mongoose';

const optionTypeSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true  // e.g., 'starters', 'decorItems', 'photoPackages'
  },
  label: {
    type: String,
    required: true  // e.g., 'Starters', 'Decoration Items'
  },
  icon: String,  // e.g., '🥗', '🎨'
  category: {
    type: String,
    enum: ['included', 'addon', 'premium', 'excluded'],
    default: 'included'
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  minSelections: {
    type: Number,
    default: 0
  },
  maxSelections: {
    type: Number,
    default: null  // null = unlimited
  },
  allowCustomItems: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const serviceConfigurationSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
    unique: true,
    index: true
  },
  optionTypes: [optionTypeSchema],
  selectionRules: {
    allowMixedCategories: {
      type: Boolean,
      default: true
    },
    requireMinimumSelection: {
      type: Boolean,
      default: false
    }
  },
  version: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

const ServiceConfiguration = mongoose.models.ServiceConfiguration || mongoose.model('ServiceConfiguration', serviceConfigurationSchema);

export default ServiceConfiguration;
