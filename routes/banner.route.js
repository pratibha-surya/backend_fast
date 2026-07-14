import { Router } from "express";

import * as bannerController from "../controllers/banner.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";



import {
  createBannerValidator,
  updateBannerValidator,
  bannerIdValidator,
} from "../validators/banner.validator.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Banner
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  createBannerValidator,
  validateMiddleware,
  bannerController.createBanner
);

/*
|--------------------------------------------------------------------------
| Get Active Banners (Public)
|--------------------------------------------------------------------------
*/

router.get(
  "/active",
  bannerController.getActiveBanners
);

/*
|--------------------------------------------------------------------------
| Get All Banners (Admin)
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  bannerController.getBanners
);

/*
|--------------------------------------------------------------------------
| Get Banner By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  bannerIdValidator,
  validateMiddleware,
  bannerController.getBannerById
);

/*
|--------------------------------------------------------------------------
| Update Banner
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  updateBannerValidator,
  validateMiddleware,
  bannerController.updateBanner
);

/*
|--------------------------------------------------------------------------
| Delete Banner
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  bannerIdValidator,
  validateMiddleware,
  bannerController.deleteBanner
);

export default router;