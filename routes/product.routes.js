import { Router } from "express";
import {
  createProductValidator,
  updateProductValidator,
  productIdValidator,
} from "../validators/product.validator.js";
import * as productController from "../controllers/product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

const parseProductAttributesMiddleware = (req, res, next) => {
  // Normalize subCategory
  if (req.body.subcategory !== undefined && req.body.subCategory === undefined) {
    req.body.subCategory = req.body.subcategory;
  }
  if (req.body.sub_category !== undefined && req.body.subCategory === undefined) {
    req.body.subCategory = req.body.sub_category;
  }

  let value = req.body.attributes !== undefined ? req.body.attributes : req.body.attribute;
  if (value) {
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (e) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch (err) {
          // Keep it as string, validator will catch it
        }
      }
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      value = [value];
    }
    req.body.attributes = value;
  }
  next();
};

// Get all products
router.get("/", productController.getProducts);

// Get product by id
router.get(
  "/:id",
  productIdValidator,
  validateMiddleware,
  productController.getProductById
);

// Create product (Admin only, up to 5 images)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  upload.array("images", 5),
  parseProductAttributesMiddleware,
  createProductValidator,
  validateMiddleware,
  productController.createProduct
);

// Update product (Admin only, up to 5 images)
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  upload.array("images", 5),
  parseProductAttributesMiddleware,
  updateProductValidator,
  validateMiddleware,
  productController.updateProduct
);

// Delete product (Admin only)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  productIdValidator,
  validateMiddleware,
  productController.deleteProduct
);

export default router;
