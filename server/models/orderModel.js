const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ingredient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredients",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", schema);
module.exports = Order;
