import crypto from "crypto";
import Razorpay from "razorpay";

import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/*
|--------------------------------------------------------------------------
| Create Payment Order
|--------------------------------------------------------------------------
*/

export const createPayment = async (userId, orderId) => {
  logger.info(`Creating Razorpay payment order for Order ID: ${orderId}, user: ${userId}`);

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Order already paid");
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.grandTotal * 100),
    currency: "INR",
    receipt: order.orderNumber,
  });

  logger.info(`Razorpay payment order created: ${razorpayOrder.id} for receipt: ${order.orderNumber}`);

  order.paymentOrderId = razorpayOrder.id;

  await order.save();

  return razorpayOrder;
};

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

export const verifyPayment = async (body) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  logger.info(`Verifying Razorpay payment. Order ID: ${razorpay_order_id}, Payment ID: ${razorpay_payment_id}`);

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      `${razorpay_order_id}|${razorpay_payment_id}`
    )
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    logger.warn(`Payment signature mismatch for Order ID: ${razorpay_order_id}`);
    throw new ApiError(400, "Invalid payment signature");
  }

  const order = await Order.findOne({
    paymentOrderId: razorpay_order_id,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  order.paymentId = razorpay_payment_id;
  order.paymentSignature = razorpay_signature;
  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";

  await order.save();

  logger.info(`Payment verified successfully for Order ID: ${razorpay_order_id}. Order status confirmed.`);

  return order;
};

/*
|--------------------------------------------------------------------------
| Razorpay Webhook
|--------------------------------------------------------------------------
*/

export const webhook = async (body) => {

  console.log(body);

  return true;
};