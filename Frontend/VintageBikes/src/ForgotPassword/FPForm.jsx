import React, { useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email) {
			toast.error("Please enter your email");
			return;
		}

		setLoading(true);

		try {
			const response = await axios.post(`${BASE_API_URL}/forgot-password`, {
				email,
			});
			toast.success(response.data.message);
			setLoading(false);
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10">
			<h2 className="text-center text-xl font-bold mb-6">Forgot Password</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full p-3 border border-gray-300 rounded"
					required
				/>
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 rounded"
				>
					{loading ? "Sending..." : "Send Reset Link"}
				</button>
			</form>
			<button
				className="w-full bg-black text-white py-2 rounded mt-4"
				onClick={() => navigate("/")}
			>
				Back to Login
			</button>
		</div>
	);
};

export default ForgotPasswordForm;
