import { body, param } from "express-validator";

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

export const createOrderValidator = [

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isMongoId()
    .withMessage("Invalid address id"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn([
      "COD",
      "RAZORPAY",
      "STRIPE",
    ])
    .withMessage("Invalid payment method"),

  body("coupon")
    .optional()
    .isMongoId()
    .withMessage("Invalid coupon id"),

];

export const updateOrderStatusValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid order id"),

  body("orderStatus")
    .notEmpty()
    .withMessage("Order status is required")
    .isIn([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ])
    .withMessage("Invalid order status"),

];

export const cancelOrderValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid order id"),

];
export const orderIdValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid order id"),

];