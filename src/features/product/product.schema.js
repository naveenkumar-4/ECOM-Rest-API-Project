import mongoose from "mongoose";

export const productSchemaa = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});
