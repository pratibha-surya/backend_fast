import { Router } from "express";

import * as paymentController from "../controllers/payment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  createPaymentValidator,
  verifyPaymentValidator,
} from "../validators/payment.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/

router.post(
  "/create-order",
  authMiddleware,
  createPaymentValidator,
  validateMiddleware,
  paymentController.createPayment
);

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

router.post(
  "/verify",
  authMiddleware,
  verifyPaymentValidator,
  validateMiddleware,
  paymentController.verifyPayment
);

/*
|--------------------------------------------------------------------------
| Webhook
|--------------------------------------------------------------------------
*/

router.post(
  "/webhook",
  paymentController.webhook
);

export default router;