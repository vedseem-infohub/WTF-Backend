import mongoose from 'mongoose';

const selectionItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',  // References existing menu items
    required: true
  },
  customData: {
    type: mongoose.Schema.Types.Mixed  // For custom items
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  addedBy: {
    type: String,
    enum: ['admin', 'customer', 'system'],
    default: 'admin'
  }
}, { _id: false });

const optionStateSchema = new mongoose.Schema({
  optionKey: {
    type: String,
    required: true  // Matches ServiceConfiguration.optionTypes.key
  },
  selected: [selectionItemSchema],
  unselected: [selectionItemSchema],
  metadata: {
    lastModified: Date,
    modifiedBy: String
  }
}, { _id: false });

const serviceSelectionSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
    index: true
  },
  configurationVersion: {
    type: Number,
    required: true  // Matches ServiceConfiguration.version
  },
  options: [optionStateSchema],
  history: [{
    timestamp: Date,
    changes: mongoose.Schema.Types.Mixed,
    changedBy: String
  }],
  isLocked: {
    type: Boolean,
    default: false
  },
  lockedAt: Date,
  lockedBy: String
}, {
  timestamps: true,
  versionKey: false
});

// Compound index for fast lookups
serviceSelectionSchema.index({ service: 1, configurationVersion: 1 }, { unique: true });

const ServiceSelection = mongoose.models.ServiceSelection || mongoose.model('ServiceSelection', serviceSelectionSchema);

export default ServiceSelection;
