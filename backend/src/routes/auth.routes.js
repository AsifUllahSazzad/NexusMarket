import express from "express";
import { postCustomer, postMerchant } from "../controllers/auth.controller.js";
import {
  customerRegisterValidator,
  merchantRegisterValidator,
  validationCheck,
} from "../validators/auth.validator.js";
const router = express.Router();

router.post(
  "/register/merchant",
  merchantRegisterValidator(),
  validationCheck,
  postMerchant,
);

router.post(
  "/register/customer",
  customerRegisterValidator(),
  validationCheck,
  postCustomer,
);

export default router;
