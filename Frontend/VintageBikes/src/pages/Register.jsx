import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../api";
import RegisterImage2 from "../assets/RegisterImage2.png";
import MobileImage2 from "../assets/MobileImage.jpeg";

const Register = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();

	const onSubmit = async (data) => {
		try {
			const response = await axios.post(`${BASE_API_URL}/register`, data);
			console.log("Register Success:", response.data);
			navigate("/");
		} catch (error) {
			console.error("Register Error:", error.response?.data || error.message);
		}
		reset();
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#fdf6e3]">
			<div className="w-full flex justify-center mb-6 lg:hidden">
				<img
					src={MobileImage2}
					alt="Mobile Register"
					className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full shadow-lg border-4 border-[#D1B13D] transition-all duration-500 ease-in-out"
				/>
			</div>

			<div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-xl shadow-xl overflow-hidden">
				<div className="hidden lg:block lg:w-1/2 bg-[#4C6B72] relative">
					<div className="absolute inset-0 flex items-center justify-center p-8">
						<img
							src={RegisterImage2}
							alt="Vintage Motorcycle"
							className="max-w-full max-h-full object-contain rounded-lg shadow-lg border-4 border-[#D1B13D]"
						/>
					</div>
					<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#4C6B72] text-white text-center">
						<h3 className="text-2xl font-bold text-[#D1B13D]">
							Join Our Community
						</h3>
						<p className="text-sm mt-2">
							Become part of our vintage motorcycle enthusiasts
						</p>
					</div>
				</div>

				{/* Form Section */}
				<div className="w-full lg:w-1/2 p-8 md:p-12 bg-white">
					<h2 className="text-3xl font-bold text-[#D1B13D] mb-8 text-center">
						Create Account
					</h2>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<input
								placeholder="Full Name"
								{...register("name", { required: "Name is required" })}
								className="w-full p-3 rounded-lg bg-[#D4A6A1] bg-opacity-30 border border-[#D4A6A1] text-[#4C6B72] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D1B13D]"
							/>
							{errors.name && (
								<p className="text-red-500 text-sm mt-1">
									{errors.name.message}
								</p>
							)}
						</div>

						<div>
							<input
								placeholder="Phone Number"
								{...register("phone", {
									required: "Phone is required",
									pattern: {
										value: /^[0-9]{10}$/,
										message: "Phone number must be 10 digits",
									},
								})}
								className="w-full p-3 rounded-lg bg-[#D4A6A1] bg-opacity-30 border border-[#D4A6A1] text-[#4C6B72] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D1B13D]"
							/>
							{errors.phone && (
								<p className="text-red-500 text-sm mt-1">
									{errors.phone.message}
								</p>
							)}
						</div>

						<div>
							<input
								placeholder="Address"
								{...register("address", { required: "Address is required" })}
								className="w-full p-3 rounded-lg bg-[#D4A6A1] bg-opacity-30 border border-[#D4A6A1] text-[#4C6B72] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D1B13D]"
							/>
							{errors.address && (
								<p className="text-red-500 text-sm mt-1">
									{errors.address.message}
								</p>
							)}
						</div>

						<div>
							<input
								placeholder="Email Address"
								type="email"
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
								placeholder="Password"
								type="password"
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

						<button
							type="submit"
							className="w-full bg-[#4C6B72] hover:bg-[#3b5b5b] text-white p-3 rounded-lg font-semibold mt-6 transition-all duration-300 shadow-md transform hover:scale-[1.02]"
						>
							Register Now
						</button>
					</form>

					<div className="mt-8 text-center">
						<p className="text-[#4C6B72]">
							Already have an account?{" "}
							<button
								onClick={() => navigate("/")}
								className="text-[#D1B13D] font-semibold hover:underline transition-all duration-300"
							>
								Login Here
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
