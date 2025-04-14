import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "../api";

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
		} catch (error) {
			console.error("Register Error:", error.response?.data || error.message);
		}
		reset();
	};

	return (
		<div>
			<h2 className="text-2xl font-bold text-center text-[#D2691E] mb-6">
				Register
			</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<input
					placeholder="Name"
					{...register("name", { required: "Name is required" })}
					className="w-full p-3 rounded-lg bg-[#E6D3B3] text-black placeholder:text-gray-700"
				/>
				{errors.name && (
					<p className="text-red-400 text-sm">{errors.name.message}</p>
				)}

				<input
					placeholder="Phone"
					{...register("phone", {
						required: "Phone is required",
						pattern: {
							value: /^[0-9]{10}$/,
							message: "Phone number must be 10 digits",
						},
					})}
					className="w-full p-3 rounded-lg bg-[#E6D3B3] text-black placeholder:text-gray-700"
				/>
				{errors.phone && (
					<p className="text-red-400 text-sm">{errors.phone.message}</p>
				)}

				<input
					placeholder="Address"
					{...register("address", { required: "Address is required" })}
					className="w-full p-3 rounded-lg bg-[#E6D3B3] text-black placeholder:text-gray-700"
				/>
				{errors.address && (
					<p className="text-red-400 text-sm">{errors.address.message}</p>
				)}

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
					Register
				</button>
			</form>

			<p className="text-center mt-6 text-sm">
				Already have an account?{" "}
				<button
					onClick={() => navigate("/")}
					className="text-[#D2691E] font-semibold hover:underline"
				>
					Login
				</button>
			</p>
		</div>
	);
};

export default Register;
