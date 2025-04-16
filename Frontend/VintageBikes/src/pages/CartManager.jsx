import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addToCart,
	removeFromCart,
	setCart,
	clearCart,
} from "../Redux/CartSlice";
import { BASE_API_URL } from "../api";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Trash2, ShoppingBag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartManager = () => {
	const { user } = useAuth();
	const token = localStorage.getItem("accessToken");
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.cart.items);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	console.log(cartItems);

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await axios.get(`${BASE_API_URL}/cart`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const items = Array.isArray(res.data) ? res.data : [];
				dispatch(setCart(items));
				setLoading(false);
			} catch (err) {
				console.error("Failed to fetch cart:", err);
				dispatch(setCart([]));
				setLoading(false);
			}
		};

		if (!user?.userId) {
			try {
				const cartFromLocalStorage = JSON.parse(
					localStorage.getItem("cartItems") || "[]"
				);
				const items = Array.isArray(cartFromLocalStorage)
					? cartFromLocalStorage
					: [];
				dispatch(setCart(items));
			} catch (error) {
				console.error("Error parsing cart from localStorage:", error);
				dispatch(setCart([]));
			}
			setLoading(false);
		} else {
			fetchCart();
		}
	}, [user?.userId, token, dispatch]);

	const handleAdd = async (product) => {
		try {
			const res = await axios.post(
				`${BASE_API_URL}/cart`,
				{ productId: product.id, quantity: 1 },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			dispatch(addToCart(res.data));
		} catch (err) {
			console.error("Error adding to cart:", err);
		}
	};

	const handleRemove = async (productId) => {
		try {
			const res = await axios.delete(`${BASE_API_URL}/cart/${productId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const items = Array.isArray(res.data) ? res.data : [];
			dispatch(setCart(items));
		} catch (err) {
			console.error("Error removing from cart:", err);
		}
	};

	const handleClearCart = async () => {
		try {
			await axios.delete(`${BASE_API_URL}/cart`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			dispatch(clearCart());
		} catch (err) {
			console.error("Error clearing cart:", err);
		}
	};

	const updateQuantity = async (productId, newQuantity) => {
		console.log(newQuantity);

		if (newQuantity < 1) {
			return handleRemove(productId);
		}

		try {
			const res = await axios.patch(
				`${BASE_API_URL}/cart/${productId}`,
				{ quantity: newQuantity },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			dispatch(addToCart(res.data));
		} catch (err) {
			console.error("Error updating quantity:", err);
		}
	};

	const totalPrice = Array.isArray(cartItems)
		? cartItems.reduce(
				(total, item) => total + item.product.price * item.quantity,
				0
		  )
		: 0;

	return (
		<div className="max-w-5xl mx-auto bg-[#F9FAFB] shadow-md rounded-xl overflow-hidden mt-24">
			<div className="bg-[#111827] text-[#F9FAFB] py-4 px-6">
				<h2 className="text-2xl  tracking-tight flex items-center">
					<ShoppingBag className="mr-3 text-[#6366F1]" />
					Shopping Cart ({Array.isArray(cartItems) ? cartItems.length : 0})
				</h2>
			</div>

			{loading ? (
				<div className="p-12 text-center">
					<p className="text-[#111827] ">Loading your cart...</p>
				</div>
			) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
				<div className="p-12 text-center">
					<p className="text-[#111827]  text-lg">
						Your cart is currently empty.
					</p>
					<button
						onClick={() => navigate("/dashboard")}
						className="mt-4 bg-[#6366F1] text-[#F9FAFB] px-6 py-2 rounded-lg "
					>
						Continue Shopping
					</button>
				</div>
			) : (
				<>
					<div className="px-6 py-4 hidden md:grid md:grid-cols-12 border-b border-[#6366F1]/10  text-[#111827]/70">
						<div className="col-span-5">Product</div>
						<div className="col-span-2 text-center">Price</div>
						<div className="col-span-3 text-center">Quantity</div>
						<div className="col-span-2 text-center">Total</div>
					</div>
					<div className="divide-y divide-[#6366F1]/10">
						{cartItems.map((item) => (
							<div
								key={item.product.id}
								className="p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center"
							>
								{/* Product */}
								<div className="md:col-span-5 flex items-center space-x-4 mb-4 md:mb-0">
									<img
										src={item.product.image[0]}
										alt={item.product.name}
										className="w-16 h-16 rounded-lg object-cover border border-[#6366F1]/20"
										onClick={() => navigate(`/products/${item.product.id}`)}
									/>
									<h3
										className=" text-[#111827] truncate cursor-pointer"
										onClick={() => navigate(`/products/${item.product.id}`)}
									>
										{item.product.name}
									</h3>
								</div>

								{/* Price */}
								<div className="md:col-span-2 text-[#6366F1]  font-bold text-center">
									${item.product.price}
								</div>

								{/* Quantity */}
								<div className="md:col-span-3 flex justify-center items-center my-4 md:my-0">
									<div className="flex border border-[#6366F1]/30 rounded-lg overflow-hidden">
										<button
											className="bg-[#111827] text-[#F9FAFB] px-3 py-1"
											onClick={() =>
												updateQuantity(item.product.id, item.quantity - 1)
											}
										>
											-
										</button>
										<span className="w-10 text-center py-1 ">
											{item.quantity}
										</span>
										<button
											className="bg-[#111827] text-[#F9FAFB] px-3 py-1"
											onClick={() =>
												updateQuantity(item.product.id, item.quantity + 1)
											}
										>
											+
										</button>
									</div>
								</div>

								{/* Total + Remove */}
								<div className="md:col-span-2 flex items-center justify-between md:justify-center">
									<span className=" text-[#111827] font-bold">
										${(item.product.price * item.quantity).toFixed(2)}
									</span>
									<button
										onClick={() => handleRemove(item.product.id)}
										className="ml-4 p-2 text-[#111827] hover:text-[#6366F1] transition-colors"
									>
										<Trash2 size={18} />
									</button>
								</div>
							</div>
						))}
					</div>

					<div className="bg-[#F9FAFB] p-6 border-t border-[#6366F1]/20">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between">
							<div className="mb-4 md:mb-0">
								<button
									className=" bg-[#111827] text-[#F9FAFB] py-2 px-4 rounded-lg mr-4 hover:bg-[#111827]/80"
									onClick={handleClearCart}
								>
									Clear Cart
								</button>
							</div>

							<div className="bg-[#F9FAFB] p-4 rounded-lg border border-[#6366F1]/20 md:w-64">
								<div className="flex justify-between items-center mb-3">
									<span className=" text-[#111827]">Total:</span>
									<span className=" text-[#6366F1] text-xl font-bold">
										${totalPrice.toFixed(2)}
									</span>
								</div>
								<button
									className="w-full bg-[#6366F1] text-[#F9FAFB]  py-3 rounded-lg hover:bg-[#6366F1]/90 flex items-center justify-center"
									onClick={() => navigate("/checkout")}
								>
									Checkout
									<ChevronRight className="ml-2 h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default CartManager;
