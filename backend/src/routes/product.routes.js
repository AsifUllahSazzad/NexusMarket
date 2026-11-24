import { Router } from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

import { requireApprovedMerchant } from "../middleware/requireApprovedMerchant.js";
import {
  changeProductStatus,
  changeProductStock,
  createProductController,
  editMerchantProduct,
  getMerchantProductByIdController,
  getMerchantProductsController,
} from "../controllers/product.controller.js";
import { createProductValidator } from "../validators/productValidator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

// All product-management routes require an approved merchant
router.use(authenticateToken, requireApprovedMerchant);

// Create product
router.post("/", createProductValidator, validate, createProductController);
// console.log("Problems....")

// Get all products belonging to logged-in merchant
router.get("/", getMerchantProductsController);

// Single drop down menu status update
router.patch("/:productId/status", changeProductStatus);

// Single stock update
router.patch("/:productId/stock", changeProductStock);

// Single Product full update
router.patch("/:productId", createProductValidator, validate, editMerchantProduct)

// Get one product belonging to logged-in merchant
router.get("/:productId", getMerchantProductByIdController);

export default router;
