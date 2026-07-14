import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import * as subCategoryService from "./../services/subcategory.service.js";



// Create SubCategory
export const createSubCategory = asyncHandler(async (req, res) => {
  const subCategory =
    await subCategoryService.createSubCategory(
      req.body,
      req.file,
      req.user._id
    );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Sub category created successfully",
      subCategory
    )
  );
});

// Get All SubCategories
export const getSubCategories = asyncHandler(async (req, res) => {
  const subCategories =
    await subCategoryService.getSubCategories(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Sub categories fetched successfully",
      subCategories
    )
  );
});

// Get SubCategory By Id
export const getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory =
    await subCategoryService.getSubCategoryById(
      req.params.id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Sub category fetched successfully",
      subCategory
    )
  );
});

// Update SubCategory
export const updateSubCategory = asyncHandler(async (req, res) => {
  const subCategory =
    await subCategoryService.updateSubCategory(
      req.params.id,
      req.body,
      req.file,
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Sub category updated successfully",
      subCategory
    )
  );
});

// Delete SubCategory
export const deleteSubCategory = asyncHandler(async (req, res) => {
  await subCategoryService.deleteSubCategory(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Sub category deleted successfully"
    )
  );
});