import { body, param } from "express-validator";

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
*/

export const createReviewValidator = [

  body("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 100 }),

  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required"),

];

/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

export const updateReviewValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid review id"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 }),

  body("title")
    .optional()
    .trim(),

  body("comment")
    .optional()
    .trim(),

];

/*
|--------------------------------------------------------------------------
| Review Id
|--------------------------------------------------------------------------
*/

export const reviewIdValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid review id"),

];