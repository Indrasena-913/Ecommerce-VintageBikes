import express from "express";
import { GetProducts } from "../Controllers/productControllers.js";
import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();
router.get("/products", verifyToken, GetProducts);

export default router;
