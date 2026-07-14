import Coupon from "../models/Coupon.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/*
|--------------------------------------------------------------------------
| Create Coupon
|--------------------------------------------------------------------------
*/

export const createCoupon = async (
  body,
  userId
) => {

  const exists = await Coupon.findOne({
    code: body.code.toUpperCase(),
    isDeleted: false,
  });

  if (exists) {
    throw new ApiError(
      409,
      "Coupon already exists"
    );
  }

  if (
    new Date(body.startDate) >=
    new Date(body.expiryDate)
  ) {
    throw new ApiError(
      400,
      "Expiry date must be greater than start date"
    );
  }

  const coupon = await Coupon.create({

    code: body.code.toUpperCase(),

    description: body.description,

    discountType: body.discountType,

    discountValue: body.discountValue,

    minimumPurchase:
      body.minimumPurchase || 0,

    maximumDiscount:
      body.maximumDiscount || 0,

    usageLimit:
      body.usageLimit || 1,

    startDate: body.startDate,

    expiryDate: body.expiryDate,

    status: body.status,

    createdBy: userId,

  });

  return coupon;

};

/*
|--------------------------------------------------------------------------
| Get All Coupons
|--------------------------------------------------------------------------
*/

export const getCoupons = async (
  query
) => {

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
    filter.code = {
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

  const coupons =
    await Coupon.find(filter)

      .sort(sort)

      .skip(skip)

      .limit(Number(limit));

  const total =
    await Coupon.countDocuments(filter);

  return {

    coupons,

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

/*
|--------------------------------------------------------------------------
| Get Coupon By Id
|--------------------------------------------------------------------------
*/

export const getCouponById = async (
  id
) => {

  const coupon =
    await Coupon.findOne({

      _id: id,

      isDeleted: false,

    });

  if (!coupon) {

    throw new ApiError(
      404,
      "Coupon not found"
    );

  }

  return coupon;

};

/*
|--------------------------------------------------------------------------
| Update Coupon
|--------------------------------------------------------------------------
*/

export const updateCoupon = async (
  id,
  body
) => {

  const coupon =
    await Coupon.findOne({

      _id: id,

      isDeleted: false,

    });

  if (!coupon) {

    throw new ApiError(
      404,
      "Coupon not found"
    );

  }

  if (
    body.code &&
    body.code !== coupon.code
  ) {

    const exists =
      await Coupon.findOne({

        code: body.code.toUpperCase(),

        _id: { $ne: id },

        isDeleted: false,

      });

    if (exists) {

      throw new ApiError(
        409,
        "Coupon already exists"
      );

    }

    coupon.code =
      body.code.toUpperCase();

  }

  Object.assign(coupon, body);

  await coupon.save();

  return coupon;

};

/*
|--------------------------------------------------------------------------
| Delete Coupon
|--------------------------------------------------------------------------
*/

export const deleteCoupon = async (
  id
) => {

  const coupon =
    await Coupon.findOne({

      _id: id,

      isDeleted: false,

    });

  if (!coupon) {

    throw new ApiError(
      404,
      "Coupon not found"
    );

  }

  coupon.isDeleted = true;

  await coupon.save();

  return true;

};

/*
|--------------------------------------------------------------------------
| Apply Coupon
|--------------------------------------------------------------------------
*/

export const applyCoupon = async (
  code,
  cart
) => {
  logger.info(`Validating coupon application for code: ${code}`);

  const coupon =
    await Coupon.findOne({

      code: code.toUpperCase(),

      status: "active",

      isDeleted: false,

    });

  if (!coupon) {
    logger.warn(`Coupon validation failed: code ${code} is invalid or inactive`);

    throw new ApiError(
      404,
      "Invalid coupon"
    );

  }

  const today = new Date();

  if (today < coupon.startDate) {
    logger.warn(`Coupon validation failed: code ${code} has not started yet`);

    throw new ApiError(
      400,
      "Coupon not started yet"
    );

  }

  if (today > coupon.expiryDate) {
    logger.warn(`Coupon validation failed: code ${code} has expired`);

    throw new ApiError(
      400,
      "Coupon expired"
    );

  }

  if (
    coupon.usedCount >=
    coupon.usageLimit
  ) {
    logger.warn(`Coupon validation failed: code ${code} usage limit exceeded`);

    throw new ApiError(
      400,
      "Coupon usage limit exceeded"
    );

  }

  if (
    cart.subTotal <
    coupon.minimumPurchase
  ) {
    logger.warn(`Coupon validation failed: subtotal (${cart.subTotal}) is below minimum purchase requirement (${coupon.minimumPurchase})`);

    throw new ApiError(
      400,
      `Minimum purchase amount is ₹${coupon.minimumPurchase}`
    );

  }

  let discount = 0;

  if (
    coupon.discountType ===
    "percentage"
  ) {

    discount =
      (cart.subTotal *
        coupon.discountValue) /
      100;

    if (
      coupon.maximumDiscount > 0 &&
      discount >
        coupon.maximumDiscount
    ) {

      discount =
        coupon.maximumDiscount;

    }

  } else {

    discount =
      coupon.discountValue;

  }

  logger.info(`Coupon ${code} applied successfully. Discount: ${discount}`);

  return {

    coupon,

    discount,

    payable:

      cart.subTotal - discount,

  };

};