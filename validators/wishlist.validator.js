import { body, param } from "express-validator";

export const addWishlistValidator = [

  body("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),

];

export const removeWishlistValidator = [

  param("productId")
    .isMongoId()
    .withMessage("Invalid product id"),

];