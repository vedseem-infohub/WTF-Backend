import mongoose from 'mongoose';

const rangeMenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  range: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false
});

const RangeMenu = mongoose.model('RangeMenu', rangeMenuSchema);

export default RangeMenu;
