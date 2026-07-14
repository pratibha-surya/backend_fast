import { body, param } from "express-validator";

/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

export const addToCartValidator = [

  body("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid product id"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0"),

];

/*
|--------------------------------------------------------------------------
| Update Cart Quantity
|--------------------------------------------------------------------------
*/

export const updateCartValidator = [

  param("productId")
    .isMongoId()
    .withMessage("Invalid product id"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0"),

];

/*
|--------------------------------------------------------------------------
| Remove Product
|--------------------------------------------------------------------------
*/

export const removeCartItemValidator = [

  param("productId")
    .isMongoId()
    .withMessage("Invalid product id"),

];

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

export const clearCartValidator = [];