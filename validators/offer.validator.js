import { body, param } from "express-validator";

export const createOfferValidator = [

  body("name")
    .trim()
    .notEmpty(),

  body("offerType")
    .isIn([
      "product",
      "category",
      "brand",
    ]),

  body("discountType")
    .isIn([
      "percentage",
      "fixed",
    ]),

  body("discountValue")
    .isFloat({
      min: 1,
    }),

  body("products")
    .optional()
    .isArray(),

  body("categories")
    .optional()
    .isArray(),

  body("brands")
    .optional()
    .isArray(),

  body("priority")
    .optional()
    .isInt({
      min: 1,
    }),

  body("startDate")
    .isISO8601(),

  body("expiryDate")
    .isISO8601(),

];

export const updateOfferValidator = [

  param("id")
    .isMongoId(),

];

export const offerIdValidator = [

  param("id")
    .isMongoId(),

];