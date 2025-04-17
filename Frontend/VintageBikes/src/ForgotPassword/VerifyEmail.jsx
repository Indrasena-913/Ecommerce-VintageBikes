import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_API_URL } from "../api";

const VerifyEmail = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState("loading");

	const token = searchParams.get("token");

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const response = await axios.get(`${BASE_API_URL}/verify-email`, {
					params: { token },
				});
				if (response.data.success) {
					setStatus("success");
					setTimeout(() => navigate("/login"), 3000);
				} else {
					setStatus("error");
				}
			} catch (error) {
				console.error("Email verification failed:", error);
				setStatus("error");
			}
		};

		if (token) {
			verifyEmail();
		} else {
			setStatus("error");
		}
	}, [token, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-white text-black px-4">
			<div className="bg-black text-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
				{status === "loading" && (
					<>
						<h2 className="text-2xl font-semibold mb-2">Verifying...</h2>
						<p className="text-sm text-gray-300">
							Please wait while we verify your email.
						</p>
					</>
				)}

				{status === "success" && (
					<>
						<h2 className="text-2xl font-semibold mb-2 text-green-400">
							Email Verified!
						</h2>
						<p className="text-sm text-gray-300">
							Redirecting you to login page...
						</p>
					</>
				)}

				{status === "error" && (
					<>
						<h2 className="text-2xl font-semibold mb-2 text-red-400">
							Verification Failed
						</h2>
						<p className="text-sm text-gray-300">Invalid or expired token.</p>
					</>
				)}
			</div>
		</div>
	);
};

export default VerifyEmail;
