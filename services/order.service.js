import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import Coupon from "../models/Coupon.js";
import logger from "../utils/logger.js";


import ApiError from "../utils/ApiError.js";
import { calculateOfferPrice } from "./offer.service.js";
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};

export const createOrder = async (
  userId,
  body
) => {
  logger.info(`Initiating order creation for user: ${userId}`);

  const {
    address,
    paymentMethod,
    coupon
  } = body;

  // Find Cart
  const cart = await Cart.findOne({
    user: userId
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Check Address
  const addressExists = await Address.findOne({
    _id: address,
    user: userId,
    isDeleted: false
  });

  if (!addressExists) {
    throw new ApiError(404, "Address not found");
  }

  // Validate Stock
  for (const item of cart.items) {

    if (item.product.quantity < item.quantity) {

      throw new ApiError(
        400,
        `${item.product.name} is out of stock`
      );

    }

  }

  let discount = 0;
  let couponId = null;

  // Apply Coupon
  if (coupon) {

    const couponData = await Coupon.findOne({
      _id: coupon,
      status: "active",
      isDeleted: false,
    });

    if (!couponData) {
      throw new ApiError(404, "Coupon not found");
    }

    if (couponData.discountType === "percentage") {

      discount =
        cart.subTotal *
        couponData.discountValue /
        100;

      if (
        couponData.maximumDiscount &&
        discount >
          couponData.maximumDiscount
      ) {
        discount =
          couponData.maximumDiscount;
      }

    } else {

      discount =
        couponData.discountValue;

    }

    couponId = couponData._id;

  }

  // Create Order Items

  const orderItems = await Promise.all(
    cart.items.map(async (item) => {
      const offerDetails = await calculateOfferPrice(item.product);
      return {
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0]?.url || "",
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        offer: offerDetails.offer?._id || null,
      };
    })
  );

  // Save Order

  const order = await Order.create({

    orderNumber:
      generateOrderNumber(),

    user: userId,

    address,

    items: orderItems,

    totalQuantity:
      cart.totalQuantity,

    subTotal:
      cart.subTotal,

    discount,

    shippingCharge:
      cart.shippingCharge,

    tax:
      cart.tax,

    grandTotal:
      cart.grandTotal - discount,

    coupon: couponId,

    paymentMethod,

    paymentStatus: "pending",

    orderStatus: "pending",

  });

  logger.info(`Order created successfully. Order Number: ${order.orderNumber}, Grand Total: ${order.grandTotal}`);

  // Reduce Stock

  for (const item of cart.items) {
    logger.info(`Updating inventory for product ${item.product._id} (name: ${item.product.name}): reduced quantity by ${item.quantity}`);

    await Product.findByIdAndUpdate(

      item.product._id,

      {
        $inc: {
          quantity: -item.quantity,
          totalSold: item.quantity
        }
      }

    );

  }

  // Increase Coupon Usage

  if (couponId) {
    logger.info(`Applied coupon ${couponId} to order ${order.orderNumber}`);

    await Coupon.findByIdAndUpdate(

      couponId,

      {
        $inc: {
          usedCount: 1
        }
      }

    );

  }

  // Clear Cart

  cart.items = [];

  cart.totalQuantity = 0;

  cart.subTotal = 0;

  cart.discount = 0;

  cart.tax = 0;

  cart.shippingCharge = 0;

  cart.grandTotal = 0;

  await cart.save();

  return order;

};

export const getOrders = async (userId) => {

  return await Order.find({
    user: userId
  })
    .populate("address")
    .populate("coupon")
    .populate("items.offer", "name discountType discountValue")
    .sort({
      createdAt: -1
    });

};
export const getOrderById = async (
  userId,
  orderId,
  role
) => {

  const query = { _id: orderId };
  if (role !== "admin") {
    query.user = userId;
  }

  const order = await Order.findOne(query)
    .populate("address")
    .populate("coupon")
    .populate("items.offer", "name discountType discountValue");

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  return order;

};

export const cancelOrder = async (
  userId,
  orderId,
  role
) => {

  const query = { _id: orderId };
  if (role !== "admin") {
    query.user = userId;
  }

  const order = await Order.findOne(query);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  if (
    order.orderStatus === "delivered"
  ) {
    throw new ApiError(
      400,
      "Delivered order cannot be cancelled"
    );
  }

  if (
    order.orderStatus === "cancelled"
  ) {
    throw new ApiError(
      400,
      "Order already cancelled"
    );
  }

  // Restore Stock

  for (const item of order.items) {

    await Product.findByIdAndUpdate(

      item.product,

      {
        $inc: {
          quantity: item.quantity,
          totalSold: -item.quantity
        }
      }

    );

  }

  order.orderStatus = "cancelled";

  order.isCancelled = true;

  order.cancelledAt = new Date();

  await order.save();

  return order;

};

export const updateOrderStatus = async (
  orderId,
  orderStatus
) => {

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  order.orderStatus = orderStatus;

  if (orderStatus === "delivered") {

    order.paymentStatus = "paid";

    order.deliveredAt = new Date();

  }

  await order.save();

  return order;

};

export const deleteOrder = async (
  orderId
) => {

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  await order.deleteOne();

  return true;

};