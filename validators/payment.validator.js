import { body } from "express-validator";

/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/

export const createPaymentValidator = [

  body("orderId")
    .notEmpty()
    .withMessage("Order id is required")
    .isMongoId()
    .withMessage("Invalid order id"),

];

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

export const verifyPaymentValidator = [

  body("razorpay_order_id")
    .notEmpty()
    .withMessage("Razorpay order id is required"),

  body("razorpay_payment_id")
    .notEmpty()
    .withMessage("Razorpay payment id is required"),

  body("razorpay_signature")
    .notEmpty()
    .withMessage("Razorpay signature is required"),

];