import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    itemsLeft: {
      type: Number,
      required: true,
    },
    flashSaleEnd: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Check if model already exists to prevent OverwriteModelError
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
