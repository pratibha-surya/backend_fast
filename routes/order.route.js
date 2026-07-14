import { Router } from "express";

import * as orderController from "../controllers/order.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  createOrderValidator,
  updateOrderStatusValidator,
  cancelOrderValidator,
  orderIdValidator,
} from "../validators/order.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  createOrderValidator,
  validateMiddleware,
  orderController.createOrder
);

router.get(
  "/",
  authMiddleware,
  orderController.getOrders
);

router.get(
  "/:id",
  authMiddleware,
  orderIdValidator,
  validateMiddleware,
  orderController.getOrderById
);

router.patch(
  "/cancel/:id",
  authMiddleware,
  cancelOrderValidator,
  validateMiddleware,
  orderController.cancelOrder
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.patch(
  "/status/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateOrderStatusValidator,
  validateMiddleware,
  orderController.updateOrderStatus
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  orderIdValidator,
  validateMiddleware,
  orderController.deleteOrder
);

export default router;