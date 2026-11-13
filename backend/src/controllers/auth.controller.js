import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Login customer & merchant account
export async function login(req, res) {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password;
    const accountType = req.body.accountType;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required.",
      });
    }

    if (!["buyer", "merchant"].includes(accountType)) {
      return res.status(400).json({
        message: "Invalid account type.",
      });
    }

    // Find user by email
    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role
       FROM users
       WHERE email = $1`,
      [email],
    );

    const user = result.rows[0];

    // Verify password
    if (
      !user ||
      !user.password_hash ||
      !(await bcrypt.compare(password, user.password_hash))
    ) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Determine actual account type
    let actualRole = user.role;

    if (user.role !== "admin") {
      const merchantResult = await pool.query(
        `SELECT id
         FROM merchant_applications
         WHERE user_id = $1`,
        [user.id],
      );

      if (merchantResult.rows.length > 0) {
        actualRole = "merchant";
      } else {
        actualRole = "buyer";
      }
    }

    // Verify selected account type
    if (actualRole !== accountType) {
      return res.status(403).json({
        message: `This account cannot log in as ${accountType}.`,
      });
    }

    // Generate JWT
    const token = jwt.sign({ role: actualRole }, process.env.JWT_SECRET, {
      subject: String(user.id),
      expiresIn: "3h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: actualRole,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
}
