import express from "express";
import {
	AddToWishlist,
	getWishlist,
	RemoveFromWishlist,
} from "../Controllers/wishlistController.js";
import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();

router.post("/wishlist", verifyToken, AddToWishlist);
router.get("/wishlist/:userId", verifyToken, getWishlist);
router.delete("/wishlist/:productId", verifyToken, RemoveFromWishlist);

export default router;
