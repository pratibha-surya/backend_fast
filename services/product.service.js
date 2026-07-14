import slugify from "slugify";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import Brand from "../models/Brand.js";
import Attribute from "../models/attribute.js";
import ApiError from "../utils/ApiError.js";
import uploadFile from "../utils/uploadImage.js";
import { calculateOfferPrice } from "./offer.service.js";

// Create Product
export const createProduct = async (body, files, userId) => {
  const { name, description, price, discountPrice, quantity, category, subCategory, brand, status, attributes } = body;

  // Validate category exists
  const categoryExists = await Category.findOne({ _id: category, isDeleted: false });
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  const targetSubCategory = subCategory !== undefined ? subCategory : (body.subcategory || body.sub_category);

  // Validate subcategory if provided
  if (targetSubCategory) {
    const subCategoryExists = await SubCategory.findOne({ _id: targetSubCategory, isDeleted: false });
    if (!subCategoryExists) {
      throw new ApiError(404, "SubCategory not found");
    }
  }

  // Validate brand if provided
  if (brand) {
    const brandExists = await Brand.findOne({ _id: brand, isDeleted: false });
    if (!brandExists) {
      throw new ApiError(404, "Brand not found");
    }
  }

  // Parse and validate attributes if provided
  let parsedAttributes = [];
  const rawAttributes = attributes !== undefined ? attributes : body.attribute;
  if (rawAttributes) {
    try {
      parsedAttributes = typeof rawAttributes === "string" ? JSON.parse(rawAttributes) : rawAttributes;
    } catch (e) {
      try {
        parsedAttributes = typeof rawAttributes === "string" ? JSON.parse(rawAttributes.replace(/'/g, '"')) : rawAttributes;
      } catch (err) {
        throw new ApiError(400, "Invalid format for attributes");
      }
    }

    if (parsedAttributes && typeof parsedAttributes === "object" && !Array.isArray(parsedAttributes)) {
      parsedAttributes = [parsedAttributes];
    }

    if (!Array.isArray(parsedAttributes)) {
      throw new ApiError(400, "Attributes must be an array");
    }

    for (const attr of parsedAttributes) {
      if (!attr.attribute || !attr.value) {
        throw new ApiError(400, "Each attribute must have an attribute ID and a value");
      }
      const attributeDoc = await Attribute.findOne({ _id: attr.attribute, isDeleted: false });
      if (!attributeDoc) {
        throw new ApiError(404, `Attribute with ID ${attr.attribute} not found`);
      }
      if (!attributeDoc.values.includes(attr.value)) {
        throw new ApiError(400, `Value "${attr.value}" is not valid for attribute "${attributeDoc.name}"`);
      }
    }
  }

  // Upload images
  const images = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploaded = await uploadFile(file, "products");
      images.push({
        fileId: uploaded.fileId,
        url: uploaded.url,
      });
    }
  }

  const product = await Product.create({
    name,
    slug: slugify(name, { lower: true, strict: true, trim: true }),
    description,
    price,
    discountPrice: discountPrice || 0,
    quantity,
    category,
    subCategory: targetSubCategory,
    brand,
    images,
    attributes: parsedAttributes,
    status: status || "active",
    createdBy: userId,
  });

  return product;
};

