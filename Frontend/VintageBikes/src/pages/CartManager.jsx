import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart, clearCart } from "../Redux/CartSlice";
import { BASE_API_URL } from "../api";
import axios from "axios";
import { Trash2, ShoppingBag, ChevronRight, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LazyImage = ({ src, alt, onClick, className }) => {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);

	return (
		<div
			className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
		>
			{!loaded && !error && (
				<div className="absolute inset-0 animate-pulse bg-gray-200"></div>
			)}
			{error ? (
				<div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
					<ShoppingBag size={24} />
				</div>
			) : (
				<img
					src={src}
					alt={alt}
					className={`w-full h-full object-cover transition-opacity duration-300 ${
						loaded ? "opacity-100" : "opacity-0"
					}`}
					onLoad={() => setLoaded(true)}
					onError={() => setError(true)}
					onClick={onClick}
				/>
			)}
		</div>
	);
};

const CartSkeleton = () => {
	return (
		<div className="divide-y divide-gray-100">
			{[1, 2, 3].map((item) => (
				<div
					key={item}
					className="p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center"
				>
					<div className="md:col-span-5 flex items-center space-x-4 mb-4 md:mb-0">
						<div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse"></div>
						<div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
					</div>
					<div className="md:col-span-2 h-6 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
					<div className="md:col-span-3 h-10 bg-gray-200 rounded animate-pulse w-24 mx-auto my-4 md:my-0"></div>
					<div className="md:col-span-2 flex items-center justify-between md:justify-center">
						<div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
						<div className="ml-4 p-2 h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
					</div>
				</div>
			))}
		</div>
	);
};

const EmptyCart = ({ navigate }) => {
	return (
		<div className="p-12 text-center flex flex-col items-center">
			<ShoppingBag size={64} className="text-gray-300 mb-6" />
			<p className="text-gray-800 text-lg font-medium mb-2">
				Your cart is currently empty
			</p>
			<p className="text-gray-500 mb-6">
				Looks like you haven't added any products to your cart yet
			</p>
			<button
				onClick={() => navigate("/dashboard")}
				className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center"
			>
				Continue Shopping
				<ChevronRight className="ml-2 h-4 w-4" />
			</button>
		</div>
	);
};

