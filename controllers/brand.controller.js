import * as brandService from "../services/brand.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

// Create Brand
export const createBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.createBrand(
    req.body,
    req.file,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Brand created successfully",
      brand
    )
  );
});

// Get All Brands
export const getBrands = asyncHandler(async (req, res) => {
  const brands = await brandService.getBrands(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Brands fetched successfully",
      brands
    )
  );
});

// Get Brand By Id
export const getBrandById = asyncHandler(async (req, res) => {
  const brand = await brandService.getBrandById(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Brand fetched successfully",
      brand
    )
  );
});

// Update Brand
export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await brandService.updateBrand(
    req.params.id,
    req.body,
    req.file,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Brand updated successfully",
      brand
    )
  );
});

// Delete Brand
export const deleteBrand = asyncHandler(async (req, res) => {
  await brandService.deleteBrand(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Brand deleted successfully"
    )
  );
});