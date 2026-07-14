import * as orderService from "../services/order.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

export const createOrder = asyncHandler(async (req, res) => {

  const order = await orderService.createOrder(
    req.user._id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Order placed successfully",
      order
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get My Orders
|--------------------------------------------------------------------------
*/

export const getOrders = asyncHandler(async (req, res) => {

  const orders = await orderService.getOrders(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Orders fetched successfully",
      orders
    )
  );

});

/*
|--------------------------------------------------------------------------
| Get Order By Id
|--------------------------------------------------------------------------
*/

export const getOrderById = asyncHandler(async (req, res) => {

  const order = await orderService.getOrderById(
    req.user._id,
    req.params.id,
    req.user.role
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Order fetched successfully",
      order
    )
  );

});

/*
|--------------------------------------------------------------------------
| Cancel Order
|--------------------------------------------------------------------------
*/

export const cancelOrder = asyncHandler(async (req, res) => {

  const order = await orderService.cancelOrder(
    req.user._id,
    req.params.id,
    req.user.role
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Order cancelled successfully",
      order
    )
  );

});

/*
|--------------------------------------------------------------------------
| Update Order Status (Admin)
|--------------------------------------------------------------------------
*/

export const updateOrderStatus = asyncHandler(async (req, res) => {

  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body.orderStatus
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Order status updated successfully",
      order
    )
  );

});

/*
|--------------------------------------------------------------------------
| Delete Order (Admin)
|--------------------------------------------------------------------------
*/

export const deleteOrder = asyncHandler(async (req, res) => {

  await orderService.deleteOrder(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Order deleted successfully"
    )
  );

});