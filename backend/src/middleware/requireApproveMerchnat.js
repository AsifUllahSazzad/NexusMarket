import pool from "../config/db.js";

export const requireApprovedMerchant = async (req, res, next) => {
  try {
    const userRole = req.user.role;

    // Check if the user is a merchant
    if (userRole !== "merchant") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only merchants are allowed.",
      });
    }

    // Check if the merchant is approved
    const query = `SELECT EXISTS (
        SELECT 1
        FROM merchant_applications
        WHERE user_id = $1
          AND status = 'approved'
      ) AS is_approved;`;

    const result = await pool.query(query, [req.user.id]);

    if (!result.rows[0].is_approved) {
      return res.status(403).json({
        success: false,
        message: "Your merchant application has not been approved.",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
