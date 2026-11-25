import { body } from "express-validator";

export const storeValidation = [
  // Store name
  body("storeName")
    .trim()
    .notEmpty()
    .withMessage("Store name is required.")
    .bail()
    .isLength({ min: 4, max: 100 })
    .withMessage("Store name must be between 4 and 100 characters."),

  // Store handle
  body("handle")
    .trim()
    .notEmpty()
    .withMessage("Store handle is required.")
    .bail()
    .matches(/^@[a-zA-Z0-9_]{3,30}$/)
    .withMessage(
      "Handle must start with @ and contain 3-30 letters, numbers, or underscores.",
    ),

  // Tagline (optional)
  body("tagline")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage("Tagline cannot exceed 255 characters."),

  // Description (optional)
  body("description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters."),

  // Email
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Support email is required.")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Enter a valid support email address.")
    .bail()
    .isEmail()
    .withMessage("Enter a valid support email address."),

  // Bangladesh mobile number
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Contact phone number is required.")
    .bail()
    .matches(/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/)
    .withMessage("Enter a valid Bangladesh mobile number."),

  // Support hours (optional)
  body("supportHours")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage("Support hours cannot exceed 150 characters."),

  // Address
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Street address is required.")
    .bail()
    .isLength({ min: 5, max: 250 })
    .withMessage("Address must be between 5 and 250 characters."),

  // City
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required.")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("City must be between 2 and 100 characters."),

  // Bangladesh postal code
  body("postalCode")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required.")
    .bail()
    .matches(/^\d{4}$/)
    .withMessage("Postal code must contain exactly 4 digits."),
];
