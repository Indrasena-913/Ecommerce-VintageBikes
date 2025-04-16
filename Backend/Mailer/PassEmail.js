import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const sendResetPasswordEmail = async (email, resetUrl) => {
	const mailOptions = {
		from: process.env.EMAIL,
		to: email,
		subject: "Password Reset Request",
		html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
	};

	await transporter.sendMail(mailOptions);
};
