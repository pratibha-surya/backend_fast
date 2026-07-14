import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Add Product
|--------------------------------------------------------------------------
*/

export const addToWishlist = async (
  userId,
  productId
) => {

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    status: "active",
  });

  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  let wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {

    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });

  }

  const exists = wishlist.products.some(
    (id) => id.toString() === productId
  );

  if (!exists) {
    wishlist.products.push(productId);
  }

  await wishlist.save();

  return wishlist.populate("products");

};

/*
|--------------------------------------------------------------------------
| Get Wishlist
|--------------------------------------------------------------------------
*/

export const getWishlist = async (
  userId
) => {

  return await Wishlist.findOne({
    user: userId,
  }).populate({
    path: "products",
    populate: [
      {
        path: "category",
        select: "name slug",
      },
      {
        path: "subCategory",
        select: "name slug",
      },
      {
        path: "brand",
        select: "name logo",
      },
    ],
  });

};

/*
|--------------------------------------------------------------------------
| Remove Product
|--------------------------------------------------------------------------
*/

export const removeWishlistItem = async (
  userId,
  productId
) => {

  const wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    throw new ApiError(
      404,
      "Wishlist not found"
    );
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  );

  await wishlist.save();

  return wishlist.populate("products");

};

/*
|--------------------------------------------------------------------------
| Clear Wishlist
|--------------------------------------------------------------------------
*/

export const clearWishlist = async (
  userId
) => {

  const wishlist = await Wishlist.findOne({
    user: userId,
  });

  if (!wishlist) {
    throw new ApiError(
      404,
      "Wishlist not found"
    );
  }

  wishlist.products = [];

  await wishlist.save();

  return wishlist;

};