import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    otp: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    type: {
      type: String,
      enum: [
        "REGISTER",
        "LOGIN",
        "FORGOT_PASSWORD",
      ],
      default: "REGISTER",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;