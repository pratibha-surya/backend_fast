import { Router } from "express";

import * as addressController from "../controllers/address.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  createAddressValidator,
  updateAddressValidator,
  addressIdValidator,
} from "../validators/address.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Address
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  createAddressValidator,
  validateMiddleware,
  addressController.createAddress
);

/*
|--------------------------------------------------------------------------
| Get All Addresses
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  addressController.getAddresses
);

/*
|--------------------------------------------------------------------------
| Get Address By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authMiddleware,
  addressIdValidator,
  validateMiddleware,
  addressController.getAddressById
);

/*
|--------------------------------------------------------------------------
| Update Address
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authMiddleware,
  updateAddressValidator,
  validateMiddleware,
  addressController.updateAddress
);

/*
|--------------------------------------------------------------------------
| Set Default Address
|--------------------------------------------------------------------------
*/

router.patch(
  "/default/:id",
  authMiddleware,
  addressIdValidator,
  validateMiddleware,
  addressController.setDefaultAddress
);

/*
|--------------------------------------------------------------------------
| Delete Address
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authMiddleware,
  addressIdValidator,
  validateMiddleware,
  addressController.deleteAddress
);

export default router;