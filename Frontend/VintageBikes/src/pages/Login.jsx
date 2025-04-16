import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BASE_API_URL } from "../api";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import LoginImage2 from "../assets/LoginImage2.png";
import MobileImage from "../assets/MobileImage.jpeg";

const ImageSkeleton = () => (
	<div className="animate-pulse flex items-center justify-center w-full h-full bg-gray-200 rounded-lg">
		<div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
	</div>
);

const LazyImage = ({ src, alt, className }) => {
	const [loaded, setLoaded] = useState(false);

	return (
		<>
			{!loaded && <ImageSkeleton />}
			<img
				src={src}
				alt={alt}
				className={`${className} ${loaded ? "block" : "hidden"}`}
				onLoad={() => setLoaded(true)}
			/>
		</>
	);
};

const Login = () => {
	const { setIsLoggedIn } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const navigate = useNavigate();

	const onSubmit = async (data) => {
		setIsLoading(true);
		try {
			const response = await axios.post(`${BASE_API_URL}/login`, data);
			const { accessToken, user } = response.data;
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("user", JSON.stringify(user));
			setIsLoggedIn(true);
			navigate("/dashboard");
		} catch (error) {
			console.error("Login Error:", error.response?.data || error.message);
		} finally {
			setIsLoading(false);
			reset();
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMS4zNiAwLTIuNS0xLjEyLTIuNS0yLjUgMC0xLjM5IDEuMTQtMi41IDIuNS0yLjUgMS4zNiAwIDIuNSAxLjExIDIuNSAyLjUgMCAxLjM4LTEuMTQgMi41LTIuNSAyLjV6IiBmaWxsLW9wYWNpdHk9Ii4zIiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==')]"></div>

			{/* Mobile Image */}
			<div className="w-full flex justify-center mb-6 lg:hidden z-10">
				<div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden shadow-xl border-4 border-black">
					<LazyImage
						src={MobileImage}
						alt="Mobile Login"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>

			{/* Login Card */}
			<div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-xl shadow-2xl overflow-hidden z-10">
				{/* Form Section */}
				<div className="w-full lg:w-1/2 p-8 md:p-12 bg-white">
					<div className="flex items-center justify-center mb-8">
						<div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
							<svg
								className="h-6 w-6 text-white"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M12 16V14M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20ZM16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<h2 className="text-3xl font-bold text-black ml-3">Welcome Back</h2>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Mail size={18} className="text-gray-500" />
							</div>
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
								className="w-full p-3 pl-10 rounded-lg bg-gray-50 border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
							/>
							{errors.email && (
								<p className="text-red-600 text-sm mt-1">
									{errors.email.message}
								</p>
							)}
						</div>

						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock size={18} className="text-gray-500" />
							</div>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 6,
										message: "Password must be at least 6 characters",
									},
								})}
								className="w-full p-3 pl-10 rounded-lg bg-gray-50 border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-black"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
							{errors.password && (
								<p className="text-red-600 text-sm mt-1">
									{errors.password.message}
								</p>
							)}
						</div>

						<div className="flex justify-end">
							<button
								type="button"
								className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
								onClick={() => navigate("/forgot-password")}
							>
								Forgot Password?
							</button>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-black hover:bg-gray-900 text-white p-3 rounded-lg font-semibold transition-all duration-300 shadow-lg flex items-center justify-center"
						>
							{isLoading ? (
								<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
							) : (
								<>
									Sign In <ArrowRight size={16} className="ml-2" />
								</>
							)}
						</button>
					</form>

					<div className="mt-8">
						<div className="relative flex items-center">
							<div className="flex-grow border-t border-gray-300"></div>
							<span className="flex-shrink mx-4 text-gray-600">
								Or continue with
							</span>
							<div className="flex-grow border-t border-gray-300"></div>
						</div>

						<div className="mt-4 flex space-x-4">
							<button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 p-2 rounded-lg transition-colors duration-300">
								<svg
									className="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									/>
								</svg>
								Google
							</button>
							<button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 p-2 rounded-lg transition-colors duration-300">
								<svg
									className="h-5 w-5"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
										fill="#1877F2"
									/>
									<path
										d="M15.893 14.89l.443-2.89h-2.773v-1.876c0-.791.387-1.562 1.63-1.562h1.26v-2.46s-1.144-.195-2.238-.195c-2.285 0-3.777 1.384-3.777 3.89V12h-2.54v2.89h2.54v6.988a10.06 10.06 0 003.115 0v-6.987h2.33z"
										fill="white"
									/>
								</svg>
								Facebook
							</button>
						</div>
					</div>

					<div className="mt-8 text-center">
						<p className="text-gray-600">
							Don't have an account?{" "}
							<button
								onClick={() => navigate("/register")}
								className="text-black font-semibold hover:underline transition-all duration-300"
							>
								Register Now
							</button>
						</p>
					</div>
				</div>

				{/* Image Section */}
				<div className="hidden lg:block lg:w-1/2 bg-gray-100 relative">
					<div className="absolute inset-0 flex items-center justify-center p-8">
						<LazyImage
							src={LoginImage2}
							alt="Login Illustration"
							className="max-w-full max-h-full object-contain rounded-lg shadow-lg border-4 border-black"
						/>
					</div>
					<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-100 text-black text-center">
						<h3 className="text-2xl font-bold">Premium Experience</h3>
					</div>
				</div>
			</div>

			<div className="mt-8 text-center text-gray-500 text-sm">
				© {new Date().getFullYear()} Premium Platform. All rights reserved.
			</div>
		</div>
	);
};

export default Login;
