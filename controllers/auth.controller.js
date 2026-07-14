import asyncHandler from "../middleware/asyncHandler.js";
import * as authService from "../services/auth.service.js";



import ApiResponse from "../utils/ApiResponse.js";


// Send Register OTP
export const sendRegisterOTP = asyncHandler(async (req, res) => {
  await authService.sendRegisterOTP(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      "OTP sent successfully"
    )
  );
});


// Register
export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      user
    )
  );
});


// Verify OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  await authService.verifyOTP(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      "OTP verified successfully"
    )
  );
});


// Login
export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  return res
    .status(200)
    .cookie("accessToken", data.accessToken)
    .cookie("refreshToken", data.refreshToken)
    .json(
      new ApiResponse(
        200,
        "Login successful",
        data
      )
    );
});


// Refresh Token
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  const accessToken =
    await authService.refreshAccessToken(token);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Access token generated",
      {
        accessToken,
      }
    )
  );
});


// Logout
export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json(
    new ApiResponse(
      200,
      "Logout successful"
    )
  );
});


// Forgot Password
export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  return res.status(200).json(
    new ApiResponse(
      200,
      "OTP sent successfully"
    )
  );
});


// Reset Password
export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password reset successful"
    )
  );
});