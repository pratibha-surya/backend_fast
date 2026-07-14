import { Router } from "express";

import * as cartController from "../controllers/cart.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  addToCartValidator,
  updateCartValidator,
  removeCartItemValidator,
} from "../validators/cart.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

router.post(
  "/add",
  authMiddleware,
  addToCartValidator,
  validateMiddleware,
  cartController.addToCart
);

/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  cartController.getCart
);

/*
|--------------------------------------------------------------------------
| Update Quantity
|--------------------------------------------------------------------------
*/

router.patch(
  "/update/:productId",
  authMiddleware,
  updateCartValidator,
  validateMiddleware,
  cartController.updateCart
);

/*
|--------------------------------------------------------------------------
| Remove Product
|--------------------------------------------------------------------------
*/

router.delete(
  "/remove/:productId",
  authMiddleware,
  removeCartItemValidator,
  validateMiddleware,
  cartController.removeCartItem
);

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

router.delete(
  "/clear",
  authMiddleware,
  cartController.clearCart
);

export default router;