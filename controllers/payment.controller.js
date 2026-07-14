import * as paymentService from "../services/payment.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Create Payment
|--------------------------------------------------------------------------
*/

export const createPayment = asyncHandler(async (req, res) => {

  const payment = await paymentService.createPayment(
    req.user._id,
    req.body.orderId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Payment order created successfully",
      payment
    )
  );

});

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

export const verifyPayment = asyncHandler(async (req, res) => {

  const order = await paymentService.verifyPayment(
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Payment verified successfully",
      order
    )
  );

});

/*
|--------------------------------------------------------------------------
| Webhook
|--------------------------------------------------------------------------
*/

export const webhook = asyncHandler(async (req, res) => {

  await paymentService.webhook(req.body);

  res.status(200).json({
    success: true,
  });

});