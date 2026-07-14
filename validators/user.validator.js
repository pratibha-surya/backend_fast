import { body } from "express-validator";

// Update Profile
export const updateProfileValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
];

// Change Password
export const changePasswordValidator = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters")
    .matches(/[A-Z]/)
    .withMessage(
      "Password must contain at least one uppercase letter"
    )
    .matches(/[a-z]/)
    .withMessage(
      "Password must contain at least one lowercase letter"
    )
    .matches(/[0-9]/)
    .withMessage(
      "Password must contain at least one number"
    )
    .matches(/[!@#$%^&*]/)
    .withMessage(
      "Password must contain at least one special character"
    ),
];