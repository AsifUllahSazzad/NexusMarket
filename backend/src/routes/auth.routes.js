import express from "express";
import {
  buyerRegistrationValidation,
  validateBuyerRegistration,
} from "../validators/buyerRegistrationValidator.js";
import { registerBuyer } from "../controllers/customer.controller.js";
import { registerMerchant } from "../controllers/merchant.application.controller.js";
import {
  merchantApplicationValidator,
  validateMerchantApplication,
} from "../validators/merchantApplicationValidator.js";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post(
  "/register/customer",
  buyerRegistrationValidation,
  validateBuyerRegistration,
  registerBuyer,
);

router.post(
  "/register/merchant",
  merchantApplicationValidator,
  validateMerchantApplication,
  registerMerchant,
);

// Login Anyone
router.post("/login", login);

export default router;
