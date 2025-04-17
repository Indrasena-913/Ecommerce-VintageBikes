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

export const sendVerificationEmail = (email, token) => {
	const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Verify Your Email Address",
		html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
	};

	return transporter.sendMail(mailOptions);
};
