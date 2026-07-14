import { param, body } from "express-validator";

export const createNotificationValidator = [

  body("user")
    .isMongoId()
    .withMessage("Invalid user id"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required"),

];

export const notificationIdValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid notification id"),

];