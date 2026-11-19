import { Router } from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

import { requireApprovedMerchant } from "../middleware/requireApprovedMerchant.js";
import {
  createProductController,
  getMerchantProductByIdController,
  getMerchantProductsController,
} from "../controllers/product.controller.js";
import { createProductValidator } from "../validators/productValidator.js";

const router = Router();

// All product-management routes require an approved merchant
router.use(authenticateToken, requireApprovedMerchant);

// Create product
router.post("/", createProductValidator, createProductController);

// Get all products belonging to logged-in merchant
router.get("/", getMerchantProductsController);

// Get one product belonging to logged-in merchant
router.get("/:productId", getMerchantProductByIdController);

export default router;
