import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/userRoutes.js";
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/", userRoutes);
app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log(`Port is running successfully at ${PORT} `);
	}
});
