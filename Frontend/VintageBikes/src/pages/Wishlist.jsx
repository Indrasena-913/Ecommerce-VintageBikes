import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { BASE_API_URL } from "../api";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice.js";
import toast from "react-hot-toast";

const LazyImage = ({ src, alt, onClick }) => {
	const [loaded, setLoaded] = useState(false);

	return (
		<div className="relative w-full aspect-square bg-gray-100 rounded-md overflow-hidden">
			{!loaded && (
				<div className="absolute inset-0 animate-pulse bg-gray-200"></div>
			)}
			<img
				src={src}
				alt={alt}
				className={`w-full h-full object-cover transition-opacity duration-300 ${
					loaded ? "opacity-100" : "opacity-0"
				}`}
				onLoad={() => setLoaded(true)}
				onClick={onClick}
			/>
		</div>
	);
};

const WishlistSkeleton = () => {
	return (
		<>
			{[1, 2, 3, 4, 5, 6].map((item) => (
				<div
					key={item}
					className="flex flex-col h-full border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
				>
					<div className="w-full aspect-square bg-gray-100 rounded-md animate-pulse mb-3"></div>
					<div className="h-5 bg-gray-100 rounded animate-pulse mb-2"></div>
					<div className="h-4 bg-gray-100 rounded animate-pulse mb-2 w-1/2"></div>
					<div className="h-5 bg-gray-100 rounded animate-pulse mb-3 w-1/4"></div>
					<div className="h-8 bg-gray-100 rounded animate-pulse mt-auto"></div>
				</div>
			))}
		</>
	);
};

const EmptyWishlist = () => {
	const navigate = useNavigate();

	return (
		<div className="col-span-full flex flex-col items-center justify-center py-8 px-4">
			<Heart size={48} className="text-gray-300 mb-3" />
			<h3 className="text-lg font-medium text-gray-900 mb-2">
				Your wishlist is empty
			</h3>
			<p className="text-gray-500 mb-4 text-center text-sm">
				Items you save to your wishlist will appear here
			</p>
			<button
				onClick={() => navigate("/products")}
				className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-all duration-200 text-sm"
			>
				Explore Products
			</button>
		</div>
	);
};

const Wishlist = ({ count, setCount }) => {
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);
	const [value, setValue] = useState(0);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const response = localStorage.getItem("user");
	const user = JSON.parse(response);

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const token = localStorage.getItem("accessToken");

				if (!token) {
					setLoading(false);
					return;
				}

				if (!user?.userId) {
					console.log("User ID not found");
					setLoading(false);
					return;
				}

				const resp = await axios.get(
					`${BASE_API_URL}/wishlist/${user.userId}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				setWishlist(resp.data || []);
			} catch (error) {
				console.error("Error fetching wishlist:", error);
			} finally {
				setLoading(false);
			}
		};

		if (user?.userId) {
			fetchWishlist();
		} else {
			setLoading(false);
		}
	}, [value, user?.userId]);

	const removeFromWishlist = async (productId, event) => {
		event.stopPropagation();

		try {
			const token = localStorage.getItem("accessToken");
			if (!token) return;

			setWishlist(wishlist.filter((item) => item.productId !== productId));

			const response = await axios.delete(
				`${BASE_API_URL}/wishlist/${productId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					data: { productId, userId: user.userId },
				}
			);

			if (response) {
				setCount((prev) => prev - 1);
				toast.success("Item removed from wishlist");
				setValue((prev) => prev + 1);
			}
		} catch (error) {
			console.error("Error removing from wishlist:", error);
			toast.error("Failed to remove item");
			setValue((prev) => prev + 1);
		}
	};

	const handleAddToCart = async (product, event) => {
		event.stopPropagation();

		try {
			const token = localStorage.getItem("accessToken");

			if (!token) {
				toast.error("Please login to add items to cart");
				navigate("/login");
				return;
			}

			dispatch(addToCart({ product, quantity: 1 }));
			toast.success("Added to cart");

			await axios.post(
				`${BASE_API_URL}/cart`,
				{
					productId: product.id,
					quantity: 1,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
		} catch (error) {
			console.error("Error adding product to cart:", error);
			toast.error("Failed to add to cart");
		}
	};

	const navigateToProduct = (productId) => {
		navigate(`/products/${productId}`);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 mt-10">
			<h1 className="text-2xl font-bold text-gray-900 mb-4">My Wishlist</h1>

			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					<WishlistSkeleton />
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{wishlist.length === 0 ? (
						<EmptyWishlist />
					) : (
						wishlist.map((item) => (
							<div
								key={item.productId}
								onClick={() => navigateToProduct(item.product.id)}
								className="flex flex-col h-full group relative border border-gray-200 p-3 rounded-lg shadow-sm bg-white hover:shadow-md transition-all duration-300 cursor-pointer"
							>
								{/* Remove button */}
								<button
									onClick={(e) => removeFromWishlist(item.productId, e)}
									className="absolute top-2 right-2 z-10 bg-white text-gray-700 hover:text-red-500 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all duration-200"
									aria-label="Remove from wishlist"
								>
									<Trash2 size={16} />
								</button>

								<div className="w-full">
									<Suspense
										fallback={
											<div className="w-full aspect-square bg-gray-100 rounded-md animate-pulse"></div>
										}
									>
										<LazyImage
											src={item.product.image[0]}
											alt={item.product.name}
										/>
									</Suspense>
								</div>

								<div className="mt-3 flex flex-col flex-grow">
									<h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
										{item.product.name}
									</h3>
									<p className="text-xs text-gray-500 mb-1">
										{item.product.modelYear}
									</p>
									<p className="text-sm font-bold text-gray-900 mb-2">
										${item.product.price.toLocaleString()}
									</p>

									<button
										onClick={(e) => handleAddToCart(item.product, e)}
										className="flex items-center justify-center w-full bg-black text-white py-1.5 px-2 rounded-md hover:bg-gray-800 transition-all duration-200 gap-1 text-xs mt-auto"
									>
										<ShoppingCart size={14} />
										<span>Add to Cart</span>
									</button>
								</div>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default Wishlist;
