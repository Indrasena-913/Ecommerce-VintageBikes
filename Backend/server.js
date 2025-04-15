import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import wishlistRoutes from "./Routes/wishlistRoutes.js";
import CartRoutes from "./Routes/CartRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js";

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", categoryRoutes);
app.use("/", wishlistRoutes);
app.use("/", CartRoutes);
app.use("/", paymentRoutes);

app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Port is running successfully at ${PORT} `);
	}
});
