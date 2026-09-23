import { body } from "express-validator";
import { validationResult } from "express-validator";

// Merchant Validator
export const merchantRegisterValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage("Please enter a valid email address"),

    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .customSanitizer((value) => value.replace(/[\s-]/g, ""))
      .matches(/^(?:01[3-9]\d{8}|\+8801[3-9]\d{8})$/)
      .withMessage("Enter a valid Bangladesh phone number"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number"),

    body("storeName")
      .trim()
      .notEmpty()
      .withMessage("Store name is required")
      .isLength({ min: 2 })
      .withMessage("Store name must be at least 2 characters"),

    body("tradeLicense")
      .trim()
      .notEmpty()
      .withMessage("Trade license / NID / BIN is required")
      .matches(/^[A-Za-z0-9]{4,20}$/)
      .withMessage(
        "Enter a valid Trade license / NID / BIN (4–20 alphanumeric characters)",
      ),
  ];
};

// Customer Validator
export const customerRegisterValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Name can only contain letters and spaces"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage("Please enter a valid email address"),

    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .customSanitizer((value) => value.replace(/[\s-]/g, ""))
      .matches(/^(?:01[3-9]\d{8}|\+8801[3-9]\d{8})$/)
      .withMessage("Enter a valid Bangladesh phone number"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number"),

    body("deliveryCity")
      .trim()
      .notEmpty()
      .withMessage("Delivery city is required"),
  ];
};

// Validation Check
export const validationCheck = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().map((e) => ({ path: e.path, message: e.msg })),
    });
  }

  next();
};
