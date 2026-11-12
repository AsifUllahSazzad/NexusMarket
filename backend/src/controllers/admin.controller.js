import { findAdminById } from "../models/adminModel.js";
import pool from "../config/db.js";
import {
  getPendingApplications,
  approveMerchantApplication,
  rejectMerchantApplication,
} from "../models/merchantApplicationModel.js";

export async function getAdminProfile(req, res, next) {
  try {
    const admin = await findAdminById(req.user.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin profile not found",
      });
    }

    return res.status(200).json({
      message: "Admin profile retrieved successfully",
      admin,
    });
  } catch (error) {
    next(error);
  }
}

// Get pending applications
export const getPendingApplicationsController = async (req, res, next) => {
  try {
    const applications = await getPendingApplications(pool);

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// Approve application
export const approveApplicationController = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    console.log("->applicationID", applicationId);

    const application = await approveMerchantApplication(
      pool,
      applicationId,
      req.user.id,
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Pending application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Merchant application approved successfully.",
      data: application,
    });
  } catch (error) {
    // console.log("hi")
    next(error);
  }
};

// Reject application
export const rejectApplicationController = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body;

    if (typeof reason !== "string" || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required.",
      });
    }
console.log(req.user.id)

    const application = await rejectMerchantApplication(
      pool,
      applicationId,
      req.user.id,
      reason.trim(),
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Pending application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Merchant application rejected successfully.",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
