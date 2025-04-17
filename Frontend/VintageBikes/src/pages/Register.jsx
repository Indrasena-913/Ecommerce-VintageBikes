import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../api";
import {
	User,
	Phone,
	MapPin,
	Mail,
	Lock,
	ArrowRight,
	Eye,
	EyeOff,
} from "lucide-react";
import RegisterImage2 from "../assets/RegisterImage2.png";
import MobileImage from "../assets/MobileImage.jpeg";
import toast from "react-hot-toast";

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

const Register = () => {
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
			const response = await axios.post(`${BASE_API_URL}/register`, data);
			console.log("Register Success:", response.data);
			toast.success("User registered successfully");
			setTimeout(() => {
				toast.success("Please verify your email");
			}, 2000);
			navigate("/");
		} catch (error) {
			console.error("Register Error:", error.response?.data || error.message);
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
						alt="Mobile Register"
						className="w-full h-full object-cover"
					/>
				</div>
			</div>

			{/* Main Content */}
			<div className="w-full max-w-6xl flex flex-col lg:flex-row-reverse bg-white rounded-xl shadow-2xl overflow-hidden z-10">
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
									d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<h2 className="text-3xl font-bold text-black ml-3">
							Create Account
						</h2>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						{/* Name */}
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<User size={18} className="text-gray-500" />
							</div>
							<input
								placeholder="Full Name"
								{...register("name", { required: "Name is required" })}
								className="w-full p-3 pl-10 rounded-lg bg-gray-50 border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
							/>
							{errors.name && (
								<p className="text-red-600 text-sm mt-1">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Phone */}
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Phone size={18} className="text-gray-500" />
							</div>
							<input
								placeholder="Phone Number"
								{...register("phone", {
									required: "Phone is required",
									pattern: {
										value: /^[0-9]{10}$/,
										message: "Phone number must be 10 digits",
									},
								})}
								className="w-full p-3 pl-10 rounded-lg bg-gray-50 border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
							/>
							{errors.phone && (
								<p className="text-red-600 text-sm mt-1">
									{errors.phone.message}
								</p>
							)}
						</div>

						{/* Address */}
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<MapPin size={18} className="text-gray-500" />
							</div>
							<input
								placeholder="Address"
								{...register("address", { required: "Address is required" })}
								className="w-full p-3 pl-10 rounded-lg bg-gray-50 border border-gray-300 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
							/>
							{errors.address && (
								<p className="text-red-600 text-sm mt-1">
									{errors.address.message}
								</p>
							)}
						</div>

						{/* Email */}
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

						{/* Password */}
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

						{/* Terms and Privacy */}
						<div className="flex items-start">
							<div className="flex items-center h-5">
								<input
									id="terms"
									type="checkbox"
									{...register("terms", {
										required: "You must accept the terms",
									})}
									className="w-4 h-4 border border-gray-300 rounded text-black focus:ring-0 focus:ring-offset-0"
								/>
							</div>
							<div className="ml-3 text-sm">
								<label htmlFor="terms" className="text-gray-600">
									I agree to the{" "}
									<a
										href="#"
										className="text-black font-medium hover:underline"
									>
										Terms of Service
									</a>{" "}
									and{" "}
									<a
										href="#"
										className="text-black font-medium hover:underline"
									>
										Privacy Policy
									</a>
								</label>
								{errors.terms && (
									<p className="text-red-600 text-xs mt-1">
										{errors.terms.message}
									</p>
								)}
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-black hover:bg-gray-900 text-white p-3 rounded-lg font-semibold transition-all duration-300 shadow-lg flex items-center justify-center mt-6"
						>
							{isLoading ? (
								<div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
							) : (
								<>
									Create Account <ArrowRight size={16} className="ml-2" />
								</>
							)}
						</button>
					</form>

					{/* Sign In Link */}
					<div className="mt-8 text-center">
						<p className="text-gray-600">
							Already have an account?{" "}
							<button
								onClick={() => navigate("/")}
								className="text-black font-semibold hover:underline transition-all duration-300"
							>
								Sign In
							</button>
						</p>
					</div>
				</div>

				{/* Image Section */}
				<div className="hidden lg:block lg:w-1/2 bg-gray-100 relative">
					<div className="absolute inset-0 flex items-center justify-center p-8">
						<LazyImage
							src={RegisterImage2}
							alt="Register Illustration"
							className="max-w-full max-h-full object-contain rounded-lg shadow-lg border-4 border-black"
						/>
					</div>
					<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-100 text-black text-center">
						<h3 className="text-2xl font-bold">Join the Premium Experience</h3>
						<p className="text-sm mt-2">
							Create your exclusive account today ✨
						</p>
					</div>
				</div>
			</div>

			<div className="mt-8 text-center text-gray-500 text-sm">
				© {new Date().getFullYear()} Premium Platform. All rights reserved.
			</div>
		</div>
	);
};

export default Register;
