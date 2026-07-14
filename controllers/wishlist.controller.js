import * as wishlistService from "../services/wishlist.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const addToWishlist = asyncHandler(async (req, res) => {

  const wishlist = await wishlistService.addToWishlist(
    req.user._id,
    req.body.product
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product added to wishlist",
      wishlist
    )
  );

});

export const getWishlist = asyncHandler(async (req, res) => {

  const wishlist = await wishlistService.getWishlist(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Wishlist fetched successfully",
      wishlist
    )
  );

});

export const removeWishlistItem = asyncHandler(async (req, res) => {

  const wishlist = await wishlistService.removeWishlistItem(
    req.user._id,
    req.params.productId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product removed from wishlist",
      wishlist
    )
  );

});

export const clearWishlist = asyncHandler(async (req, res) => {

  const wishlist = await wishlistService.clearWishlist(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Wishlist cleared successfully",
      wishlist
    )
  );

});