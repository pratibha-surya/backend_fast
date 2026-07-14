import { body, param } from "express-validator";

/*
|--------------------------------------------------------------------------
| Create Address
|--------------------------------------------------------------------------
*/

export const createAddressValidator = [

  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Full name must be between 3 and 100 characters"),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),

  body("alternateMobile")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid alternate mobile number"),

  body("addressLine1")
    .trim()
    .notEmpty()
    .withMessage("Address Line 1 is required"),

  body("addressLine2")
    .optional()
    .trim(),

  body("landmark")
    .optional()
    .trim(),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required")
    .isPostalCode("IN")
    .withMessage("Invalid postal code"),

  body("addressType")
    .optional()
    .isIn([
      "home",
      "office",
      "other",
    ])
    .withMessage("Invalid address type"),

  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be boolean"),

];

/*
|--------------------------------------------------------------------------
| Update Address
|--------------------------------------------------------------------------
*/

export const updateAddressValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid address id"),

  body("fullName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }),

  body("mobile")
    .optional()
    .isMobilePhone("en-IN"),

  body("alternateMobile")
    .optional()
    .isMobilePhone("en-IN"),

  body("addressLine1")
    .optional()
    .trim(),

  body("addressLine2")
    .optional()
    .trim(),

  body("landmark")
    .optional()
    .trim(),

  body("city")
    .optional()
    .trim(),

  body("state")
    .optional()
    .trim(),

  body("country")
    .optional()
    .trim(),

  body("postalCode")
    .optional()
    .isPostalCode("IN"),

  body("addressType")
    .optional()
    .isIn([
      "home",
      "office",
      "other",
    ]),

  body("isDefault")
    .optional()
    .isBoolean(),

];

/*
|--------------------------------------------------------------------------
| Address Id
|--------------------------------------------------------------------------
*/

export const addressIdValidator = [

  param("id")
    .isMongoId()
    .withMessage("Invalid address id"),

];