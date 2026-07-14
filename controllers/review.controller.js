import * as reviewService from "../services/review.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Create Review
|--------------------------------------------------------------------------
*/

export const createReview = asyncHandler(async (req, res) => {

  const review = await reviewService.createReview(
    req.user._id,
    req.body,
    req.files
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Review added successfully",
      review
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get Product Reviews
|--------------------------------------------------------------------------
*/

export const getProductReviews = asyncHandler(async (req, res) => {

  const reviews = await reviewService.getProductReviews(
    req.params.productId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Reviews fetched successfully",
      reviews
    )
  );

});

/*
|--------------------------------------------------------------------------
| Update Review
|--------------------------------------------------------------------------
*/

export const updateReview = asyncHandler(async (req, res) => {

  const review = await reviewService.updateReview(
    req.user._id,
    req.params.id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Review updated successfully",
      review
    )
  );

});

/*
|--------------------------------------------------------------------------
| Delete Review
|--------------------------------------------------------------------------
*/

export const deleteReview = asyncHandler(async (req, res) => {

  await reviewService.deleteReview(
    req.user._id,
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Review deleted successfully"
    )
  );

});