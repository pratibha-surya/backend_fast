import { Router } from "express";

import * as subCategoryController from "../controllers/subcategory.controller.js";





import upload from "../middleware/upload.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { createSubCategoryValidator, subCategoryIdValidator, updateSubCategoryValidator } from "../validators/subcategory.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create SubCategory
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  createSubCategoryValidator,
  validateMiddleware,
  subCategoryController.createSubCategory
);

/*
|--------------------------------------------------------------------------
| Get All SubCategories
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  subCategoryController.getSubCategories
);

/*
|--------------------------------------------------------------------------
| Get SubCategory By Id
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  subCategoryIdValidator,
  validateMiddleware,
  subCategoryController.getSubCategoryById
);

/*
|--------------------------------------------------------------------------
| Update SubCategory
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  updateSubCategoryValidator,
  validateMiddleware,
  subCategoryController.updateSubCategory
);

/*
|--------------------------------------------------------------------------
| Delete SubCategory
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  subCategoryIdValidator,
  validateMiddleware,
  subCategoryController.deleteSubCategory
);

export default router;