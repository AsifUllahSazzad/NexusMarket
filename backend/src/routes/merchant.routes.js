import { Router } from "express";

import { authenticateToken } from "../middleware/authenticateToken.js";

import {
  requireApprovedMerchant,
} from "../middleware/requireApproveMerchnat.js";

const router = Router();

router.use(authenticateToken);
router.use(requireApprovedMerchant);

// All merchant routes below are protected.

export default router;