import * as addressService from "../services/address.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Create Address
|--------------------------------------------------------------------------
*/

export const createAddress = asyncHandler(async (req, res) => {

  const address = await addressService.createAddress(
    req.user._id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Address created successfully",
      address
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get All Addresses
|--------------------------------------------------------------------------
*/

export const getAddresses = asyncHandler(async (req, res) => {

  const addresses = await addressService.getAddresses(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Addresses fetched successfully",
      addresses
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get Address By Id
|--------------------------------------------------------------------------
*/

export const getAddressById = asyncHandler(async (req, res) => {

  const address = await addressService.getAddressById(
    req.user._id,
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Address fetched successfully",
      address
    )
  );

});

/*
|--------------------------------------------------------------------------
| Update Address
|--------------------------------------------------------------------------
*/

export const updateAddress = asyncHandler(async (req, res) => {

  const address = await addressService.updateAddress(
    req.user._id,
    req.params.id,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Address updated successfully",
      address
    )
  );

});

/*
|--------------------------------------------------------------------------
| Set Default Address
|--------------------------------------------------------------------------
*/

export const setDefaultAddress = asyncHandler(async (req, res) => {

  const address = await addressService.setDefaultAddress(
    req.user._id,
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Default address updated successfully",
      address
    )
  );

});

/*
|--------------------------------------------------------------------------
| Delete Address
|--------------------------------------------------------------------------
*/

export const deleteAddress = asyncHandler(async (req, res) => {

  await addressService.deleteAddress(
    req.user._id,
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Address deleted successfully"
    )
  );

});