import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_API_URL } from "../api";
import toast from "react-hot-toast";

const ResetPasswordForm = () => {
	const { token } = useParams();
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!password) {
			toast.error("Please enter a new password");
			return;
		}

		setLoading(true);

		try {
			const response = await axios.post(
				`${BASE_API_URL}/reset-password/${token}`,
				{
					password,
				}
			);
			toast.success(response.data.message);
			setLoading(false);
			navigate("/");
		} catch (error) {
			toast.error(error.response?.data?.message || "Something went wrong");
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10">
			<h2 className="text-center text-xl font-bold mb-6">Reset Password</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="password"
					placeholder="Enter new password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full p-3 border border-gray-300 rounded"
					required
				/>
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-green-600 text-white py-2 rounded"
				>
					{loading ? "Resetting..." : "Reset Password"}
				</button>
			</form>
		</div>
	);
};

export default ResetPasswordForm;
