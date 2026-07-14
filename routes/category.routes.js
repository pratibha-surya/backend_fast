import { Router } from "express";
import {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
} from "../validators/category.validator.js";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../controllers/category.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  createCategoryValidator,
  validateMiddleware,
  createCategory
);

/*
|--------------------------------------------------------------------------
| Get All Categories
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  getCategories
);

/*
|--------------------------------------------------------------------------
| Get Category By Id
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  categoryIdValidator,
  validateMiddleware,
 getCategoryById
);

/*
|--------------------------------------------------------------------------
| Update Category
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.single("image"),
  updateCategoryValidator,
  validateMiddleware,
 updateCategory
);

/*
|--------------------------------------------------------------------------
| Delete Category
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  categoryIdValidator,
  validateMiddleware,
 deleteCategory
);

export default router;