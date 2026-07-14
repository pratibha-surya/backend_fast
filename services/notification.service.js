import Notification from "../models/notification.js";
import ApiError from "../utils/ApiError.js";

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

export const createNotification = async (body) => {

  return await Notification.create(body);

};

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = async (userId) => {

  return await Notification.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });

};

/*
|--------------------------------------------------------------------------
| Mark As Read
|--------------------------------------------------------------------------
*/

export const markAsRead = async (
  userId,
  id
) => {

  const notification =
    await Notification.findOne({

      _id: id,

      user: userId,

    });

  if (!notification) {

    throw new ApiError(
      404,
      "Notification not found"
    );

  }

  notification.isRead = true;

  await notification.save();

  return notification;

};

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

export const deleteNotification = async (
  userId,
  id
) => {

  const notification =
    await Notification.findOne({

      _id: id,

      user: userId,

    });

  if (!notification) {

    throw new ApiError(
      404,
      "Notification not found"
    );

  }

  await notification.deleteOne();

  return true;

};