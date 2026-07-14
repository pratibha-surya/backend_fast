import { body, param } from "express-validator";

export const createBrandValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Brand name must be between 2 and 100 characters"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage(
      "Description cannot exceed 500 characters"
    ),

  body("website")
    .optional()
    .isURL()
    .withMessage("Invalid website url"),
];

export const updateBrandValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid brand id"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Brand name must be between 2 and 100 characters"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage(
      "Description cannot exceed 500 characters"
    ),

  body("website")
    .optional()
    .isURL()
    .withMessage("Invalid website url"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

export const brandIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid brand id"),
];