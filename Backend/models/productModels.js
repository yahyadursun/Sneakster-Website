import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  color: { type: String, required: true },
  stock: {
    type: mongoose.Schema.Types.Mixed, // Use Mixed type instead of Map
    required: true,
  },
  bestseller: { type: Boolean, default: false },
  newSeason: { type: Boolean, default: false },
  date: { type: Number, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
