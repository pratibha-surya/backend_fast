import { body, param } from "express-validator";

// Create Attribute
export const createAttributeValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Attribute name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Attribute name must be between 2 and 100 characters"
    ),

  body("values")
    .isArray({ min: 1 })
    .withMessage("Values must be an array"),

  body("values.*")
    .trim()
    .notEmpty()
    .withMessage("Attribute value cannot be empty"),
];

// Update Attribute
export const updateAttributeValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid attribute id"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Attribute name must be between 2 and 100 characters"
    ),

  body("values")
    .optional()
    .isArray()
    .withMessage("Values must be an array"),

  body("values.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Attribute value cannot be empty"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

// Get/Delete By Id
export const attributeIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid attribute id"),
];