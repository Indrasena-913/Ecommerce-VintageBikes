import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../api.jsx";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleWishlist } from "./AddtoWishList.jsx";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice.js";
import toast from "react-hot-toast";

const Dashboard = () => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [categories, setCategories] = useState([]);

	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("");
	const [priceRange, setPriceRange] = useState([0, 10000]);
	const [yearRange, setYearRange] = useState([1960, 2025]);
	const [isWishlistLoading, setIsWishlistLoading] = useState(false);
	const [likedProducts, setLikedProducts] = useState([]);

	const [sortBy, setSortBy] = useState("price");
	const [currentPage, setCurrentPage] = useState(1);
	const productsPerPage = 8;
	const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
	const startIndex = (currentPage - 1) * productsPerPage;
	const endIndex = startIndex + productsPerPage;
	const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchProductsAndCategories = async () => {
			try {
				const token = localStorage.getItem("accessToken");

				const productResponse = await axios.get(`${BASE_API_URL}/products`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				setProducts(productResponse.data);
				console.log(productResponse.data);

				setFilteredProducts(productResponse.data);

				const categoryResponse = await axios.get(`${BASE_API_URL}/categories`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				setCategories(categoryResponse.data);
				console.log(categoryResponse);
			} catch (error) {
				console.error("Error fetching products or categories:", error);
			}
		};

		fetchProductsAndCategories();
		setCurrentPage(1);
	}, []);

	useEffect(() => {
		const fetchWishlist = async () => {
			const token = localStorage.getItem("accessToken");
			if (!token) return;
			const response = localStorage.getItem("user");
			const user = JSON.parse(response);

			const res = await axios.get(`${BASE_API_URL}/wishlist/${user.userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(res);

			const likedIds = res.data?.map((item) => item.productId);
			console.log("Likedids", likedIds);

			setLikedProducts(likedIds || []);
		};

		fetchWishlist();
	}, []);

	useEffect(() => {
		let updatedProducts = [...products];

		if (searchQuery) {
			updatedProducts = updatedProducts.filter((product) =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (selectedCategory) {
			updatedProducts = updatedProducts.filter(
				(product) => product.category.name === selectedCategory
			);
		}

		updatedProducts = updatedProducts.filter(
			(product) =>
				product.price >= priceRange[0] && product.price <= priceRange[1]
		);

		updatedProducts = updatedProducts.filter(
			(product) =>
				product.modelYear >= yearRange[0] && product.modelYear <= yearRange[1]
		);

		if (sortBy === "price_asc") {
			updatedProducts.sort((a, b) => a.price - b.price);
		} else if (sortBy === "price_desc") {
			updatedProducts.sort((a, b) => b.price - a.price);
		} else if (sortBy === "year_asc") {
			updatedProducts.sort((a, b) => a.modelYear - b.modelYear);
		} else if (sortBy === "year_desc") {
			updatedProducts.sort((a, b) => b.modelYear - a.modelYear);
		}

		setFilteredProducts(updatedProducts);
		setCurrentPage(1);
	}, [searchQuery, selectedCategory, priceRange, yearRange, sortBy, products]);

	const handleWishlistClick = async (productId) => {
		setIsWishlistLoading(true);
		const result = await toggleWishlist(productId);
		setIsWishlistLoading(false);

		if (result?.success) {
			if (result?.action === "removed") {
				setLikedProducts((prev) => prev.filter((id) => id !== productId));
			} else if (result?.action === "added") {
				setLikedProducts((prev) => [...prev, productId]);
			}
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
			toast.success("Product added to Cart");
			console.log("Product added to cart successfully!");
		} catch (error) {
			console.error("Error adding product to cart:", error);
		}
	};

	return (
		<div className="flex flex-col min-h-screen mt-24 z-50">
			<div className="flex-1 p-4 sm:p-6">
				<div className="mb-6 flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0 -mt-10">
					<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
						<input
							type="text"
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-auto"
						/>

						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="border border-gray-300 px-4 py-2 rounded-lg w-full sm:w-auto"
						>
							<option value="">Select Category</option>
							{categories.map((category) => (
								<option key={category.id} value={category.name}>
									{category.name}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
						<input
							type="range"
							min={0}
							max={10000}
							value={priceRange[1]}
							onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
							className="w-full sm:w-40"
						/>
						<span className="text-gray-500 text-sm">
							Price: ${priceRange[0]} - ${priceRange[1]}
						</span>
					</div>
				</div>

				<div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
					<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
						<input
							type="range"
							min={1900}
							max={2025}
							value={yearRange[1]}
							onChange={(e) => setYearRange([yearRange[0], e.target.value])}
							className="w-full sm:w-40"
						/>
						<span className="text-gray-500 text-sm">
							Year: {yearRange[0]} - {yearRange[1]}
						</span>
					</div>

					<div>
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="border px-3 py-2 rounded-lg shadow-sm w-full md:w-auto"
						>
							<option value="">Sort by</option>
							<option value="price_asc">Price: Low to High</option>
							<option value="price_desc">Price: High to Low</option>
							<option value="year_asc">Year: Old to New</option>
							<option value="year_desc">Year: New to Old</option>
						</select>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{paginatedProducts.map((product) => (
						<div
							key={product.id}
							className="bg-[#F5EBDD] rounded-2xl shadow-md overflow-hidden transition hover:scale-[1.02] flex flex-col"
						>
							<img
								src={product.image[0]}
								alt={product.name}
								className="h-48 w-full object-cover"
								onClick={() => navigate(`/products/${product.id}`)}
							/>
							<div className="p-4 flex flex-col justify-between flex-grow">
								<h3 className="text-xl font-semibold text-[#5E3A1D] mb-1">
									{product.name}
								</h3>
								<div className="flex flex-wrap  mb-3 justify-center mt-2">
									<span className="text-[#D2691E] font-semibold text-md px-2 py-1 rounded-full">
										{product.category.name}
									</span>
									<span className="text-[#D2691E] font-bold  text-md px-2 py-1 rounded-full">
										{product.modelYear}
									</span>
								</div>
								<p className="text-sm text-gray-500 mb-3 text-left line-clamp-3">
									{product.description}
								</p>
								<div className="flex justify-between items-center">
									<div>
										<p className="text-[#D2691E] font-bold text-lg">
											₹{product.price.toLocaleString()}
										</p>
										<p className="text-yellow-600 text-sm">
											{Array.from({ length: 5 }, (_, index) =>
												index < product.rating ? "★" : "☆"
											)}
										</p>
									</div>

									<button
										className=" bg-white p-1.5 rounded-full shadow-md transition-all duration-200 hover:scale-110"
										onClick={() => handleWishlistClick(product.id)}
										disabled={isWishlistLoading}
									>
										<Heart
											className={`h-5 w-5 ${
												likedProducts.includes(product.id)
													? "fill-red-500 text-red-500"
													: "text-gray-400"
											}`}
										/>
									</button>
								</div>

								<button
									className="mt-3 bg-[#D2691E] text-white px-4 py-2 rounded-full hover:bg-[#a75d2a] w-full"
									onClick={() => handleAddToCart(product)}
								>
									Add to Cart
								</button>
							</div>
						</div>
					))}
				</div>

				{/* Pagination */}
				<div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
					{currentPage > 1 && (
						<button
							onClick={() => setCurrentPage(currentPage - 1)}
							className="px-4 py-2 bg-[#D2691E] text-white rounded-full hover:bg-[#a75d2a]"
						>
							Prev
						</button>
					)}

					<span className="text-[#5E3A1D] font-semibold">
						Page {currentPage} of {totalPages}
					</span>

					{currentPage < totalPages && (
						<button
							onClick={() => setCurrentPage(currentPage + 1)}
							className="px-4 py-2 bg-[#D2691E] text-white rounded-full hover:bg-[#a75d2a]"
						>
							Next
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
