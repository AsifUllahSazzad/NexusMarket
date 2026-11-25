import { Router } from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

import { getMyMerchantApplication, resubmitMerchantApplicationController } from "../controllers/merchant.application.controller.js";

const router = Router();

// All merchant routes below are protected.

// Get Single Merchant Profile
router.get("/profile", authenticateToken, getMyMerchantApplication);

// Resubmit Merchant Application
router.post(
  "/applications/:applicationId/resubmit",
  authenticateToken,
  resubmitMerchantApplicationController,
);

// 
export default router;
