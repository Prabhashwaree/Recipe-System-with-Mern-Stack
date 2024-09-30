const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
    quantity:{
      type:Number
    },
    price:{
      type:Number
    },
    image: { type: String },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Ingredients = mongoose.model("Ingredients", schema);
module.exports = Ingredients;
