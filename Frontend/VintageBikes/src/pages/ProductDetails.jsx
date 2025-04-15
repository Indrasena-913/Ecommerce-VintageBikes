import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart } from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "../api";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice";
import toast from "react-hot-toast";

const ProductDetails = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [mainImage, setMainImage] = useState("");
	const [liked, setLiked] = useState(false);
	const [relatedProducts, setRelatedProducts] = useState([]);
	const token = localStorage.getItem("accessToken");
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await axios.get(`${BASE_API_URL}/products/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setProduct(res.data);
				setMainImage(res.data.image[0]);
				document.title = `${res.data.name} | Vintage Bikes`;
			} catch (err) {
				console.error("Failed to fetch product:", err);
			}
		};
		fetchProduct();
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

	const handleWishlistToggle = () => {
		setLiked(!liked);
		toast.info(liked ? "Removed from Wishlist" : "Added to Wishlist", {
			autoClose: 1000,
		});
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
			toast.success("Product added to Cart");
		} catch (error) {
			console.error("Error adding product to cart:", error);
		}
	};

	if (!product) return <div className="text-center p-10">Loading...</div>;

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
				{/* Image Gallery */}
				<div className="flex flex-col gap-4">
					<img
						src={mainImage}
						alt={product.name}
						className="rounded-2xl w-full max-h-[400px] object-cover shadow-lg"
					/>
					<div className="flex gap-3 overflow-x-auto flex-nowrap scrollbar-hide">
						{product.image.map((img, i) => (
							<img
								key={i}
								src={img}
								alt={`thumb-${i}`}
								onClick={() => setMainImage(img)}
								className={`h-16 w-20 sm:h-20 sm:w-28 rounded-xl cursor-pointer object-cover flex-shrink-0 border-2 ${
									mainImage === img ? "border-[#D2691E]" : "border-transparent"
								}`}
							/>
						))}
					</div>
				</div>

				{/* Product Info */}
				<div className="flex flex-col gap-6">
					<div className="flex justify-between items-start">
						<div>
							<h1 className="text-3xl font-bold text-[#5E3A1D]">
								{product.name}
							</h1>
							<p className="text-sm text-gray-600 mt-1">
								Model Year:{" "}
								<span className="font-medium">{product.modelYear}</span>
							</p>
						</div>
						<button onClick={handleWishlistToggle}>
							<Heart
								className={`w-6 h-6 transition ${
									liked ? "fill-red-500 text-red-500" : "text-gray-400"
								}`}
							/>
						</button>
					</div>

					<div className="flex flex-wrap gap-2">
						<span className="border-[#D2691E] border-2 text-gray-700 text-sm px-3 py-1 rounded-full">
							{product.category.name}
						</span>
						<span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
							In Stock: {product.stock}
						</span>
					</div>

					<p className="text-gray-700 text-base leading-relaxed">
						{product.description}
					</p>

					<div>
						<p className="text-[#D2691E] text-2xl font-bold">
							₹{product.price.toLocaleString()}
						</p>
						<p className="text-yellow-600 text-lg">
							{Array.from({ length: 5 }, (_, i) =>
								i < product.rating ? "★" : "☆"
							).join("")}
						</p>
					</div>

					<button
						onClick={() => handleAddToCart(product)}
						className="mt-2 bg-[#D2691E] text-white px-6 py-3 rounded-full hover:bg-[#a75d2a] transition"
					>
						Add to Cart
					</button>

					{/* Reviews */}
					<div className="mt-6">
						<h2 className="text-xl font-semibold mb-2 text-[#5E3A1D]">
							Customer Reviews
						</h2>
						<table className="w-full border border-gray-200 rounded-xl overflow-hidden">
							<tbody>
								{product.reviews.map((review, i) => (
									<tr key={i} className="border-b border-gray-100">
										<td className="px-4 py-3 text-gray-700 border-2 border-[#cc6b0a]">
											{review}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Related Products */}
			{relatedProducts.length > 0 && (
				<div className="mt-12">
					<h2 className="text-2xl font-semibold text-[#5E3A1D] mb-4">
						Related Products
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{relatedProducts.map((rp) => (
							<div
								key={rp.id}
								className="bg-[#F5EBDD] rounded-xl p-4 shadow hover:scale-[1.02] transition"
							>
								<img
									src={rp.image[0]}
									alt={rp.name}
									onClick={() => navigate(`/products/${rp.id}`)}
									className="w-full h-40 sm:h-32 object-cover rounded-lg mb-2 cursor-pointer"
								/>
								<h3 className="text-lg font-semibold text-[#5E3A1D]">
									{rp.name}
								</h3>
								<p className="text-[#D2691E] font-medium">
									₹{rp.price.toLocaleString()}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetails;
