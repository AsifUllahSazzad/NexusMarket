import { body } from "express-validator";

export const createProductValidator = [
  // 1. Product Title
  body("productName")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("Product name must be between 3 and 150 characters"),

  // 2. Product Image (URL, data URI, or uploaded file)
  body("imageUrl").custom((value, { req }) => {
    const hasFile = Boolean(req.file);
    const imageUrl = typeof value === "string" ? value.trim() : "";

    if (!hasFile && !imageUrl) {
      throw new Error("Product image is required");
    }

    if (imageUrl) {
      const isDataImage = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(
        imageUrl,
      );

      let isValidUrl = false;

      try {
        const url = new URL(imageUrl);
        isValidUrl = ["http:", "https:"].includes(url.protocol);
      } catch {
        isValidUrl = false;
      }

      if (!isValidUrl && !isDataImage) {
        throw new Error("Enter a valid HTTP/HTTPS image URL");
      }
    }

    return true;
  }),

  // 3. SKU Code
  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU code is required")
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters")
    .bail()
    .matches(/^[A-Za-z0-9_-]+$/)
    .withMessage(
      "SKU can only contain letters, numbers, hyphens and underscores",
    )
    .toUpperCase(),

  // 4. Price (BDT)
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Product price is required")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0")
    .toFloat(),

  // 5. Initial Stock
  body("stockQuantity")
    .trim()
    .notEmpty()
    .withMessage("Stock quantity is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative whole number")
    .toInt(),

  // 6. Description
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .bail()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),
];
