import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character"),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be 'user' or 'admin'"),
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const verifyOTPValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("otp")
    .customSanitizer((value) => String(value))
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),
];

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),
];

export const resetPasswordValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email"),

  body("otp")
    .customSanitizer((value) => String(value))
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits"),

  body()
    .custom((body, { req }) => {
      const password = body.newPassword || body.password;
      if (!password) {
        throw new Error("Password is required");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      req.body.newPassword = password;
      return true;
    }),
];