import slugify from "slugify";

import Offer from "../models/offer.js";

import ApiError from "../utils/ApiError.js";

export const createOffer = async (
  body,
  userId
) => {

  const exists = await Offer.findOne({
    name: body.name,
    isDeleted: false,
  });

  if (exists) {

    throw new ApiError(
      409,
      "Offer already exists"
    );

  }

  const offer = await Offer.create({

    ...body,

    slug: slugify(body.name, {
      lower: true,
      strict: true,
    }),

    createdBy: userId,

  });

  return offer;

};

export const getOffers = async () => {

  return await Offer.find({
    isDeleted: false,
  })

    .populate("products", "name")

    .populate("categories", "name")

    .populate("brands", "name")

    .sort({
      priority: 1,
    });

};

export const getOfferById = async (
  id
) => {

  const offer = await Offer.findOne({

    _id: id,

    isDeleted: false,

  });

  if (!offer) {

    throw new ApiError(
      404,
      "Offer not found"
    );

  }

  return offer;

};

export const updateOffer = async (
  id,
  body,
  userId
) => {

  const offer = await Offer.findById(id);

  if (!offer) {

    throw new ApiError(
      404,
      "Offer not found"
    );

  }

  Object.assign(
    offer,
    body
  );

  if (body.name) {

    offer.slug = slugify(
      body.name,
      {
        lower: true,
        strict: true,
      }
    );

  }

  offer.updatedBy = userId;

  await offer.save();

  return offer;

};

export const deleteOffer = async (
  id
) => {

  const offer = await Offer.findById(id);

  if (!offer) {

    throw new ApiError(
      404,
      "Offer not found"
    );

  }

  offer.isDeleted = true;

  await offer.save();

  return true;

};

export const getBestOffer = async (
  product
) => {

  const today = new Date();

  const offers = await Offer.find({

    status: "active",

    isDeleted: false,

    startDate: {
      $lte: today,
    },

    expiryDate: {
      $gte: today,
    },

    $or: [

      {
        products: product._id,
      },

      {
        categories: product.category,
      },

      {
        brands: product.brand,
      },

    ],

  }).sort({
    priority: 1,
  });

  return offers[0] || null;

};

export const calculateOfferPrice = async (
  product
) => {

  const offer = await getBestOffer(
    product
  );

  if (!offer) {

    return {

      originalPrice: product.price,

      finalPrice: product.price,

      discount: 0,

      offer: null,

    };

  }

  let discount = 0;

  if (
    offer.discountType ===
    "percentage"
  ) {

    discount =
      product.price *
      offer.discountValue /
      100;

    if (
      offer.maximumDiscount &&
      discount >
        offer.maximumDiscount
    ) {

      discount =
        offer.maximumDiscount;

    }

  } else {

    discount =
      offer.discountValue;

  }

  return {

    originalPrice: product.price,

    discount,

    finalPrice:
      product.price - discount,

    offer,

  };

};