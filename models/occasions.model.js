import mongoose from 'mongoose';

const occasionSchema = new mongoose.Schema({
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

const Occasion = mongoose.model('Occasion', occasionSchema);

export default Occasion;
