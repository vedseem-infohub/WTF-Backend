import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
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

const Service = mongoose.model('Service', serviceSchema);

export default Service;
