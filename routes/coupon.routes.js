import { Router } from "express";

import * as couponController from "../controllers/coupon.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  createCouponValidator,
  couponIdValidator,
  updateCouponValidator,
  applyCouponValidator,
} from "../validators/coupon.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createCouponValidator,
  validateMiddleware,
  couponController.createCoupon
);

/*
|--------------------------------------------------------------------------
| Get All Coupons
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  couponController.getCoupons
);

/*
|--------------------------------------------------------------------------
| Get Coupon By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  couponIdValidator,
  validateMiddleware,
  couponController.getCouponById
);

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateCouponValidator,
  validateMiddleware,
  couponController.updateCoupon
);

/*
|--------------------------------------------------------------------------
| Delete Coupon
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  couponIdValidator,
  validateMiddleware,
  couponController.deleteCoupon
);

/*
|--------------------------------------------------------------------------
| Apply Coupon
|--------------------------------------------------------------------------
*/

router.post(
  "/apply",
  authMiddleware,
  applyCouponValidator,
  validateMiddleware,
  couponController.applyCoupon
);

export default router;