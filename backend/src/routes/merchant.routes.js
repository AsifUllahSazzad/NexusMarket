import { Router } from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

import {
  getMyMerchantApplication,
  resubmitMerchantApplicationController,
} from "../controllers/merchant.application.controller.js";
import { storeValidation } from "../validators/storeProfileValidator.js";

const router = Router();

// All merchant routes below are protected.
router.use(authenticateToken);

// Get Single Merchant Profile
router.get("/profile", getMyMerchantApplication);

// Resubmit Merchant Application
router.post(
  "/applications/:applicationId/resubmit",
  resubmitMerchantApplicationController,
);

// Create Store Profile
router.put("/store/profile", storeValidation, )

//
export default router;