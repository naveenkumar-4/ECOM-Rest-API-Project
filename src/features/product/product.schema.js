import mongoose from "mongoose";

export const productSchemaa = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  category: String,
  sizes: { type: String, enum: ["S", "M", "XL", "XXL"] },
});
