import { Router } from "express";

import * as wishlistController from "../controllers/wishlist.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  addWishlistValidator,
  removeWishlistValidator,
} from "../validators/wishlist.validator.js";

const router = Router();

router.post(
  "/add",
  authMiddleware,
  addWishlistValidator,
  validateMiddleware,
  wishlistController.addToWishlist
);

router.get(
  "/",
  authMiddleware,
  wishlistController.getWishlist
);

router.delete(
  "/remove/:productId",
  authMiddleware,
  removeWishlistValidator,
  validateMiddleware,
  wishlistController.removeWishlistItem
);

router.delete(
  "/clear",
  authMiddleware,
  wishlistController.clearWishlist
);

export default router;