import { findAdminById } from "../models/adminModel.js";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getPendingApplications,
  approveMerchantApplication,
  rejectMerchantApplication,
} from "../models/merchantApplicationModel.js";

// Get admin profile
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
    console.log(req.user.id);

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

// Login admin profile
export const loginAdminProfile = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find admin account only
    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role
       FROM users
       WHERE email = $1 AND role = 'admin'`,
      [email],
    );

    const admin = result.rows[0];

    // Verify admin credentials
    if (
      !admin ||
      !admin.password_hash ||
      !(await bcrypt.compare(password, admin.password_hash))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    // Generate Admin JWT
    const token = jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        subject: String(admin.id),
        expiresIn: "3h",
      },
    );

    // Send response
    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      user: {
        id: admin.id,
        name: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
