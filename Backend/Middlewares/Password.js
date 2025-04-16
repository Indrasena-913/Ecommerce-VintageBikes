import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendResetPasswordEmail } from "../Mailer/PassEmail.js";
import prisma from "../PrismaClient.js";

export const forgotPassword = async (req, res) => {
	const { email } = req.body;

	try {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return res.status(400).json({ message: "Email not found" });
		}

		const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

		await sendResetPasswordEmail(user.email, resetUrl);

		res.status(200).json({ message: "Password reset link sent to your email" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const resetPassword = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);

		await prisma.user.update({
			where: { id: decoded.userId },
			data: { password: hashedPassword },
		});

		res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Invalid or expired token" });
	}
};
