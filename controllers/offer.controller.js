import * as offerService from "../services/offer.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Create Offer
|--------------------------------------------------------------------------
*/

export const createOffer = asyncHandler(async (req, res) => {

  const offer = await offerService.createOffer(
    req.body,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Offer created successfully",
      offer
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get Offers
|--------------------------------------------------------------------------
*/

export const getOffers = asyncHandler(async (req, res) => {

  const offers = await offerService.getOffers();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Offers fetched successfully",
      offers
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get Offer By Id
|--------------------------------------------------------------------------
*/

export const getOfferById = asyncHandler(async (req, res) => {

  const offer = await offerService.getOfferById(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Offer fetched successfully",
      offer
    )
  );

});

/*
|--------------------------------------------------------------------------
| Update Offer
|--------------------------------------------------------------------------
*/

export const updateOffer = asyncHandler(async (req, res) => {

  const offer = await offerService.updateOffer(
    req.params.id,
    req.body,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Offer updated successfully",
      offer
    )
  );

});

/*
|--------------------------------------------------------------------------
| Delete Offer
|--------------------------------------------------------------------------
*/

export const deleteOffer = asyncHandler(async (req, res) => {

  await offerService.deleteOffer(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Offer deleted successfully"
    )
  );

});