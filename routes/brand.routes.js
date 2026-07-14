import { Router } from "express";

import * as brandController from "../controllers/brand.controller.js";





import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import { brandIdValidator, createBrandValidator, updateBrandValidator } from "../validators/brand.validator.js";
import upload from "../middleware/upload.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Brand
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("logo"),
  createBrandValidator,
  validateMiddleware,
  brandController.createBrand
);

/*
|--------------------------------------------------------------------------
| Get All Brands
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  brandController.getBrands
);

/*
|--------------------------------------------------------------------------
| Get Brand By Id
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  brandIdValidator,
  validateMiddleware,
  brandController.getBrandById
);

/*
|--------------------------------------------------------------------------
| Update Brand
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("logo"),
  updateBrandValidator,
  validateMiddleware,
  brandController.updateBrand
);

/*
|--------------------------------------------------------------------------
| Delete Brand
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  brandIdValidator,
  validateMiddleware,
  brandController.deleteBrand
);

export default router;