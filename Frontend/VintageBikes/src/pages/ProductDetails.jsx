import { useEffect, useState, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Heart,
	Star,
	StarHalf,
	ShoppingCart,
	ChevronRight,
} from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "../api";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";
import { toggleWishlist } from "./AddtoWishList.jsx";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductSkeleton = () => (
	<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12 animate-pulse">
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
			{/* Image Gallery Skeleton */}
			<div className="flex flex-col gap-4">
				<div className="bg-gray-200 rounded-2xl w-full h-96"></div>
				<div className="flex gap-3 overflow-x-auto">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-20 w-28 rounded-xl bg-gray-200 flex-shrink-0"
						></div>
					))}
				</div>
			</div>

			{/* Product Info Skeleton */}
			<div className="flex flex-col gap-6">
				<div className="flex justify-between items-start">
					<div className="w-3/4">
						<div className="h-8 bg-gray-200 rounded-md w-full"></div>
						<div className="h-4 bg-gray-200 rounded-md w-1/2 mt-2"></div>
					</div>
					<div className="h-6 w-6 bg-gray-200 rounded-full"></div>
				</div>

				<div className="flex gap-2">
					<div className="h-6 w-20 bg-gray-200 rounded-full"></div>
					<div className="h-6 w-24 bg-gray-200 rounded-full"></div>
				</div>

				<div className="space-y-2">
					<div className="h-4 bg-gray-200 rounded-md w-full"></div>
					<div className="h-4 bg-gray-200 rounded-md w-full"></div>
					<div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
				</div>

				<div className="h-8 bg-gray-200 rounded-md w-32"></div>
				<div className="h-12 bg-gray-200 rounded-full w-40"></div>

				<div className="mt-6">
					<div className="h-6 bg-gray-200 rounded-md w-40 mb-4"></div>
					<div className="space-y-3">
						{[1, 2, 3].map((i) => (
							<div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>
						))}
					</div>
				</div>
			</div>
		</div>

		{/* Related Products Skeleton */}
		<div className="mt-12">
			<div className="h-8 bg-gray-200 rounded-md w-48 mb-6"></div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{[1, 2, 3, 4].map((i) => (
					<div key={i} className="bg-gray-100 rounded-xl p-4 shadow">
						<div className="h-40 bg-gray-200 rounded-lg mb-2"></div>
						<div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
						<div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
					</div>
				))}
			</div>
		</div>
	</div>
);

