import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    date: {
      type: String,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
