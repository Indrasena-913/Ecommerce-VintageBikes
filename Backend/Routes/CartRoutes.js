import express from "express";
import {
	addToCart,
	clearCart,
	getCart,
	removeFromCart,
	updateQuantity,
} from "../Controllers/CartControllers.js";
import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();

router.post("/cart", verifyToken, addToCart);
router.get("/cart", verifyToken, getCart);
router.delete("/cart/:productId", verifyToken, removeFromCart);
router.patch("/cart/:productId", verifyToken, updateQuantity);

router.delete("/cart", verifyToken, clearCart);

export default router;
