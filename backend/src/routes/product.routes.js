import { Router } from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

import { createProduct } from "../controllers/product.controller.js";
import { requireApprovedMerchant } from "../middleware/requireApprovedMerchant.js";

const router = Router();

// Only approved merchants can create products
router.post("/", authenticateToken, requireApprovedMerchant, createProduct);

export default router;
