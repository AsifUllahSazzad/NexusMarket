import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import {
  createMerchantApplication,
  resubmitMerchantApplication,
} from "../models/merchantApplicationModel.js";
import { getMerchantApplicationByUserId } from "../models/merchantApplicationModel.js";

// Register Merchant
export const registerMerchant = async (req, res, next) => {
  const {
    name,
    storeName,
    email,
    phone,
    category,
    tradeLicense,
    password,
    agreed,
  } = req.body;

  // Check agreement acceptance
  if (agreed !== true) {
    return res.status(400).json({
      success: false,
      message: "You must accept the agreement to register.",
    });
  }

  let client;
  let transactionStarted = false;

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Get PostgreSQL connection
    client = await pool.connect();

    // Begin transaction
    await client.query("BEGIN");
    transactionStarted = true;

    // Create merchant and application
    const result = await createMerchantApplication(
      client,
      name,
      storeName,
      email,
      phone,
      category,
      tradeLicense,
      passwordHash,
    );

    const token = jwt.sign(
      {
        role: result.user.role,
      },
      process.env.JWT_SECRET,
      {
        subject: String(result.user.id),
        expiresIn: "3h",
      },
    );

    // Save both inserts
    await client.query("COMMIT");
    transactionStarted = false;

    return res.status(201).json({
      success: true,
      message: "Merchant application submitted successfully.",
      token,
      user: result.user,
      application: result.application,
    });
  } catch (error) {
    if (client && transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }
    }

    // Duplicate email
    if (error.code === "23505" && error.constraint === "users_email_key") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    return next(error);
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Get Merchant Profile and Application
export const getMyMerchantApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    const application = await getMerchantApplicationByUserId(userId, pool);


    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Merchant application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get merchant application error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Resubmit Merchant Application
export const resubmitMerchantApplicationController = async (req, res, next) => {
  try {
    // 1. Get authenticated user's ID
    const userId = req.user.id;

    // 2. Get application ID from URL
    const { applicationId } = req.params;

    // 3. Get submitted form data
    const {
      ownerName,
      storeName,
      category,
      tradeLicense,
      phone,
      complianceNote,
    } = req.body;

    // 4. Basic validation
    if (!ownerName || !storeName || !category || !tradeLicense || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (
      !Number.isSafeInteger(Number(applicationId)) ||
      Number(applicationId) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    // 5. Call model
    const result = await resubmitMerchantApplication(userId, applicationId, pool, {
      ownerName,
      storeName,
      category,
      tradeLicense,
      phone,
      complianceNote,
    });

    // 6. Send successful response
    return res.status(200).json({
      success: true,
      message: "Merchant application resubmitted successfully.",
      application: result.application,
      version: result.version,
    });
  } catch (error) {
    console.error("Merchant resubmission error:", error);
    next(error);
  }
};


// 