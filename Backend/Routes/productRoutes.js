import express from "express";
import {
	GetOneProduct,
	GetProducts,
} from "../Controllers/productControllers.js";
import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();
router.get("/products", verifyToken, GetProducts);
router.get("/products/:id", verifyToken, GetOneProduct);

export default router;
