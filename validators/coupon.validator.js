import { body, param } from "express-validator";

/*
|--------------------------------------------------------------------------
| Apply Coupon
|--------------------------------------------------------------------------
*/

export const applyCouponValidator = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Coupon code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters"),
];

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

export const updateCouponValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid coupon id"),

  body("code")
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Description cannot exceed 300 characters"),

  body("discountType")
    .optional()
    .isIn(["percentage", "fixed"])
    .withMessage("Invalid discount type"),

  body("discountValue")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Discount value must be greater than 0"),

  body("minimumPurchase")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum purchase cannot be negative"),

  body("maximumDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum discount cannot be negative"),

  body("usageLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage limit must be at least 1"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date"),

  body("expiryDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid expiry date"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

export const createCouponValidator = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Coupon code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Coupon code must be between 3 and 20 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Description cannot exceed 300 characters"),

  body("discountType")
    .notEmpty()
    .withMessage("Discount type is required")
    .isIn(["percentage", "fixed"])
    .withMessage("Invalid discount type"),

  body("discountValue")
    .notEmpty()
    .withMessage("Discount value is required")
    .isFloat({ min: 1 })
    .withMessage("Discount value must be greater than 0"),

  body("minimumPurchase")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum purchase cannot be negative"),

  body("maximumDiscount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum discount cannot be negative"),

  body("usageLimit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Usage limit must be at least 1"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date"),

  body("expiryDate")
    .notEmpty()
    .withMessage("Expiry date is required")
    .isISO8601()
    .withMessage("Invalid expiry date"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

/*
|--------------------------------------------------------------------------
| Coupon ID Validator
|--------------------------------------------------------------------------
*/

export const couponIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid coupon id"),
];