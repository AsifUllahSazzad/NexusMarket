import express from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post(
  "/demo",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),

    body("email").trim().isEmail().withMessage("A valid email is required"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  validate,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Validation passed",
    });
  },
);

export default router;
