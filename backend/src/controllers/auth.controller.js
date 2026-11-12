import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export async function login(req, res) {
  const email = req.body.email?.toLowerCase().trim();
  const password = req.body.password;

  console.log("hi")

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const result = await pool.query(
    "SELECT id, password_hash, role FROM users WHERE email = $1",
    [email],
  );
  const user = result.rows[0];

  // Same message for both cases so attackers can't tell which emails exist
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  // Your snippet goes here, after the password is verified
  const token = jwt.sign({ role: user.role }, process.env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: "1h",
  });

  return res.status(200).json({ message: "Login successful", token });
}
