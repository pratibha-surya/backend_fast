import { Router } from "express";

import * as offerController from "../controllers/offer.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {

  createOfferValidator,

  updateOfferValidator,

  offerIdValidator,

} from "../validators/offer.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Offer
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createOfferValidator,
  validateMiddleware,
  offerController.createOffer
);

/*
|--------------------------------------------------------------------------
| Get All Offers
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  offerController.getOffers
);

/*
|--------------------------------------------------------------------------
| Get Offer By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  offerIdValidator,
  validateMiddleware,
  offerController.getOfferById
);

/*
|--------------------------------------------------------------------------
| Update Offer
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateOfferValidator,
  validateMiddleware,
  offerController.updateOffer
);

/*
|--------------------------------------------------------------------------
| Delete Offer
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  offerIdValidator,
  validateMiddleware,
  offerController.deleteOffer
);

export default router;