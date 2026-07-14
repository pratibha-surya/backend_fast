import { body, param } from "express-validator";

/*
|--------------------------------------------------------------------------
| Create Banner
|--------------------------------------------------------------------------
*/

export const createBannerValidator = [

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Banner name is required")
    .isLength({ min: 2, max: 100 }),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("subTitle")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim(),

  body("buttonText")
    .optional()
    .trim(),

  body("buttonLink")
    .optional()
    .trim(),

  body("bannerType")
    .notEmpty()
    .withMessage("Banner type is required")
    .isIn([
      "home",
      "category",
      "offer",
      "popup",
    ]),

  body("position")
    .optional()
    .isIn([
      "top",
      "middle",
      "bottom",
    ]),

  body("displayOrder")
    .optional()
    .isInt({ min: 1 }),

  body("startDate")
    .notEmpty()
    .isISO8601(),

  body("endDate")
    .notEmpty()
    .isISO8601(),

  body("status")
    .optional()
    .isIn([
      "active",
      "inactive",
    ]),

];
/*
|--------------------------------------------------------------------------
| Update Banner
|--------------------------------------------------------------------------
*/

export const updateBannerValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid banner id"),

  body("name").optional(),

  body("title").optional(),

  body("subTitle").optional(),

  body("description").optional(),

  body("buttonText").optional(),

  body("buttonLink").optional(),

  body("bannerType")
    .optional()
    .isIn([
      "home",
      "category",
      "offer",
      "popup",
    ]),

  body("position")
    .optional()
    .isIn([
      "top",
      "middle",
      "bottom",
    ]),

  body("displayOrder")
    .optional()
    .isInt({ min: 1 }),

  body("startDate")
    .optional()
    .isISO8601(),

  body("endDate")
    .optional()
    .isISO8601(),

  body("status")
    .optional()
    .isIn([
      "active",
      "inactive",
    ]),

];
export const bannerIdValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid banner id"),

];