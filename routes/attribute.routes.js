import { Router } from "express";

import * as attributeController from "../controllers/attribute.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";
import { attributeIdValidator, createAttributeValidator, updateAttributeValidator } from "../validators/attribute.validator.js";
import roleMiddleware from "../middleware/role.middleware.js";



const router = Router();

/*
|--------------------------------------------------------------------------
| Create Attribute
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createAttributeValidator,
  validateMiddleware,
  attributeController.createAttribute
);

/*
|--------------------------------------------------------------------------
| Get All Attributes
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  attributeController.getAttributes
);

/*
|--------------------------------------------------------------------------
| Get Attribute By Id
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  attributeIdValidator,
  validateMiddleware,
  attributeController.getAttributeById
);

/*
|--------------------------------------------------------------------------
| Update Attribute
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateAttributeValidator,
  validateMiddleware,
  attributeController.updateAttribute
);

/*
|--------------------------------------------------------------------------
| Delete Attribute
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  attributeIdValidator,
  validateMiddleware,
  attributeController.deleteAttribute
);

export default router;