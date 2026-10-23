import express from "express";
import { registerBuyer } from "../controllers/auth.controller.js";
import {
  buyerRegistrationValidation,
  validateBuyerRegistration,
} from "../validators/buyerRegistrationValidator.js";

const router = express.Router();

router.post(
  "/register/customer",
  buyerRegistrationValidation,
  validateBuyerRegistration,
  registerBuyer,
);

// router.post("/register/merchant", postMerchant);

// router.post("/login", postLogin);

export default router;
