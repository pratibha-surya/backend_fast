import * as cartService from "../services/cart.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

export const addToCart = asyncHandler(async (req, res) => {

  const cart = await cartService.addToCart(
    req.user._id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product added to cart successfully",
      cart
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

export const getCart = asyncHandler(async (req, res) => {

  const cart = await cartService.getCart(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Cart fetched successfully",
      cart
    )
  );

});

/*
|--------------------------------------------------------------------------
| Update Cart
|--------------------------------------------------------------------------
*/

export const updateCart = asyncHandler(async (req, res) => {

  const cart = await cartService.updateCart(
    req.user._id,
    req.params.productId,
    req.body.quantity
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Cart updated successfully",
      cart
    )
  );

});

/*
|--------------------------------------------------------------------------
| Remove Cart Item
|--------------------------------------------------------------------------
*/

export const removeCartItem = asyncHandler(async (req, res) => {

  const cart = await cartService.removeCartItem(
    req.user._id,
    req.params.productId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Product removed successfully",
      cart
    )
  );

});

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

export const clearCart = asyncHandler(async (req, res) => {

  const cart = await cartService.clearCart(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Cart cleared successfully",
      cart
    )
  );

});