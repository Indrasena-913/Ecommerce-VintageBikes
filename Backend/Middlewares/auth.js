import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer")) {
		return res
			.status(401)
			.json({ message: "Access token missing or malformed" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your-secret-key"
		);

		req.user = {
			id: decoded.userId,
			email: decoded.email,
		};

		next();
	} catch (error) {
		return res.status(403).json({ message: "Invalid or expired token" });
	}
};

export const refreshAccessToken = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken) {
		return res.status(401).json({ message: "Refresh token missing" });
	}

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_SECRET || "your-secret-key"
		);

		const newTokens = generateTokens(decoded.userId, decoded.email);

		res.cookie("refreshToken", newTokens.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "Strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return res.status(200).json({ accessToken: newTokens.accessToken });
	} catch (error) {
		return res.status(403).json({ message: "Invalid refresh token" });
	}
};

export { verifyToken };
