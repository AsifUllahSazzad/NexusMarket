import { body, validationResult } from "express-validator";

const buyerRegistrationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 4 })
    .withMessage("Name must be at least 4 characters.")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Please enter a valid email address")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .customSanitizer((value) => value.toLowerCase()),

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

  body("agreed")
    .custom((value) => value === true)
    .withMessage("You must agree to the terms"),
];

const validateBuyerRegistration = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};

export { buyerRegistrationValidation, validateBuyerRegistration };
