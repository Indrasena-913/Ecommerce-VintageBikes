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
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6e3]">
			<div className="w-full flex justify-center mb-6 lg:hidden">
				<img
					src={MobileImage}
					alt="Mobile Login"
					className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full shadow-lg border-4 border-[#D1B13D] transition-all duration-500 ease-in-out"
				/>
			</div>

			<div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-xl shadow-xl overflow-hidden">
				{/* Form Section */}
				<div className="w-full lg:w-1/2 p-8 md:p-12 bg-white">
					<h2 className="text-3xl font-bold text-[#D1B13D] mb-8 text-center">
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
								className="w-full p-3 rounded-lg bg-[#D4A6A1] bg-opacity-30 border border-[#D4A6A1] text-[#4C6B72] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D1B13D]"
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
								className="w-full p-3 rounded-lg bg-[#D4A6A1] bg-opacity-30 border border-[#D4A6A1] text-[#4C6B72] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D1B13D]"
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
								className="text-sm text-[#4C6B72] hover:text-[#D1B13D]"
							>
								Forgot Password?
							</button>
						</div>

						<button
							type="submit"
							className="w-full bg-[#4C6B72] hover:bg-[#3b5b5b] text-white p-3 rounded-lg font-semibold transition-all duration-300 shadow-md transform hover:scale-[1.02]"
						>
							Sign In
						</button>
					</form>

					<div className="mt-8 text-center">
						<p className="text-[#4C6B72]">
							Don't have an account?{" "}
							<button
								onClick={() => navigate("/register")}
								className="text-[#D1B13D] font-semibold hover:underline transition-all duration-300"
							>
								Register Now
							</button>
						</p>
					</div>
				</div>

				<div className="hidden lg:block lg:w-1/2 bg-[#4C6B72] relative">
					<div className="absolute inset-0 flex items-center justify-center p-8">
						<img
							src={LoginImage2}
							alt="Vintage Motorcycle"
							className="max-w-full max-h-full object-contain rounded-lg shadow-lg border-4 border-[#D1B13D]"
						/>
					</div>
					<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#4C6B72] text-white text-center">
						<h3 className="text-2xl font-bold text-[#D1B13D]">Welcome Back</h3>
						<p className="text-sm mt-2">
							Sign in to continue your vintage motorcycle journey
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
