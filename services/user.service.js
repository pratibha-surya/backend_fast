

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateProfile = async (userId, payload) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = payload.name ?? user.name;

  await user.save();

  // Convert to object and sanitize password out of response
  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;

  return sanitizedUser;
};

export const changePassword = async (
  userId,
  oldPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;

  await user.save();

  return true;
};

export const deleteAccount = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await user.deleteOne();

  return true;
};