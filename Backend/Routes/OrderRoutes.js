import express from "express";

import { verifyToken } from "../Middlewares/auth.js";
import { GetOrders } from "../Controllers/OrderControllers.js";
const router = express.Router();

router.get("/myorders/:userId", verifyToken, GetOrders);

export default router;
