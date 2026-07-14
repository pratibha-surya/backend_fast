import slugify from "slugify";

import Category from "../models/Category.js";

import ApiError from "../utils/ApiError.js";
import uploadFile from "../utils/uploadImage.js"


// Create Category
export const createCategory = async (
  body,
  file,
  userId
) => {
  const { name, description } = body;

  const exists = await Category.findOne({
    name,
    isDeleted: false,
  });

  if (exists) {
    throw new ApiError(409, "Category already exists");
  }

  let image = {};

  if (file) {
    const uploaded = await uploadFile(
      file,
      "categories"
    );

    image = {
      fileId: uploaded.fileId,
      url: uploaded.url,
    };
  }

  const category = await Category.create({
    name,
    slug: slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    }),
    description,
    image,
    createdBy: userId,
  });

  return category;
};


// Get Categories
export const getCategories = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "-createdAt",
    status,
  } = query;

  const filter = {
    isDeleted: false,
  };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (status) {
    filter.status = status;
  }

  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedLimit = Number(limit) > 0 ? Number(limit) : 10;
  const skip = (parsedPage - 1) * parsedLimit;

  const categories = await Category.find(filter)
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role")
    .sort(sort)
    .skip(skip)
    .limit(parsedLimit);

  const total = await Category.countDocuments(filter);

  return {
    categories,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};


// Get Category By Id
export const getCategoryById = async (id) => {
  const category = await Category.findOne({
    _id: id,
    isDeleted: false,
  })
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role");

  if (!category) {
    throw new ApiError(
      404,
      "Category not found"
    );
  }

  return category;
};


// Update Category
export const updateCategory = async (
  id,
  body,
  file,
  userId
) => {
  const category =
    await Category.findOne({
      _id: id,
      isDeleted: false,
    });

  if (!category) {
    throw new ApiError(
      404,
      "Category not found"
    );
  }

  if (body.name) {
    const exists =
      await Category.findOne({
        name: body.name,
        _id: {
          $ne: id,
        },
      });

    if (exists) {
      throw new ApiError(
        409,
        "Category already exists"
      );
    }

    category.name = body.name;

    category.slug = slugify(
      body.name,
      {
        lower: true,
        strict: true,
      }
    );
  }

  if (body.description) {
    category.description =
      body.description;
  }

  if (body.status) {
    category.status =
      body.status;
  }

  if (file) {

    // Optional
    // if(category.image.fileId){
    // await deleteFile(category.image.fileId)
    // }

    const uploaded =
      await uploadFile(
        file,
        "categories"
      );

    category.image = {
      fileId: uploaded.fileId,
      url: uploaded.url,
    };
  }

  category.updatedBy = userId;

  await category.save();

  return category;
};


// Soft Delete
export const deleteCategory = async (
  id
) => {
  const category =
    await Category.findOne({
      _id: id,
      isDeleted: false,
    });

  if (!category) {
    throw new ApiError(
      404,
      "Category not found"
    );
  }

  category.isDeleted = true;

  await category.save();

  return true;
};