import { Router } from "express";

import * as reviewController from "../controllers/review.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  createReviewValidator,
  updateReviewValidator,
  reviewIdValidator,
} from "../validators/review.validator.js";
import upload from "../middleware/upload.middleware.js";



const router = Router();

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  createReviewValidator,
  validateMiddleware,
  reviewController.createReview
);

/*
|--------------------------------------------------------------------------
| Get Product Reviews
|--------------------------------------------------------------------------
*/

router.get(
  "/product/:productId",
  reviewController.getProductReviews
);

/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  updateReviewValidator,
  validateMiddleware,
  reviewController.updateReview
);

/*
|--------------------------------------------------------------------------
| Delete Review
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authMiddleware,
  reviewIdValidator,
  validateMiddleware,
  reviewController.deleteReview
);

export default router;