

/*
|--------------------------------------------------------------------------
| Calculate Cart
|--------------------------------------------------------------------------
*/

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import { calculateOfferPrice } from "./offer.service.js";

const calculateCart = async (cart) => {
  let totalQuantity = 0;
  let subTotal = 0;

  for (const item of cart.items) {
    let productObj = item.product;
    if (!productObj || !productObj.price) {
      productObj = await Product.findById(item.product);
    }
    const offerDetails = await calculateOfferPrice(productObj);
    item.price = offerDetails.finalPrice;
    item.total = item.price * item.quantity;

    totalQuantity += item.quantity;
    subTotal += item.total;
  }

  cart.totalQuantity = totalQuantity;
  cart.subTotal = subTotal;

  // Later Coupon Module
  cart.discount = 0;

  // Later Tax Module
  cart.tax = 0;

  // Later Shipping Module
  cart.shippingCharge = 0;

  cart.grandTotal =
    subTotal -
    cart.discount +
    cart.tax +
    cart.shippingCharge;

  return cart;
};

/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

export const addToCart = async (
  userId,
  body
) => {

  const {
    product: productId,
    quantity,
  } = body;

  const product =
    await Product.findOne({
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

  if (product.quantity < quantity) {
    throw new ApiError(
      400,
      "Insufficient stock"
    );
  }

  let cart =
    await Cart.findOne({
      user: userId,
    });

  if (!cart) {

    cart = await Cart.create({
      user: userId,
      items: [],
    });

  }

  const existingItem =
    cart.items.find(
      (item) =>
        item.product.toString() ===
        productId
    );

  if (existingItem) {

    existingItem.quantity +=
      Number(quantity);

    if (
      existingItem.quantity >
      product.quantity
    ) {
      throw new ApiError(
        400,
        "Stock limit exceeded"
      );
    }

    existingItem.price =
      product.discountPrice > 0 ? product.discountPrice : product.price;

  } else {

    cart.items.push({

      product: product._id,

      quantity,

      price:
        product.discountPrice > 0 ? product.discountPrice : product.price,

      total:
        (product.discountPrice > 0 ? product.discountPrice : product.price) *
        quantity,

    });

  }

  await calculateCart(cart);

  await cart.save();

  return cart.populate({
    path: "items.product",
    populate: [
      {
        path: "category",
      },
      {
        path: "brand",
      },
      {
        path: "attributes.attribute",
        select: "name slug",
      },
    ],
  });

};

/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

export const getCart = async (
  userId
) => {

  const cart =
    await Cart.findOne({
      user: userId,
    })
      .populate({
        path: "items.product",
        populate: [
          {
            path: "category",
          },
          {
            path: "brand",
          },
          {
            path: "attributes.attribute",
            select: "name slug",
          },
        ],
      });

  if (!cart) {

    return null;

  }

  return cart;

};

/*
|--------------------------------------------------------------------------
| Update Quantity
|--------------------------------------------------------------------------
*/

export const updateCart = async (
  userId,
  productId,
  quantity
) => {

  const cart =
    await Cart.findOne({
      user: userId,
    });

  if (!cart) {
    throw new ApiError(
      404,
      "Cart not found"
    );
  }

  const item =
    cart.items.find(
      (item) =>
        item.product.toString() ===
        productId
    );

  if (!item) {
    throw new ApiError(
      404,
      "Product not found in cart"
    );
  }

  const product =
    await Product.findById(
      productId
    );

  if (
    quantity > product.quantity
  ) {
    throw new ApiError(
      400,
      "Insufficient stock"
    );
  }

  item.quantity = quantity;

  item.price =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  await calculateCart(cart);

  await cart.save();

  return cart.populate({
    path: "items.product",
    populate: [
      {
        path: "category",
      },
      {
        path: "brand",
      },
      {
        path: "attributes.attribute",
        select: "name slug",
      },
    ],
  });

};

/*
|--------------------------------------------------------------------------
| Remove Product
|--------------------------------------------------------------------------
*/

export const removeCartItem =
  async (
    userId,
    productId
  ) => {

    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      throw new ApiError(
        404,
        "Cart not found"
      );
    }

    cart.items =
      cart.items.filter(
        (item) =>
          item.product.toString() !==
          productId
      );

    await calculateCart(cart);

    await cart.save();

    return cart.populate({
      path: "items.product",
      populate: [
        {
          path: "category",
        },
        {
          path: "brand",
        },
        {
          path: "attributes.attribute",
          select: "name slug",
        },
      ],
    });

  };

/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

export const clearCart =
  async (userId) => {

    const cart =
      await Cart.findOne({
        user: userId,
      });

    if (!cart) {
      throw new ApiError(
        404,
        "Cart not found"
      );
    }

    cart.items = [];

    await calculateCart(cart);

    await cart.save();

    return cart;

  };