import * as notificationService from "../services/notification.service.js";

import asyncHandler from "../middleware/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createNotification = asyncHandler(async (req, res) => {

  const notification =
    await notificationService.createNotification(
      req.body
    );

  return res.status(201).json(
    new ApiResponse(
      201,
      "Notification created successfully",
      notification
    )
  );

});

export const getNotifications = asyncHandler(async (req, res) => {

  const notifications =
    await notificationService.getNotifications(
      req.user._id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Notifications fetched successfully",
      notifications
    )
  );

});

export const markAsRead = asyncHandler(async (req, res) => {

  const notification =
    await notificationService.markAsRead(
      req.user._id,
      req.params.id
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Notification marked as read",
      notification
    )
  );

});

export const deleteNotification = asyncHandler(async (req, res) => {

  await notificationService.deleteNotification(
    req.user._id,
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Notification deleted successfully"
    )
  );

});