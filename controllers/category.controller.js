import asyncHandler from "../middleware/asyncHandler.js";
import * as categoryService from "../services/category.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import redisClient from "../config/redis.js";

// Helper to clear keys matching a pattern
const clearCategoryCache = async () => {
  try {
    const keys = await redisClient.keys("categories:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("Redis cache clear error:", err);
  }
};

// Create Category
export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(
    req.body,
    req.file,
    req.user._id
  );

  await clearCategoryCache();

  return res.status(201).json(
    new ApiResponse(
      201,
      "Category created successfully",
      category
    )
  );
});

// Get All Categories
export const getCategories = asyncHandler(async (req, res) => {
  const cacheKey = `categories:query:${JSON.stringify(req.query)}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(
        new ApiResponse(
          200,
          "Categories fetched successfully (cached)",
          JSON.parse(cachedData)
        )
      );
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const categories = await categoryService.getCategories(req.query);

  try {
    await redisClient.set(cacheKey, JSON.stringify(categories), { EX: 600 }); // Cache for 10 mins
  } catch (err) {
    console.error("Redis set error:", err);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "Categories fetched successfully",
      categories
    )
  );
});

// Get Category By Id
export const getCategoryById = asyncHandler(async (req, res) => {
  const cacheKey = `categories:id:${req.params.id}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(
        new ApiResponse(
          200,
          "Category fetched successfully (cached)",
          JSON.parse(cachedData)
        )
      );
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const category = await categoryService.getCategoryById(req.params.id);

  try {
    await redisClient.set(cacheKey, JSON.stringify(category), { EX: 600 }); // Cache for 10 mins
  } catch (err) {
    console.error("Redis set error:", err);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "Category fetched successfully",
      category
    )
  );
});

// Update Category
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body,
    req.file,
    req.user._id
  );

  await clearCategoryCache();
  try {
    await redisClient.del(`categories:id:${req.params.id}`);
  } catch (err) {
    console.error("Redis delete error:", err);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "Category updated successfully",
      category
    )
  );
});

// Delete Category
export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  await clearCategoryCache();
  try {
    await redisClient.del(`categories:id:${req.params.id}`);
  } catch (err) {
    console.error("Redis delete error:", err);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      "Category deleted successfully"
    )
  );
});