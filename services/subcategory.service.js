import slugify from "slugify";

import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import ApiError from "../utils/ApiError.js";
import uploadFile from "../utils/uploadImage.js";


// import deleteFile from "../../utils/deleteFile.js";

// Create SubCategory
export const createSubCategory = async (
  body,
  file,
  userId
) => {
  const { category, name, description } = body;

  // Check Category
  const categoryExists = await Category.findOne({
    _id: category,
    isDeleted: false,
  });

  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  // Duplicate Check
  const exists = await SubCategory.findOne({
    category,
    name,
    isDeleted: false,
  });

  if (exists) {
    throw new ApiError(
      409,
      "Sub category already exists"
    );
  }

  let image = {};

  if (file) {
    const uploaded = await uploadFile(
      file,
      "subcategories"
    );

    image = {
      fileId: uploaded.fileId,
      url: uploaded.url,
    };
  }

  const subCategory =
    await SubCategory.create({
      category,

      name,

      slug: slugify(name, {
        lower: true,
        strict: true,
      }),

      description,

      image,

      createdBy: userId,
    });

  return subCategory;
};


// Get All
export const getSubCategories = async (
  query
) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    category,
    sort = "-createdAt",
  } = query;

  const filter = {
    isDeleted: false,
  };

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  const skip =
    (Number(page) - 1) *
    Number(limit);

  const subCategories =
    await SubCategory.find(filter)
      .populate(
        "category",
        "name slug"
      )
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

  const total =
    await SubCategory.countDocuments(
      filter
    );

  return {
    subCategories,

    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};


// Get By Id
export const getSubCategoryById = async (
  id
) => {
  const subCategory =
    await SubCategory.findOne({
      _id: id,
      isDeleted: false,
    }).populate(
      "category",
      "name slug"
    );

  if (!subCategory) {
    throw new ApiError(
      404,
      "Sub category not found"
    );
  }

  return subCategory;
};


// Update
export const updateSubCategory =
  async (
    id,
    body,
    file,
    userId
  ) => {

    const subCategory =
      await SubCategory.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!subCategory) {
      throw new ApiError(
        404,
        "Sub category not found"
      );
    }

    if (body.category) {

      const category =
        await Category.findOne({
          _id: body.category,
          isDeleted: false,
        });

      if (!category) {
        throw new ApiError(
          404,
          "Category not found"
        );
      }

      subCategory.category =
        body.category;
    }

    if (body.name) {

      const exists =
        await SubCategory.findOne({
          category:
            body.category ||
            subCategory.category,

          name: body.name,

          _id: {
            $ne: id,
          },
        });

      if (exists) {
        throw new ApiError(
          409,
          "Sub category already exists"
        );
      }

      subCategory.name =
        body.name;

      subCategory.slug =
        slugify(body.name, {
          lower: true,
          strict: true,
        });
    }

    if (body.description) {
      subCategory.description =
        body.description;
    }

    if (body.status) {
      subCategory.status =
        body.status;
    }

    if (file) {

      // Optional
      // await deleteFile(subCategory.image.fileId)

      const uploaded =
        await uploadFile(
          file,
          "subcategories"
        );

      subCategory.image = {
        fileId:
          uploaded.fileId,
        url:
          uploaded.url,
      };
    }

    subCategory.updatedBy =
      userId;

    await subCategory.save();

    return subCategory;
  };


// Delete
export const deleteSubCategory =
  async (id) => {

    const subCategory =
      await SubCategory.findOne({
        _id: id,
        isDeleted: false,
      });

    if (!subCategory) {
      throw new ApiError(
        404,
        "Sub category not found"
      );
    }

    subCategory.isDeleted = true;

    await subCategory.save();

    return true;
  };