import * as bannerService from "../services/banner.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Create Banner
|--------------------------------------------------------------------------
*/

export const createBanner = asyncHandler(async (req, res) => {

  const banner =
    await bannerService.createBanner(

      req.body,

      req.file,

      req.user._id

    );

  return res.status(201).json(

    new ApiResponse(

      201,

      "Banner created successfully",

      banner

    )

  );

});

/*
|--------------------------------------------------------------------------
| Get All Banners
|--------------------------------------------------------------------------
*/

export const getBanners = asyncHandler(async (req, res) => {

  const banners =
    await bannerService.getBanners();

  return res.status(200).json(

    new ApiResponse(

      200,

      "Banners fetched successfully",

      banners

    )

  );

});

/*
|--------------------------------------------------------------------------
| Get Active Banners
|--------------------------------------------------------------------------
*/

export const getActiveBanners = asyncHandler(async (req, res) => {

  const banners =
    await bannerService.getActiveBanners();

  return res.status(200).json(

    new ApiResponse(

      200,

      "Active banners fetched successfully",

      banners

    )

  );

});

/*
|--------------------------------------------------------------------------
| Get Banner By Id
|--------------------------------------------------------------------------
*/

export const getBannerById = asyncHandler(async (req, res) => {

  const banner =
    await bannerService.getBannerById(
      req.params.id
    );

  return res.status(200).json(

    new ApiResponse(

      200,

      "Banner fetched successfully",

      banner

    )

  );

});

/*
|--------------------------------------------------------------------------
| Update Banner
|--------------------------------------------------------------------------
*/

export const updateBanner = asyncHandler(async (req, res) => {

  const banner =
    await bannerService.updateBanner(

      req.params.id,

      req.body,

      req.file,

      req.user._id

    );

  return res.status(200).json(

    new ApiResponse(

      200,

      "Banner updated successfully",

      banner

    )

  );

});

/*
|--------------------------------------------------------------------------
| Delete Banner
|--------------------------------------------------------------------------
*/

export const deleteBanner = asyncHandler(async (req, res) => {

  await bannerService.deleteBanner(
    req.params.id
  );

  return res.status(200).json(

    new ApiResponse(

      200,

      "Banner deleted successfully"

    )

  );

});