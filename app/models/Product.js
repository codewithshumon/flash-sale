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
    description: {
      type: String,
      required: true,
    },
    category: {
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
    totalItems: {
      type: Number,
      required: true,
    },
    soldItems: {
      type: Number,
      default: 0,
    },
    flashSaleEnd: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
    collection: "test", // This sets the collection name to 'test'
  }
);

// Check if model already exists to prevent OverwriteModelError
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
