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
import { Trash2 } from "lucide-react";
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
		<div className="max-w-4xl mx-auto bg-[#F5EBDD] shadow-lg rounded-lg p-6 vintage-cart-container mt-24">
			<h2 className="text-2xl font-serif text-brown-800 border-b pb-2 mb-4">
				🛒 Your Cart ({Array.isArray(cartItems) ? cartItems.length : 0} items)
			</h2>

			{loading ? (
				<p className="text-gray-500 text-center">Loading...</p>
			) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
				<p className="text-gray-500 text-center">Your cart is empty.</p>
			) : (
				<div className="space-y-4">
					{cartItems.map((item) => (
						<div
							key={item.product.id}
							className="flex flex-col sm:flex-row items-center gap-4 border-b pb-3 last:border-0 vintage-cart-item"
						>
							<img
								src={item.product.image[0]}
								alt={item.product.name}
								className="w-16 h-16 object-contain rounded-md vintage-cart-image cursor-pointer sm:w-24 sm:h-24"
								onClick={() => navigate(`/products/${item.product.id}`)}
							/>
							<div className="flex-1 flex flex-col sm:flex-row items-center justify-between sm:items-start sm:flex-1">
								<div className="flex-1">
									<h3 className="text-lg font-serif text-gray-900 vintage-cart-item-name">
										{item.product.name}
									</h3>
									<p className="text-brown-700 font-bold">
										${item.product.price}
									</p>
								</div>
								<div className="flex items-center gap-2 mt-2 sm:mt-0">
									<button
										className="bg-black font-medium text-white px-3 py-1 rounded-l vintage-cart-button"
										onClick={() =>
											updateQuantity(item.product.id, item.quantity - 1)
										}
									>
										-
									</button>
									<span className="w-10 text-center bg-gray-100 py-1 font-semibold text-lg vintage-quantity">
										{item.quantity}
									</span>
									<button
										className="bg-black font-medium text-white px-3 py-1 rounded-r vintage-cart-button"
										onClick={() =>
											updateQuantity(item.product.id, item.quantity + 1)
										}
									>
										+
									</button>
								</div>
							</div>
							<button
								onClick={() => handleRemove(item.product.id)}
								className="p-2 rounded-md hover:bg-red-100 vintage-cart-delete"
							>
								<Trash2 className="text-red-500 hover:text-red-700" />
							</button>
						</div>
					))}
				</div>
			)}

			{Array.isArray(cartItems) && cartItems.length > 0 && (
				<div className="mt-6 border-t pt-4">
					<h3 className="text-lg font-serif text-gray-900">
						Total:{" "}
						<span className="text-brown-700">${totalPrice.toFixed(2)}</span>
					</h3>
					<div className="flex flex-col sm:flex-row gap-2 mt-3">
						<button
							className="bg-red-500 text-white font-serif py-3 px-4 rounded-md hover:bg-red-600 vintage-clear-button"
							onClick={handleClearCart}
						>
							Clear Cart
						</button>
						<button
							className="flex-1 bg-yellow-500 text-black font-serif py-3 rounded-md hover:bg-yellow-600 vintage-checkout-button"
							onClick={() => navigate("/checkout")}
						>
							Proceed to Checkout
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default CartManager;
