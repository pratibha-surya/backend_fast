import { Router } from "express";

import * as notificationController from "../controllers/notification.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validateMiddleware from "../middleware/validate.middleware.js";

import {
  createNotificationValidator,
  notificationIdValidator,
} from "../validators/notification.validator.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createNotificationValidator,
  validateMiddleware,
  notificationController.createNotification
);

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  notificationController.getNotifications
);

router.patch(
  "/read/:id",
  authMiddleware,
  notificationIdValidator,
  validateMiddleware,
  notificationController.markAsRead
);

router.delete(
  "/:id",
  authMiddleware,
  notificationIdValidator,
  validateMiddleware,
  notificationController.deleteNotification
);

export default router;