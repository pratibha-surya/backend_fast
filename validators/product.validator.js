import { body, param } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number")
    .custom((value, { req }) => {
      if (value && Number(value) >= Number(req.body.price)) {
        throw new Error("Discount price must be less than the regular price");
      }
      return true;
    }),

  body("quantity")
    .notEmpty()
    .withMessage("Stock quantity is required")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a positive integer"),

  body("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid Category ID format"),

  body("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid SubCategory ID format"),

  body("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand ID format"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),

  body("attributes")
    .optional()
    .isArray()
    .withMessage("Attributes must be an array"),

  body("attributes.*.attribute")
    .notEmpty()
    .withMessage("Attribute ID is required")
    .isMongoId()
    .withMessage("Invalid Attribute ID format"),

  body("attributes.*.value")
    .notEmpty()
    .withMessage("Attribute value is required")
    .isString()
    .withMessage("Attribute value must be a string")
    .trim(),
];

export const updateProductValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Product ID format"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Product name must be between 2 and 200 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("discountPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount price must be a positive number")
    .custom((value, { req }) => {
      if (value && req.body.price && Number(value) >= Number(req.body.price)) {
        throw new Error("Discount price must be less than the regular price");
      }
      return true;
    }),

  body("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be a positive integer"),

  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category ID format"),

  body("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid SubCategory ID format"),

  body("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand ID format"),

  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),

  body("attributes")
    .optional()
    .isArray()
    .withMessage("Attributes must be an array"),

  body("attributes.*.attribute")
    .notEmpty()
    .withMessage("Attribute ID is required")
    .isMongoId()
    .withMessage("Invalid Attribute ID format"),

  body("attributes.*.value")
    .notEmpty()
    .withMessage("Attribute value is required")
    .isString()
    .withMessage("Attribute value must be a string")
    .trim(),
];

export const productIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Product ID format"),
];