// Get Products (with Search, Filter, Pagination, Sorting)
export const getProducts = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "-createdAt",
    category,
    brand,
    minPrice,
    maxPrice,
    status,
  } = query;

  const filter = { isDeleted: false };

  // Search filter
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Brand filter
  if (brand) {
    filter.brand = brand;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  // Status filter
  if (status) {
    filter.status = status;
  }

  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (parsedPage - 1) * parsedLimit;

  const products = await Product.find(filter)
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .populate("brand", "name logo")
    .populate("attributes.attribute", "name slug")
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role")
    .sort(sort)
    .skip(skip)
    .limit(parsedLimit);

  const productsWithOffers = await Promise.all(
    products.map(async (p) => {
      const pObj = p.toObject();
      pObj.offerDetails = await calculateOfferPrice(p);
      return pObj;
    })
  );

  const total = await Product.countDocuments(filter);

  return {
    products: productsWithOffers,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

// Get Product By Id
export const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate("category", "name slug")
    .populate("subCategory", "name slug")
    .populate("brand", "name logo")
    .populate("attributes.attribute", "name slug")
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const productObj = product.toObject();
  productObj.offerDetails = await calculateOfferPrice(product);

  return productObj;
};

// Update Product
export const updateProduct = async (id, body, files, userId) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const { name, description, price, discountPrice, quantity, category, subCategory, brand, status, attributes } = body;

  if (category) {
    const categoryExists = await Category.findOne({ _id: category, isDeleted: false });
    if (!categoryExists) {
      throw new ApiError(404, "Category not found");
    }
    product.category = category;
  }

  const targetSubCategory = subCategory !== undefined ? subCategory : (body.subcategory || body.sub_category);

  if (targetSubCategory) {
    const subCategoryExists = await SubCategory.findOne({ _id: targetSubCategory, isDeleted: false });
    if (!subCategoryExists) {
      throw new ApiError(404, "SubCategory not found");
    }
    product.subCategory = targetSubCategory;
  }

  if (brand) {
    const brandExists = await Brand.findOne({ _id: brand, isDeleted: false });
    if (!brandExists) {
      throw new ApiError(404, "Brand not found");
    }
    product.brand = brand;
  }

  if (name) {
    product.name = name;
    product.slug = slugify(name, { lower: true, strict: true, trim: true });
  }

  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (discountPrice !== undefined) product.discountPrice = discountPrice;
  if (quantity !== undefined) product.quantity = quantity;
  if (status) product.status = status;

  const rawAttributes = attributes !== undefined ? attributes : body.attribute;
  if (rawAttributes !== undefined) {
    let parsedAttributes = [];
    if (rawAttributes) {
      try {
        parsedAttributes = typeof rawAttributes === "string" ? JSON.parse(rawAttributes) : rawAttributes;
      } catch (e) {
        try {
          parsedAttributes = typeof rawAttributes === "string" ? JSON.parse(rawAttributes.replace(/'/g, '"')) : rawAttributes;
        } catch (err) {
          throw new ApiError(400, "Invalid format for attributes");
        }
      }

      if (parsedAttributes && typeof parsedAttributes === "object" && !Array.isArray(parsedAttributes)) {
        parsedAttributes = [parsedAttributes];
      }

      if (!Array.isArray(parsedAttributes)) {
        throw new ApiError(400, "Attributes must be an array");
      }

      for (const attr of parsedAttributes) {
        if (!attr.attribute || !attr.value) {
          throw new ApiError(400, "Each attribute must have an attribute ID and a value");
        }
        const attributeDoc = await Attribute.findOne({ _id: attr.attribute, isDeleted: false });
        if (!attributeDoc) {
          throw new ApiError(404, `Attribute with ID ${attr.attribute} not found`);
        }
        if (!attributeDoc.values.includes(attr.value)) {
          throw new ApiError(400, `Value "${attr.value}" is not valid for attribute "${attributeDoc.name}"`);
        }
      }
    }
    product.attributes = parsedAttributes;
  }

  // Handle uploaded new images
  if (files && files.length > 0) {
    const newImages = [];
    for (const file of files) {
      const uploaded = await uploadFile(file, "products");
      newImages.push({
        fileId: uploaded.fileId,
        url: uploaded.url,
      });
    }
    // Append new images to existing ones
    product.images = [...product.images, ...newImages];
  }

  product.updatedBy = userId;
  await product.save();

  return product;
};

// Soft Delete Product
export const deleteProduct = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isDeleted = true;
  await product.save();

  return true;
};
