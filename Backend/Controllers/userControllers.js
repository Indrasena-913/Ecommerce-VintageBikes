import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../PrismaClient.js";
import { sendVerificationEmail } from "../Mailer/mailer.js";

const generateTokens = (userId, email) => {
	const accessToken = jwt.sign(
		{ userId, email },
		process.env.JWT_SECRET || "your-secret-key",
		{ expiresIn: "1d" }
	);
	const refreshToken = jwt.sign(
		{ userId, email },
		process.env.JWT_SECRET || "your-secret-key",
		{ expiresIn: "7d" }
	);

	return { accessToken, refreshToken };
};

export const registerUser = async (req, res) => {
	const { name, email, password, phone, address } = req.body;

	try {
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				phone,
				address,
			},
		});

		const { accessToken } = generateTokens(newUser.id, newUser.email);

		await sendVerificationEmail(email, accessToken);

		return res.status(201).json({
			message: "User registered successfully. Please verify your email.",
		});
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!user.verified) {
			return res
				.status(400)
				.json({ message: "Email not verified. Please check your email." });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		const { accessToken, refreshToken } = generateTokens(user.id, user.email);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({
			message: "Login successful",
			accessToken,
			user: { userId: user.id, userName: user.name, userEmail: user.email },
		});
	} catch (error) {
		return res.status(500).json({ message: "Something went wrong" });
	}
};

export const verifyEmail = async (req, res) => {
	const { token } = req.query;

	if (!token) {
		return res.status(400).json({ message: "Token is required" });
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your-secret-key"
		);

		await prisma.user.update({
			where: { email: decoded.email },
			data: { verified: true },
		});

		return res.status(200).json({ message: "Email verified successfully" });
	} catch (error) {
		return res.status(400).json({ message: "Invalid or expired token" });
	}
};
