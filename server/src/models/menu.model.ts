import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: String,
    imageUrl: String,

    category: {
      type: String,
      enum: [
        "BREAKFAST",
        "RICE_NOODLES",
        "STARTERS",
        "CURRIES",
        "SPECIALS",
      ],
      required: true,
    },

    isVeg: {
      type: Boolean,
      required: true,
    },

    isSpecial: {
      type: Boolean,
      default: false,
    },

    available: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
