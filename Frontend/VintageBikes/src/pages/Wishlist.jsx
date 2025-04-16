import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../api";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice.js";
import toast from "react-hot-toast";

const Wishlist = ({ count, setCount }) => {
	const [wishlist, setWishlist] = useState([]);
	const [loading, setLoading] = useState(true);

	const [value, setvalue] = useState(0);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const response = localStorage.getItem("user");
	const user = JSON.parse(response);

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const token = localStorage.getItem("accessToken");

				if (!token) return;

				if (!user?.userId) {
					console.log("User ID not found");
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

				console.log(resp);
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
	}, [value]);

	const removeFromWishlist = async (productId) => {
		try {
			const token = localStorage.getItem("accessToken");
			if (!token) return;

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
				setCount(count - 1);
				setvalue(value + 1);
			} else {
				setvalue(value - 1);
			}

			console.log(response.data.message);
		} catch (error) {
			console.error("Error removing from wishlist:", error);
		}
	};

	const handleAddToCart = async (product) => {
		const token = localStorage.getItem("accessToken");
		const user = JSON.parse(localStorage.getItem("user"));

		dispatch(addToCart({ product, quantity: 1 }));

		try {
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
			setCount(count + 1);
			toast.success("Product added to Cart");

			console.log("Product added to cart successfully!");
		} catch (error) {
			console.error("Error adding product to cart:", error);
		}
	};

	if (loading) {
		return <div className="text-center p-10 text-[#111827]">Loading...</div>;
	}

	return (
		<div className="wishlist-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-24">
			{wishlist.length === 0 ? (
				<p className="text-[#111827]">Your wishlist is empty.</p>
			) : (
				wishlist.map((item) => (
					<div
						key={item.productId}
						className="wishlist-card relative border border-[#6366F1]/30 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-[#F9FAFB]"
					>
						{/* Remove from wishlist button */}
						<button
							onClick={() => removeFromWishlist(item.productId)}
							className="absolute top-2 right-2 bg-[#111827] text-[#F9FAFB] rounded-full p-2 hover:bg-[#6366F1] transition-all duration-200"
						>
							<Trash2 />
						</button>

						<img
							src={item.product.image[0]}
							alt={item.product.name}
							className="w-full h-48 object-cover rounded-md mb-4"
							onClick={() => navigate(`/products/${item.id}`)}
						/>
						<h3 className="text-lg font-semibold text-[#111827]">
							{item.product.name}
						</h3>
						<p className="text-[#111827]/70">{item.product.modelYear}</p>
						<p className="text-xl font-bold text-[#6366F1]">
							${item.product.price}
						</p>

						<button
							onClick={() => handleAddToCart(item.product)}
							className="mt-4 bg-[#6366F1] text-[#F9FAFB] py-2 px-4 rounded-md hover:bg-[#6366F1]/80 transition-all duration-200 w-full"
						>
							Add to Cart
						</button>
					</div>
				))
			)}
		</div>
	);
};

export default Wishlist;
