import express from "express";
import {
	confirmPayment,
	createCheckout,
} from "../Controllers/paymentControllers.js";
import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();

router.post("/checkout", verifyToken, createCheckout);
router.post("/confirm-payment", verifyToken, confirmPayment);

export default router;
