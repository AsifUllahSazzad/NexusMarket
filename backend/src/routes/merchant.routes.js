import { Router } from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

import { requireApprovedMerchant } from "../middleware/requireApprovedMerchant.js";
import { getMyMerchantApplication } from "../controllers/merchant.application.controller.js";

const router = Router();

// All merchant routes below are protected.
// router.use(authenticateToken);
// router.use(requireApprovedMerchant);

// Get Merchant Profile
router.get("/profile", authenticateToken, getMyMerchantApplication);


export default router;
