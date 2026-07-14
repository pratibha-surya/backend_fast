import slugify from "slugify";

import Banner from "../models/Banner.js";

import ApiError from "../utils/ApiError.js";



/*
|--------------------------------------------------------------------------
| Create Banner
|--------------------------------------------------------------------------
*/

export const createBanner = async (
  body,
  file,
  userId
) => {

  const exists = await Banner.findOne({
    name: body.name,
    isDeleted: false,
  });

  if (exists) {
    throw new ApiError(
      409,
      "Banner already exists"
    );
  }

  if (!file) {
    throw new ApiError(
      400,
      "Banner image is required"
    );
  }

  const uploaded = await uploadFile(
    file,
    "banners"
  );

  const banner = await Banner.create({

    ...body,

    slug: slugify(body.name, {
      lower: true,
      strict: true,
    }),

    image: {
      fileId: uploaded.fileId,
      url: uploaded.url,
    },

    createdBy: userId,

  });

  return banner;

};

/*
|--------------------------------------------------------------------------
| Get All Banners
|--------------------------------------------------------------------------
*/

export const getBanners = async () => {

  return await Banner.find({
    isDeleted: false,
  }).sort({
    displayOrder: 1,
  });

};

/*
|--------------------------------------------------------------------------
| Get Active Banners
|--------------------------------------------------------------------------
*/

export const getActiveBanners = async () => {

  const today = new Date();

  return await Banner.find({

    status: "active",

    isDeleted: false,

    startDate: {
      $lte: today,
    },

    endDate: {
      $gte: today,
    },

  }).sort({
    displayOrder: 1,
  });

};

/*
|--------------------------------------------------------------------------
| Get Banner By Id
|--------------------------------------------------------------------------
*/

export const getBannerById = async (
  id
) => {

  const banner = await Banner.findOne({

    _id: id,

    isDeleted: false,

  });

  if (!banner) {

    throw new ApiError(
      404,
      "Banner not found"
    );

  }

  return banner;

};

/*
|--------------------------------------------------------------------------
| Update Banner
|--------------------------------------------------------------------------
*/

export const updateBanner = async (
  id,
  body,
  file,
  userId
) => {

  const banner = await Banner.findOne({

    _id: id,

    isDeleted: false,

  });

  if (!banner) {

    throw new ApiError(
      404,
      "Banner not found"
    );

  }

  if (body.name) {

    banner.slug = slugify(
      body.name,
      {
        lower: true,
        strict: true,
      }
    );

  }

  if (file) {

    if (banner.image.fileId) {

      await deleteFile(
        banner.image.fileId
      );

    }

    const uploaded =
      await uploadFile(
        file,
        "banners"
      );

    banner.image = {

      fileId:
        uploaded.fileId,

      url:
        uploaded.url,

    };

  }

  Object.assign(
    banner,
    body
  );

  banner.updatedBy = userId;

  await banner.save();

  return banner;

};

/*
|--------------------------------------------------------------------------
| Delete Banner
|--------------------------------------------------------------------------
*/

export const deleteBanner = async (
  id
) => {

  const banner = await Banner.findOne({

    _id: id,

    isDeleted: false,

  });

  if (!banner) {

    throw new ApiError(
      404,
      "Banner not found"
    );

  }

  if (banner.image.fileId) {

    await deleteFile(
      banner.image.fileId
    );

  }

  banner.isDeleted = true;

  await banner.save();

  return true;

};