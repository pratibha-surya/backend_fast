import * as couponService from "../services/coupon.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

export const createCoupon = asyncHandler(async (req, res) => {

  const coupon = await couponService.createCoupon(
    req.body,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Coupon created successfully",
      coupon
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get All Coupons
|--------------------------------------------------------------------------
*/

export const getCoupons = asyncHandler(async (req, res) => {

  const coupons = await couponService.getCoupons(
    req.query
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Coupons fetched successfully",
      coupons
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get Coupon By Id
|--------------------------------------------------------------------------
*/

export const getCouponById = asyncHandler(async (req, res) => {

  const coupon = await couponService.getCouponById(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Coupon fetched successfully",
      coupon
    )
  );

});

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

export const updateCoupon = asyncHandler(async (req, res) => {

  const coupon = await couponService.updateCoupon(
    req.params.id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Coupon updated successfully",
      coupon
    )
  );

});

/*
|--------------------------------------------------------------------------
| Delete Coupon
|--------------------------------------------------------------------------
*/

export const deleteCoupon = asyncHandler(async (req, res) => {

  await couponService.deleteCoupon(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Coupon deleted successfully"
    )
  );

});

/*
|--------------------------------------------------------------------------
| Apply Coupon
|--------------------------------------------------------------------------
*/

export const applyCoupon = asyncHandler(async (req, res) => {

  const result = await couponService.applyCoupon(
    req.body.code,
    req.cart
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Coupon applied successfully",
      result
    )
  );

});