import express from "express";
import { GetCategories } from "../Controllers/categoryControllers.js";
import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();

router.get("/categories", verifyToken, GetCategories);

export default router;
