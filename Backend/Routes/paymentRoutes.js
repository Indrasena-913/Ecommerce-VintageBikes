import express from "express";
import { createCheckout } from "../Controllers/paymentControllers.js";
import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();

router.post("/checkout", verifyToken, createCheckout);

export default router;
