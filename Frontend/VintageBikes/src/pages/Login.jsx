import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
	const { setIsLoggedIn } = useAuth();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();

	const onSubmit = async (data) => {
		try {
			const response = await axios.post(`${BASE_API_URL}/login`, data);
			const { accessToken, user } = response.data;

			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("user", JSON.stringify(user));

			console.log("Login Success:", response.data);
			setIsLoggedIn(true);

			navigate("/dashboard");
		} catch (error) {
			console.error("Login Error:", error.response?.data || error.message);
		}
		reset();
	};

	return (
		<div>
			<h2 className="text-2xl font-bold text-center text-[#D2691E] mb-6">
				Login
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<input
					placeholder="Email"
					type="email"
					{...register("email", {
						required: "Email is required",
						pattern: {
							value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
							message: "Please enter a valid email",
						},
					})}
					className="w-full p-3 rounded-lg bg-[#E6D3B3] text-black placeholder:text-gray-700"
				/>
				{errors.email && (
					<p className="text-red-400 text-sm">{errors.email.message}</p>
				)}

				<input
					placeholder="Password"
					type="password"
					{...register("password", {
						required: "Password is required",
						minLength: {
							value: 6,
							message: "Password must be at least 6 characters",
						},
					})}
					className="w-full p-3 rounded-lg bg-[#E6D3B3] text-black placeholder:text-gray-700"
				/>
				{errors.password && (
					<p className="text-red-400 text-sm">{errors.password.message}</p>
				)}

				<button
					type="submit"
					className="w-full bg-[#D2691E] hover:bg-[#b14f16] transition p-3 rounded-lg font-semibold text-white"
				>
					Login
				</button>
			</form>

			<p className="text-center mt-6 text-sm">
				Don't have an account?{" "}
				<button
					onClick={() => navigate("/register")}
					className="text-[#D2691E] font-semibold hover:underline"
				>
					Register
				</button>
			</p>
		</div>
	);
};

export default Login;
