import { Router } from "express";

import {
  authenticateToken,
  requireAdmin,
} from "../middleware/authenticateToken.js";

import {
  getPendingApplicationsController,
  approveApplicationController,
  rejectApplicationController,
  loginAdminProfile,
} from "../controllers/admin.controller.js";

import { getAdminProfile } from "../controllers/admin.controller.js";

const router = Router();

// Admin login
router.post("/login", loginAdminProfile);

// Admin Profile
router.get("/profile", authenticateToken, requireAdmin, getAdminProfile);

// View merchant pending applications
router.get(
  "/merchant-applications",
  authenticateToken,
  requireAdmin,
  getPendingApplicationsController,
);

// Approve application
router.patch(
  "/merchant-applications/:applicationId/approve",
  authenticateToken,
  requireAdmin,
  approveApplicationController,
);

// Reject application
router.patch(
  "/merchant-applications/:applicationId/reject",
  authenticateToken,
  requireAdmin,
  rejectApplicationController,
);

export default router;