const CartManager = () => {
	const token = localStorage.getItem("accessToken");
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.cart.items);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await axios.get(`${BASE_API_URL}/cart`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const items = Array.isArray(res.data) ? res.data : [];
				dispatch(setCart(items));
			} catch (err) {
				console.error("Failed to fetch cart:", err);
				dispatch(setCart([]));
			}
			setLoading(false);
		};

		const loadGuestCart = () => {
			try {
				const cartFromLocalStorage = JSON.parse(
					localStorage.getItem("cartItems") || "[]"
				);
				dispatch(setCart(cartFromLocalStorage));
			} catch (error) {
				console.error("Error parsing cart from localStorage:", error);
				dispatch(setCart([]));
			}
			setLoading(false);
		};

		if (user?.userId) {
			fetchCart();
		} else {
			loadGuestCart();
		}
	}, [user?.userId, token, dispatch]);

	const handleAddToCart = async (product) => {
		if (user?.userId) {
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
		} else {
			const existing = cartItems.find((item) => item.product.id === product.id);
			let updatedCart;
			if (existing) {
				updatedCart = cartItems.map((item) =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			} else {
				updatedCart = [...cartItems, { product, quantity: 1 }];
			}
			localStorage.setItem("cartItems", JSON.stringify(updatedCart));
			dispatch(setCart(updatedCart));
		}
	};

	const handleRemove = async (productId) => {
		if (user?.userId) {
			try {
				const res = await axios.delete(`${BASE_API_URL}/cart/${productId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const items = Array.isArray(res.data) ? res.data : [];
				dispatch(setCart(items));
			} catch (err) {
				console.error("Error removing from cart:", err);
			}
		} else {
			const updatedCart = cartItems.filter(
				(item) => item.product.id !== productId
			);
			localStorage.setItem("cartItems", JSON.stringify(updatedCart));
			dispatch(setCart(updatedCart));
		}
	};

	const handleClearCart = async () => {
		if (user?.userId) {
			try {
				await axios.delete(`${BASE_API_URL}/cart`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				dispatch(clearCart());
			} catch (err) {
				console.error("Error clearing cart:", err);
			}
		} else {
			localStorage.removeItem("cartItems");
			dispatch(clearCart());
		}
	};

	const updateQuantity = async (productId, newQuantity) => {
		if (newQuantity < 1) return handleRemove(productId);

		if (user?.userId) {
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
		} else {
			const updatedCart = cartItems.map((item) =>
				item.product.id === productId
					? { ...item, quantity: newQuantity }
					: item
			);
			localStorage.setItem("cartItems", JSON.stringify(updatedCart));
			dispatch(setCart(updatedCart));
		}
	};

	const totalPrice = Array.isArray(cartItems)
		? cartItems.reduce(
				(total, item) => total + item.product.price * item.quantity,
				0
		  )
		: 0;

	return (
		<div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-12 border border-gray-100">
			<div className="bg-black text-white py-5 px-6">
				<h2 className="text-2xl font-medium tracking-tight flex items-center">
					<ShoppingBag className="mr-3 text-white" />
					Shopping Cart
					<span className="ml-2 text-sm bg-white text-black px-2 py-0.5 rounded-full">
						{Array.isArray(cartItems) ? cartItems.length : 0}
					</span>
				</h2>
			</div>

			{loading ? (
				<CartSkeleton />
			) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
				<EmptyCart navigate={navigate} />
			) : (
				<>
					<div className="px-6 py-4 hidden md:grid md:grid-cols-12 border-b border-gray-100 text-gray-500 font-medium">
						<div className="col-span-5">Product</div>
						<div className="col-span-2 text-center">Price</div>
						<div className="col-span-3 text-center">Quantity</div>
						<div className="col-span-2 text-center">Total</div>
					</div>
					<div className="divide-y divide-gray-100">
						{cartItems.map((item) => (
							<div
								key={item.product.id}
								className="p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center"
							>
								{/* Product */}
								<div className="md:col-span-5 flex items-center space-x-4 mb-4 md:mb-0">
									<Suspense
										fallback={
											<div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
										}
									>
										<LazyImage
											src={item.product.image[0]}
											alt={item.product.name}
											className="w-16 h-16 cursor-pointer"
											onClick={() => navigate(`/products/${item.product.id}`)}
										/>
									</Suspense>
									<div>
										<h3
											className="text-gray-900 font-medium hover:text-black cursor-pointer transition-colors"
											onClick={() => navigate(`/products/${item.product.id}`)}
										>
											{item.product.name}
										</h3>
										<p className="text-sm text-gray-500 mt-1">
											{item.product.modelYear}
										</p>
									</div>
								</div>

								{/* Price */}
								<div className="md:col-span-2 text-gray-900 font-semibold text-center">
									${item.product.price.toLocaleString()}
								</div>

								{/* Quantity */}
								<div className="md:col-span-3 flex justify-center items-center my-4 md:my-0">
									<div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
										<button
											className="bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 transition-colors"
											onClick={() =>
												updateQuantity(item.product.id, item.quantity - 1)
											}
											aria-label="Decrease quantity"
										>
											<Minus size={16} />
										</button>
										<div className="w-12 flex items-center justify-center text-gray-900 font-medium bg-white">
											{item.quantity}
										</div>
										<button
											className="bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 transition-colors"
											onClick={() =>
												updateQuantity(item.product.id, item.quantity + 1)
											}
											aria-label="Increase quantity"
										>
											<Plus size={16} />
										</button>
									</div>
								</div>

								{/* Total + Remove */}
								<div className="md:col-span-2 flex items-center justify-between md:justify-center">
									<span className="text-gray-900 font-bold">
										$
										{(item.product.price * item.quantity).toLocaleString(
											"en-US",
											{ minimumFractionDigits: 2, maximumFractionDigits: 2 }
										)}
									</span>
									<button
										onClick={() => handleRemove(item.product.id)}
										className="ml-4 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50"
										aria-label="Remove item"
									>
										<Trash2 size={18} />
									</button>
								</div>
							</div>
						))}
					</div>

					<div className="bg-gray-50 p-6 border-t border-gray-100">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between">
							<div className="mb-6 md:mb-0">
								<button
									className="bg-white text-gray-700 py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center"
									onClick={handleClearCart}
								>
									<Trash2 size={16} className="mr-2" />
									Clear Cart
								</button>
							</div>

							<div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm md:w-72">
								<div className="flex justify-between items-center mb-4">
									<span className="text-gray-600">Subtotal:</span>
									<span className="text-gray-900 font-semibold">
										$
										{totalPrice.toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								</div>
								<div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
									<span className="text-gray-600">Shipping:</span>
									<span className="text-gray-900">Calculated at checkout</span>
								</div>
								<div className="flex justify-between items-center mb-6">
									<span className="text-gray-900 font-medium">Total:</span>
									<span className="text-black text-xl font-bold">
										$
										{totalPrice.toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})}
									</span>
								</div>
								<button
									className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
									onClick={() => navigate("/checkout")}
								>
									Proceed to Checkout
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
