import asyncHandler from "../middleware/asyncHandler.js";
import * as productService from "../services/product.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import redisClient from "../config/redis.js";

// Helper to clear keys matching a pattern
const clearProductCache = async () => {
  try {
    const keys = await redisClient.keys("products:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("Redis cache clear error:", err);
  }
};

// Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(
    req.body,
    req.files, // Multer upload.array stores files in req.files
    req.user._id
  );

  await clearProductCache();

  return res.status(201).json(
    new ApiResponse(201, "Product created successfully", product)
  );
});

// Get All Products (with Queries)
export const getProducts = asyncHandler(async (req, res) => {
  const cacheKey = `products:query:${JSON.stringify(req.query)}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(
        new ApiResponse(200, "Products fetched successfully (cached)", JSON.parse(cachedData))
      );
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const result = await productService.getProducts(req.query);

  try {
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 600 }); // Cache for 10 mins
  } catch (err) {
    console.error("Redis set error:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, "Products fetched successfully", result)
  );
});

// Get Product By ID
export const getProductById = asyncHandler(async (req, res) => {
  const cacheKey = `products:id:${req.params.id}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(
        new ApiResponse(200, "Product fetched successfully (cached)", JSON.parse(cachedData))
      );
    }
  } catch (err) {
    console.error("Redis get error:", err);
  }

  const product = await productService.getProductById(req.params.id);

  try {
    await redisClient.set(cacheKey, JSON.stringify(product), { EX: 600 }); // Cache for 10 mins
  } catch (err) {
    console.error("Redis set error:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, "Product fetched successfully", product)
  );
});

// Update Product
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body,
    req.files,
    req.user._id
  );

  await clearProductCache();
  try {
    await redisClient.del(`products:id:${req.params.id}`);
  } catch (err) {
    console.error("Redis delete error:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, "Product updated successfully", product)
  );
});

// Delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  await clearProductCache();
  try {
    await redisClient.del(`products:id:${req.params.id}`);
  } catch (err) {
    console.error("Redis delete error:", err);
  }

  return res.status(200).json(
    new ApiResponse(200, "Product deleted successfully")
  );
});
