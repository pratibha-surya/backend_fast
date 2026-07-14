import * as attributeService from "../services/attribute.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Create Attribute
|--------------------------------------------------------------------------
*/
export const createAttribute = asyncHandler(async (req, res) => {
  const attribute =
    await attributeService.createAttribute(
      req.body,
      req.user._id
    );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Attribute created successfully",
      attribute
    )
  );
});

/*
|--------------------------------------------------------------------------
| Get All Attributes
|--------------------------------------------------------------------------
*/
export const getAttributes = asyncHandler(async (req, res) => {
  const attributes =
    await attributeService.getAttributes(
      req.query
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Attributes fetched successfully",
      attributes
    )
  );
});

/*
|--------------------------------------------------------------------------
| Get Attribute By Id
|--------------------------------------------------------------------------
*/
export const getAttributeById = asyncHandler(async (req, res) => {
  const attribute =
    await attributeService.getAttributeById(
      req.params.id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Attribute fetched successfully",
      attribute
    )
  );
});

/*
|--------------------------------------------------------------------------
| Update Attribute
|--------------------------------------------------------------------------
*/
export const updateAttribute = asyncHandler(async (req, res) => {
  const attribute =
    await attributeService.updateAttribute(
      req.params.id,
      req.body,
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Attribute updated successfully",
      attribute
    )
  );
});

/*
|--------------------------------------------------------------------------
| Delete Attribute
|--------------------------------------------------------------------------
*/
export const deleteAttribute = asyncHandler(async (req, res) => {
  await attributeService.deleteAttribute(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Attribute deleted successfully"
    )
  );
});