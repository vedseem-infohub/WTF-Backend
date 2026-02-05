import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      default: "Festival",
    },
    status: {
      type: String,
      enum: ["Upcoming", "Limited Seats", "Open for All", "Past"],
      default: "Upcoming",
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
