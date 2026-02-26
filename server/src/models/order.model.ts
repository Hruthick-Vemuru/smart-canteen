import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: Number,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
      index: true,
    },

    items: [
      {
        id: String,
        name: String,
        price: Number,
        qty: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "CREATED",
        "PAYMENT_PENDING",
        "PLACED",
        "PREPARING",
        "READY",
        "PICKED_UP",
        "PAYMENT_FAILED",
      ],
      default: "CREATED",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    paymentId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    pickedUpAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
