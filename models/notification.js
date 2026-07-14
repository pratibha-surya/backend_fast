import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "order",
        "payment",
        "offer",
        "system",
      ],
      default: "system",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    data: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Notification = mongoose.model(
  "Notification",
  notificationSchema
);

export default Notification;