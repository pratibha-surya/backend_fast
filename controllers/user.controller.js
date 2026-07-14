


import ApiResponse from "../utils/ApiResponse.js";

import * as userService from "../services/user.service.js"
import asyncHandler from "../middleware/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Profile fetched successfully", user)
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(
    req.user._id,
    req.body
  );

  res.status(200).json(
    new ApiResponse(200, "Profile updated successfully", user)
  );
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  await userService.changePassword(
    req.user._id,
    oldPassword,
    newPassword
  );

  res.status(200).json(
    new ApiResponse(200, "Password changed successfully")
  );
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Account deleted successfully")
  );
});