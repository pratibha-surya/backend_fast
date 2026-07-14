import { Router } from "express";

import * as authController from "../controllers/auth.controller.js";




import { forgotPasswordValidator, loginValidator, registerValidator, resetPasswordValidator, verifyOTPValidator } from "../validators/auth.validator.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// Send Register OTP
router.post(
  "/send-register-otp",
  forgotPasswordValidator,
  validateMiddleware,
  authController.sendRegisterOTP
);

// Register
router.post(
  "/register",
  registerValidator,
  validateMiddleware,
  authController.register
);

// Verify OTP
router.post(
  "/verify-otp",
  verifyOTPValidator,
  validateMiddleware,
  authController.verifyOTP
);

// Login
router.post(
  "/login",
  loginValidator,
  validateMiddleware,
  authController.login
);

// Refresh Access Token
router.post(
  "/refresh-token",
  authController.refreshToken
);

// Logout
router.post(
  "/logout",
  authMiddleware,
  authController.logout
);

// Forgot Password
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validateMiddleware,
  authController.forgotPassword
);

// Reset Password
router.post(
  "/reset-password",
  resetPasswordValidator,
  validateMiddleware,
  authController.resetPassword
);

export default router;