const ProductDetails = ({ count, setCount }) => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [mainImage, setMainImage] = useState("");
	const [liked, setLiked] = useState(false);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const [isWishlistLoading, setIsWishlistLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const token = localStorage.getItem("accessToken");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchProduct = async () => {
			setIsLoading(true);
			try {
				const res = await axios.get(`${BASE_API_URL}/products/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setProduct(res.data);
				setMainImage(res.data.image[0]);
				document.title = `${res.data.name} | Vintage Bikes`;
			} catch (err) {
				console.error("Failed to fetch product:", err);
				toast.error("Failed to load product details");
			} finally {
				setTimeout(() => setIsLoading(false), 300);
			}
		};
		fetchProduct();
	}, [id]);

	useEffect(() => {
		const checkWishlistStatus = async () => {
			const token = localStorage.getItem("accessToken");
			if (!token) return;
			const response = localStorage.getItem("user");
			const user = JSON.parse(response);

			try {
				const res = await axios.get(`${BASE_API_URL}/wishlist/${user.userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const likedIds = res.data?.map((item) => item.productId);
				setLiked(likedIds?.includes(Number(id)) || false);
			} catch (error) {
				console.error("Error fetching wishlist:", error);
			}
		};

		checkWishlistStatus();
	}, [id]);

	useEffect(() => {
		const fetchRelatedProducts = async () => {
			try {
				const res = await axios.get(`${BASE_API_URL}/products`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const allProducts = res.data;
				const currentIndex = allProducts.findIndex((p) => p.id === Number(id));

				if (currentIndex !== -1 && currentIndex + 1 < allProducts.length) {
					const nextProducts = allProducts.slice(
						currentIndex + 1,
						currentIndex + 5
					);
					setRelatedProducts(nextProducts);
				} else {
					setRelatedProducts([]);
				}
			} catch (err) {
				console.error("Error fetching related products:", err);
			}
		};
		fetchRelatedProducts();
	}, [id]);

	const handleWishlistToggle = async () => {
		setIsWishlistLoading(true);
		const result = await toggleWishlist(Number(id));
		setIsWishlistLoading(false);

		if (result?.success) {
			setLiked(!liked);
		}
		if (result?.action === "removed") {
			setCount(count - 1);
		} else if (result?.action === "added") {
			setCount(count + 1);
		}
	};

	const handleAddToCart = async (product) => {
		const token = localStorage.getItem("accessToken");

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
			toast.success("Product added to Cart");
		} catch (error) {
			console.error("Error adding product to cart:", error);
			toast.error("Failed to add product to cart");
		}
	};

	if (isLoading) return <ProductSkeleton />;
	if (!product)
		return <div className="text-center p-10">Product not found</div>;

	const renderRating = (rating) => {
		return (
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => (
					<span key={i}>
						{i < Math.floor(rating) ? (
							<Star className="w-4 h-4 fill-black text-black" />
						) : i < rating ? (
							<StarHalf className="w-4 h-4 fill-black text-black" />
						) : (
							<Star className="w-4 h-4 text-gray-300" />
						)}
					</span>
				))}
				<span className="ml-1 text-sm text-gray-600">
					({rating.toFixed(1)})
				</span>
			</div>
		);
	};

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
			{/* Breadcrumb */}
			<div className="flex items-center text-sm text-gray-500 mb-6">
				<span
					className="hover:text-black cursor-pointer"
					onClick={() => navigate("/dashboard")}
				>
					Home
				</span>
				<ChevronRight className="w-4 h-4 mx-1" />

				<span className="text-black font-medium truncate max-w-xs">
					{product.name}
				</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<div className="flex flex-col gap-4">
					<img
						src={mainImage}
						alt={product.name}
						className="rounded-2xl w-full max-h-96 object-cover shadow-lg"
					/>
					<div className="flex gap-3 overflow-x-auto flex-nowrap scrollbar-hide">
						{product.image.map((img, i) => (
							<img
								key={i}
								src={img}
								alt={`thumb-${i}`}
								onClick={() => setMainImage(img)}
								className={`h-16 w-20 sm:h-20 sm:w-28 rounded-xl cursor-pointer object-cover flex-shrink-0 border-2 ${
									mainImage === img ? "border-black" : "border-transparent"
								}`}
							/>
						))}
					</div>
				</div>

				{/* Product Info */}
				<div className="flex flex-col gap-6">
					<div className="flex justify-between items-start">
						<div>
							<h1 className="text-3xl font-bold text-black tracking-tight">
								{product.name}
							</h1>
							<p className="text-sm text-gray-600 mt-1">
								Model Year:{" "}
								<span className="font-medium">{product.modelYear}</span>
							</p>
						</div>
						<button
							onClick={handleWishlistToggle}
							disabled={isWishlistLoading}
							className={`p-2 rounded-full ${
								liked ? "bg-gray-100" : "hover:bg-gray-100"
							} transition-colors`}
							aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
						>
							<Heart
								className={`w-6 h-6 transition-colors ${
									liked
										? "fill-black text-black"
										: "text-gray-400 hover:text-black"
								}`}
							/>
						</button>
					</div>

					<div className="flex flex-wrap gap-2">
						<span className="border border-black text-black text-xs font-medium px-3 py-1 rounded-full">
							{product.category.name}
						</span>
						<span
							className={`bg-gray-100 text-black text-xs font-medium px-3 py-1 rounded-full ${
								product.stock > 5 ? "" : "text-red-600"
							}`}
						>
							{product.stock > 0
								? `In Stock: ${product.stock}`
								: "Out of Stock"}
						</span>
					</div>

					<p className="text-gray-700 text-base leading-relaxed border-b border-gray-200 pb-6">
						{product.description}
					</p>

					<div className="flex justify-between items-center">
						<div>
							<p className="text-black text-3xl font-bold">
								${product.price.toLocaleString()}
							</p>
							<div className="mt-1">{renderRating(product.rating)}</div>
						</div>

						<button
							onClick={() => handleAddToCart(product)}
							disabled={product.stock === 0}
							className={`flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors ${
								product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							<ShoppingCart className="w-5 h-5" />
							<span>Add to Cart</span>
						</button>
					</div>

					{/* Reviews */}
					<div className="mt-8">
						<h2 className="text-xl font-semibold mb-4 text-black">
							Customer Reviews
						</h2>
						<div className="space-y-3">
							{product.reviews.length > 0 ? (
								product.reviews.map((review, i) => (
									<div
										key={i}
										className="bg-gray-50 rounded-lg p-4 border border-gray-200"
									>
										<p className="text-gray-700">{review}</p>
									</div>
								))
							) : (
								<p className="text-gray-500 italic">No reviews yet</p>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<div className="mt-16">
					<h2 className="text-2xl font-bold text-black mb-6 pb-2 border-b border-gray-200">
						You Might Also Like
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{relatedProducts.map((rp) => (
							<div
								key={rp.id}
								className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100"
							>
								<div className="h-48 overflow-hidden relative">
									{/* Fixed image link to properly navigate to the product page */}
									<img
										src={rp.image[0]}
										alt={rp.name}
										className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
										onClick={() => navigate(`/products/${rp.id}`)}
									/>
								</div>
								<div className="p-4">
									<h3
										className="text-lg font-semibold text-black truncate cursor-pointer hover:text-gray-700"
										onClick={() => navigate(`/products/${rp.id}`)}
									>
										{rp.name}
									</h3>
									<div className="flex justify-between items-center mt-2">
										<p className="text-black font-medium">
											${rp.price.toLocaleString()}
										</p>
										<button
											onClick={() => handleAddToCart(rp)}
											className="bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors"
											aria-label="Add to cart"
										>
											<ShoppingCart className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetails;
