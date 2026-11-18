import { body } from "express-validator";

export const createProductValidator = [
  // 1. Product Title
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Product title is required.")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("Product title must be between 3 and 150 characters."),

  // 2. Product Image (URL or uploaded file)
  body("imageUrl").custom((value, { req }) => {
    const hasFile = Boolean(req.file);
    const url = typeof value === "string" ? value.trim() : "";

    if (!hasFile && !url) {
      throw new Error("Product image is required.");
    }

    if (url) {
      try {
        const parsedUrl = new URL(url);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error();
        }
      } catch {
        throw new Error("Please provide a valid image URL.");
      }
    }

    return true;
  }),

  // 3. SKU Code
  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU code is required.")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters.")
    .bail()
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage(
      "SKU can only contain letters, numbers, hyphens and underscores.",
    )
    .toUpperCase(),

  // 4. Price (BDT)
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Product price is required.")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0.")
    .toFloat(),

  // 5. Initial Stock
  body("stock")
    .trim()
    .notEmpty()
    .withMessage("Initial stock is required.")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative whole number.")
    .toInt(),

  // 6. Status
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Product status is required.")
    .bail()
    .isIn(["active", "draft"])
    .withMessage("Status must be active or draft."),

  // 7. Description
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required.")
    .bail()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters."),
];
