import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    required: true
  },
  blogType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
},

  {
    timestamps: true,
    versionKey: false
  }
);

const blogs = mongoose.model("blogs", blogsSchema);
export default blogs;