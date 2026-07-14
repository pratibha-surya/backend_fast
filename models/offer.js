import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    offerType: {
      type: String,
      enum: [
        "product",
        "category",
        "brand",
      ],
      required: true,
    },

    discountType: {
      type: String,
      enum: [
        "percentage",
        "fixed",
      ],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },

    minimumPurchase: {
      type: Number,
      default: 0,
    },

    maximumDiscount: {
      type: Number,
      default: 0,
    },

    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],

    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    }],

    brands: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    }],

    priority: {
      type: Number,
      default: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "inactive",
      ],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

offerSchema.index({
  name: "text",
});

export default mongoose.model(
  "Offer",
  offerSchema
);