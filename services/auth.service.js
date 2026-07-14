import User from "../models/User.js";
import OTP from "../models/OTP.js";
import RefreshToken from "../models/RefreshToken.js";

import ApiError from "../utils/ApiError.js";

import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";
import { addEmailJob } from "../queues/email.queue.js";
import redisClient from "../config/redis.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// Helper to push to queue if Redis is running, or fall back to sending directly
const sendEmailAsync = async ({ to, subject, html }) => {
  try {
    if (redisClient.isOpen) {
      await addEmailJob(to, subject, html);
    } else {
      await sendEmail({ to, subject, html });
    }
  } catch (err) {
    console.error("Failed to send email (queue/direct):", err);
    // If queue fail, try direct fallback
    await sendEmail({ to, subject, html }).catch(e => console.error("Direct email fallback also failed:", e));
  }
};


// Send Register OTP
export const sendRegisterOTP = async ({ email }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const otp = generateOTP();

  await OTP.findOneAndUpdate(
    { email: normalizedEmail, type: "REGISTER" },
    {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    },
    { upsert: true, new: true }
  );

  await sendEmailAsync({
    to: normalizedEmail,
    subject: "Verify Account",
    html: `<h2>Your OTP : ${otp}</h2>`,
  });

  return true;
};


// Register
export const register = async ({ name, email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const userRole = role || "user";
  const isVerified = userRole === "admin";

  if (!isVerified) {
    const otpDoc = await OTP.findOne({
      email: normalizedEmail,
      type: "REGISTER",
      isVerified: true,
    });

    if (!otpDoc) {
      throw new ApiError(400, "Email verification is pending or expired");
    }

    await OTP.deleteMany({ email: normalizedEmail, type: "REGISTER" });
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: userRole,
    isVerified: true,
  });

  return user;
};


// Verify OTP
export const verifyOTP = async ({ email, otp }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const stringOtp = String(otp).trim();
  const user = await User.findOne({ email: normalizedEmail });

  const query = {
    otp: stringOtp,
    type: { $in: ["REGISTER", "FORGOT_PASSWORD"] },
    $or: [
      { email: normalizedEmail },
    ],
  };

  if (user) {
    query.$or.push({ user: user._id });
  }

  const otpDoc = await OTP.findOne(query);

  if (!otpDoc) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (otpDoc.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  if (otpDoc.type === "REGISTER") {
    otpDoc.isVerified = true;
    await otpDoc.save();
  }

  return true;
};


// Login
export const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid Credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(401, "Please verify your account");
  }

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};


// Refresh Token
export const refreshAccessToken = async (refreshToken) => {
  const token = await RefreshToken.findOne({
    token: refreshToken,
  });

  if (!token) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  const user = await User.findById(token.user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = generateAccessToken(user);

  return accessToken;
};


// Logout
export const logout = async (userId) => {
  await RefreshToken.deleteMany({
    user: userId,
  });

  return true;
};


// Forgot Password
export const forgotPassword = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOTP();

  await OTP.create({
    user: user._id,
    otp,
    type: "FORGOT_PASSWORD",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendEmailAsync({
    to: normalizedEmail,
    subject: "Reset Password",
    html: `<h2>Your OTP : ${otp}</h2>`,
  });

  return true;
};


// Reset Password
export const resetPassword = async ({
  email,
  otp,
  newPassword,
}) => {
  const normalizedEmail = email.trim().toLowerCase();
  const stringOtp = String(otp).trim();

  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otpDoc = await OTP.findOne({
    user: user._id,
    otp: stringOtp,
    type: "FORGOT_PASSWORD",
  });

  if (!otpDoc) {
    throw new ApiError(400, "Invalid OTP");
  }

  user.password = newPassword;

  await user.save();

  await OTP.deleteOne({
    _id: otpDoc._id,
  });

  return true;
};