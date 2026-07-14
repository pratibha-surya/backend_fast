import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        fileId: String,
        url: String,
      },
    ],

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

reviewSchema.index(
  {
    product: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Review",
  reviewSchema
);