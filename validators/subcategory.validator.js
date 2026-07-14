import { body, param } from "express-validator";

// Create SubCategory
export const createSubCategoryValidator = [
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid category id"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Sub category name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Sub category name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

// Update SubCategory
export const updateSubCategoryValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid sub category id"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Sub category name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

// Get/Delete By Id
export const subCategoryIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid sub category id"),
];