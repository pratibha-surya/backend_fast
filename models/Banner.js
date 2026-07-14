import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    subTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    image: {
      fileId: {
        type: String,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },
    },

    buttonText: {
      type: String,
      default: "",
    },

    buttonLink: {
      type: String,
      default: "",
    },

    bannerType: {
      type: String,
      enum: [
        "home",
        "category",
        "offer",
        "popup",
      ],
      default: "home",
    },

    position: {
      type: String,
      enum: [
        "top",
        "middle",
        "bottom",
      ],
      default: "top",
    },

    displayOrder: {
      type: Number,
      default: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
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

bannerSchema.index({
  name: "text",
  title: "text",
});

export default mongoose.model(
  "Banner",
  bannerSchema
);