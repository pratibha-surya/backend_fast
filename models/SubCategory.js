import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      fileId: {
        type: String,
        default: "",
      },

      url: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

subCategorySchema.index({
  category: 1,
  name: 1,
});

subCategorySchema.index(
  {
    category: 1,
    slug: 1,
  },
  {
    unique: true,
  }
);

const SubCategory = mongoose.model(
  "SubCategory",
  subCategorySchema
);

export default SubCategory;