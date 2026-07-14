import slugify from "slugify";

import Brand from "../models/Brand.js";

import ApiError from "../utils/ApiError.js";

import uploadFile from "../utils/uploadImage.js";
// import deleteFile from "../../utils/deleteFile.js";

// Create Brand
export const createBrand = async (
  body,
  file,
  userId
) => {
  const { name, description, website } = body;

  const exists = await Brand.findOne({
    name,
    isDeleted: false,
  });

  if (exists) {
    throw new ApiError(
      409,
      "Brand already exists"
    );
  }

  let logo = {};

  if (file) {
    const uploaded = await uploadFile(
      file,
      "brands"
    );

    logo = {
      fileId: uploaded.fileId,
      url: uploaded.url,
    };
  }

  const brand = await Brand.create({
    name,

    slug: slugify(name, {
      lower: true,
      strict: true,
    }),

    description,

    website,

    logo,

    createdBy: userId,
  });

  return brand;
};

// Get All Brands
export const getBrands = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
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

  const skip =
    (Number(page) - 1) *
    Number(limit);

  const brands = await Brand.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total =
    await Brand.countDocuments(filter);

  return {
    brands,

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

// Get Brand By Id
export const getBrandById = async (id) => {
  const brand = await Brand.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!brand) {
    throw new ApiError(
      404,
      "Brand not found"
    );
  }

  return brand;
};

// Update Brand
export const updateBrand = async (
  id,
  body,
  file,
  userId
) => {
  const brand = await Brand.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!brand) {
    throw new ApiError(
      404,
      "Brand not found"
    );
  }

  if (body.name) {
    const exists = await Brand.findOne({
      name: body.name,
      _id: { $ne: id },
      isDeleted: false,
    });

    if (exists) {
      throw new ApiError(
        409,
        "Brand already exists"
      );
    }

    brand.name = body.name;

    brand.slug = slugify(body.name, {
      lower: true,
      strict: true,
    });
  }

  if (body.description) {
    brand.description =
      body.description;
  }

  if (body.website) {
    brand.website = body.website;
  }

  if (body.status) {
    brand.status = body.status;
  }

  if (file) {

    // Optional
    // if (brand.logo.fileId) {
    //   await deleteFile(brand.logo.fileId);
    // }

    const uploaded = await uploadFile(
      file,
      "brands"
    );

    brand.logo = {
      fileId: uploaded.fileId,
      url: uploaded.url,
    };
  }

  brand.updatedBy = userId;

  await brand.save();

  return brand;
};

// Delete Brand
export const deleteBrand = async (id) => {
  const brand = await Brand.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!brand) {
    throw new ApiError(
      404,
      "Brand not found"
    );
  }

  brand.isDeleted = true;

  await brand.save();

  return true;
};