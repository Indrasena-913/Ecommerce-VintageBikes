import express from "express";
import {
	registerUser,
	loginUser,
	verifyEmail,
} from "../Controllers/userControllers.js";
import { verifyToken } from "../Middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email", verifyEmail);

export default router;
