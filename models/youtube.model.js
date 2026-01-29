import mongoose from 'mongoose';

const youtubeSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false
});

const Youtube = mongoose.model('Youtube', youtubeSchema);

export default Youtube;
