import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BASE_API_URL } from "../api";
import LoginImage2 from "../assets/LoginImage2.png";
import MobileImage from "../assets/MobileImage.jpeg";

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
			setIsLoggedIn(true);
			navigate("/dashboard");
		} catch (error) {
			console.error("Login Error:", error.response?.data || error.message);
		}
		reset();
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] relative overflow-hidden">
			<div className="absolute top-20 left-32 w-16 h-16 bg-[#6366F1] opacity-20 rounded-full blur-md"></div>
			<div className="absolute top-1/3 left-16 w-32 h-32 bg-[#EF4444] opacity-10 rounded-full blur-lg"></div>
			<div className="absolute bottom-20 left-40 w-24 h-24 bg-[#10B981] opacity-10 rounded-full blur-md"></div>
			<div className="absolute top-1/4 right-24 w-28 h-28 bg-[#6366F1] opacity-15 rounded-full blur-md"></div>
			<div className="absolute top-1/2 right-32 w-20 h-20 bg-[#EF4444] opacity-10 rounded-full blur-sm"></div>
			<div className="absolute bottom-32 right-16 w-32 h-32 bg-[#10B981] opacity-10 rounded-full blur-md"></div>

			{/* Mobile Image */}
			<div className="w-full flex justify-center mb-6 lg:hidden z-10">
				<img
					src={MobileImage}
					alt="Mobile Login"
					className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full shadow-lg border-4 border-[#6366F1]"
				/>
			</div>

			{/* Login Card */}
			<div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-xl shadow-2xl overflow-hidden z-10">
				{/* Form Section */}
				<div className="w-full lg:w-1/2 p-8 md:p-12 bg-white">
					<h2 className="text-3xl font-bold text-[#6366F1] mb-8 text-center">
						Welcome Back
					</h2>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div>
							<input
								type="email"
								placeholder="Email Address"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "Please enter a valid email",
									},
								})}
								className="w-full p-3 rounded-lg bg-[#F3F4F6] border border-[#D1D5DB] text-[#111827] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">
									{errors.email.message}
								</p>
							)}
						</div>

						<div>
							<input
								type="password"
								placeholder="Password"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 6,
										message: "Password must be at least 6 characters",
									},
								})}
								className="w-full p-3 rounded-lg bg-[#F3F4F6] border border-[#D1D5DB] text-[#111827] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
							/>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{errors.password.message}
								</p>
							)}
						</div>

						<div className="flex justify-end">
							<button
								type="button"
								className="text-sm text-[#6B7280] hover:text-[#EF4444]"
								onClick={() => navigate("/forgot-password")}
							>
								Forgot Password?
							</button>
						</div>

						<button
							type="submit"
							className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white p-3 rounded-lg font-semibold transition-all duration-300 shadow-lg transform hover:scale-[1.02]"
						>
							Sign In
						</button>
					</form>

					<div className="mt-8 text-center">
						<p className="text-[#6B7280]">
							Don't have an account?{" "}
							<button
								onClick={() => navigate("/register")}
								className="text-[#111827] font-semibold hover:underline transition-all duration-300"
							>
								Register Now
							</button>
						</p>
					</div>
				</div>

				{/* Image Section */}
				<div className="hidden lg:block lg:w-1/2 bg-[#F3F4F6] relative">
					<div className="absolute inset-0 flex items-center justify-center p-8">
						<img
							src={LoginImage2}
							alt="Login Illustration"
							className="max-w-full max-h-full object-contain rounded-lg shadow-lg border-4 border-[#6366F1]"
						/>
					</div>
					<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#F3F4F6] text-[#111827] text-center">
						<p className="text-sm mt-2">
							Sign in to continue your journey in style ✨
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
