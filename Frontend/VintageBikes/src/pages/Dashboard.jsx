import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../api.jsx";
import {
	Heart,
	Search,
	Filter,
	ChevronLeft,
	ChevronRight,
	SlidersHorizontal,
	RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleWishlist } from "./AddtoWishList.jsx";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice.js";
import toast from "react-hot-toast";

const Dashboard = ({ count, setCount }) => {
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
	const [showFilters, setShowFilters] = useState(false);

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
				setFilteredProducts(productResponse.data);

				const categoryResponse = await axios.get(`${BASE_API_URL}/categories`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				setCategories(categoryResponse.data);
			} catch (error) {
				console.error("Error fetching products or categories:", error);
				toast.error("Failed to load products. Please try again.");
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

			try {
				const res = await axios.get(`${BASE_API_URL}/wishlist/${user.userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				const likedIds = res.data?.map((item) => item.productId);
				setLikedProducts(likedIds || []);
			} catch (error) {
				console.error("Error fetching wishlist:", error);
			}
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
				setCount(count - 1);
			} else if (result?.action === "added") {
				setLikedProducts((prev) => [...prev, productId]);
				setCount(count + 1);
			}
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

	const resetFilters = () => {
		setSearchQuery("");
		setSelectedCategory("");
		setPriceRange([0, 10000]);
		setYearRange([1960, 2025]);
		setSortBy("price");
		toast.success("Filters have been reset");
	};

	return (
		<div className="min-h-screen bg-[#F9FAFB] pt-16 pb-12">
			<div className="container mx-auto px-4 z-10 relative">
				{/* Header Section */}
				<div className="mb-10 text-center">
					<h1 className="text-4xl font-bold text-[#111827] mb-2">
						Vintage Collection
					</h1>
					<p className="text-[#111827] text-opacity-70 italic">
						Discover timeless classics for your collection
					</p>
				</div>

				{/* Search and Primary Filters */}
				<div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[#111827] border-opacity-10">
					<div className="flex flex-col md:flex-row gap-4 items-center mb-4">
						<div className="relative flex-grow">
							<input
								type="text"
								placeholder="Search motorcycles..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-[#111827] border-opacity-20 focus:border-[#6366F1] focus:outline-none transition-colors"
							/>
							<Search
								className="absolute left-3 top-3 text-[#111827] opacity-70"
								size={20}
							/>
						</div>

						<div className="relative flex-grow md:max-w-xs">
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="w-full pl-4 pr-10 py-3 rounded-lg border-2 border-[#111827] border-opacity-20 focus:border-[#6366F1] focus:outline-none appearance-none transition-colors bg-white"
							>
								<option value="">All Categories</option>
								{categories.map((category) => (
									<option key={category.id} value={category.name}>
										{category.name}
									</option>
								))}
							</select>
							<div className="absolute right-3 top-3 pointer-events-none">
								<Filter size={20} className="text-[#111827] opacity-70" />
							</div>
						</div>

						<div className="flex gap-2">
							<button
								onClick={() => setShowFilters(!showFilters)}
								className="px-4 py-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white transition-colors flex items-center gap-2"
							>
								<SlidersHorizontal size={20} />
								<span>{showFilters ? "Hide Filters" : "More Filters"}</span>
							</button>

							<button
								onClick={resetFilters}
								className="px-4 py-3 rounded-lg bg-white border-2 border-[#6366F1] text-[#6366F1] hover:bg-[#F9FAFB] transition-colors flex items-center gap-2"
								title="Reset all filters"
							>
								<RefreshCw size={20} />
								<span className="hidden md:inline">Reset</span>
							</button>
						</div>
					</div>

					{/* Advanced Filters */}
					{showFilters && (
						<div className="mt-6 pt-6 border-t border-[#111827] border-opacity-10 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="block text-[#111827] font-medium">
									Price Range: ${priceRange[0]} - ${priceRange[1]}
								</label>
								<input
									type="range"
									min={0}
									max={10000}
									value={priceRange[1]}
									onChange={(e) =>
										setPriceRange([priceRange[0], parseInt(e.target.value)])
									}
									className="w-full accent-[#6366F1]"
								/>
								<div className="flex justify-between text-sm text-[#111827] text-opacity-70">
									<span>$0</span>
									<span>$10,000</span>
								</div>
							</div>

							<div className="space-y-2">
								<label className="block text-[#111827] font-medium">
									Year Range: {yearRange[0]} - {yearRange[1]}
								</label>
								<input
									type="range"
									min={1900}
									max={2025}
									value={yearRange[1]}
									onChange={(e) =>
										setYearRange([yearRange[0], parseInt(e.target.value)])
									}
									className="w-full accent-[#6366F1]"
								/>
								<div className="flex justify-between text-sm text-[#111827] text-opacity-70">
									<span>1900</span>
									<span>2025</span>
								</div>
							</div>

							<div className="md:col-span-2">
								<label className="block text-[#111827] font-medium mb-2">
									Sort By
								</label>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									<button
										className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
											sortBy === "price_asc"
												? "bg-[#6366F1] border-[#6366F1] text-white"
												: "border-[#111827] border-opacity-30 text-[#111827] hover:border-[#6366F1]"
										}`}
										onClick={() => setSortBy("price_asc")}
									>
										Price: Low to High
									</button>
									<button
										className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
											sortBy === "price_desc"
												? "bg-[#6366F1] border-[#6366F1] text-white"
												: "border-[#111827] border-opacity-30 text-[#111827] hover:border-[#6366F1]"
										}`}
										onClick={() => setSortBy("price_desc")}
									>
										Price: High to Low
									</button>
									<button
										className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
											sortBy === "year_asc"
												? "bg-[#6366F1] border-[#6366F1] text-white"
												: "border-[#111827] border-opacity-30 text-[#111827] hover:border-[#6366F1]"
										}`}
										onClick={() => setSortBy("year_asc")}
									>
										Year: Old to New
									</button>
									<button
										className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
											sortBy === "year_desc"
												? "bg-[#6366F1] border-[#6366F1] text-white"
												: "border-[#111827] border-opacity-30 text-[#111827] hover:border-[#6366F1]"
										}`}
										onClick={() => setSortBy("year_desc")}
									>
										Year: New to Old
									</button>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Results Summary */}
				<div className="mb-6 flex justify-between items-center">
					<h2 className="text-xl font-semibold text-[#111827]">
						Found{" "}
						<span className="text-[#6366F1]">{filteredProducts.length}</span>{" "}
						vintage motorcycles
					</h2>
					<div className="text-sm text-[#111827] text-opacity-70">
						Page {currentPage} of {totalPages || 1}
					</div>
				</div>

				{/* Product Grid */}
				{paginatedProducts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{paginatedProducts.map((product) => (
							<div
								key={product.id}
								className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg border border-[#111827] border-opacity-10 flex flex-col h-full"
							>
								<div
									className="relative cursor-pointer h-56 overflow-hidden"
									onClick={() => navigate(`/products/${product.id}`)}
								>
									<img
										src={product.image[0]}
										alt={product.name}
										className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
									/>
									<div className="absolute top-3 right-3">
										<button
											className="bg-white p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110 hover:bg-[#F9FAFB]"
											onClick={(e) => {
												e.stopPropagation();
												handleWishlistClick(product.id);
											}}
											disabled={isWishlistLoading}
										>
											<Heart
												className={`h-5 w-5 ${
													likedProducts.includes(product.id)
														? "fill-[#6366F1] text-[#6366F1]"
														: "text-[#111827] text-opacity-40"
												}`}
											/>
										</button>
									</div>
									<div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent py-1">
										<div className="flex justify-center gap-2">
											<span className="text-white text-xs px-3 py-1 rounded-full bg-[#111827] bg-opacity-90">
												{product.category.name}
											</span>
											<span className="text-white text-xs px-3 py-1 rounded-full bg-[#6366F1] bg-opacity-90">
												{product.modelYear}
											</span>
										</div>
									</div>
								</div>

								<div className="p-5 flex-grow flex flex-col">
									<h3
										className="text-xl font-bold text-[#111827] mb-2 cursor-pointer hover:text-[#6366F1]"
										onClick={() => navigate(`/products/${product.id}`)}
									>
										{product.name}
									</h3>

									<p className="text-sm text-[#111827] text-opacity-70 mb-4 flex-grow line-clamp-3">
										{product.description}
									</p>

									<div className="flex justify-between items-center mb-4">
										<p className="text-[#6366F1] font-bold text-xl">
											${product.price.toLocaleString()}
										</p>
										<div className="text-sm">
											{Array.from({ length: 5 }, (_, index) => (
												<span
													key={index}
													className={
														index < product.rating
															? "text-[#6366F1]"
															: "text-[#111827] text-opacity-20"
													}
												>
													★
												</span>
											))}
										</div>
									</div>

									<button
										className="w-full py-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium transition-colors"
										onClick={() => handleAddToCart(product)}
									>
										Add to Cart
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="bg-white rounded-xl shadow-md p-8 text-center border border-[#111827] border-opacity-10">
						<h3 className="text-xl font-medium text-[#111827] mb-2">
							No products found
						</h3>
						<p className="text-[#111827] text-opacity-70">
							Try adjusting your search criteria or filters
						</p>
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="mt-10 flex justify-center">
						<div className="inline-flex rounded-lg border border-[#111827] border-opacity-20 overflow-hidden">
							<button
								onClick={() => setCurrentPage(currentPage - 1)}
								disabled={currentPage === 1}
								className={`px-5 py-3 flex items-center gap-2 ${
									currentPage === 1
										? "bg-[#F9FAFB] text-[#111827] text-opacity-40 cursor-not-allowed"
										: "bg-white text-[#111827] hover:bg-[#F9FAFB]"
								} transition-colors border-r border-[#111827] border-opacity-20`}
							>
								<ChevronLeft size={18} />
								<span className="hidden sm:inline">Previous</span>
							</button>

							<div className="px-5 py-3 bg-white text-[#111827] font-medium flex items-center">
								Page {currentPage} of {totalPages}
							</div>

							<button
								onClick={() => setCurrentPage(currentPage + 1)}
								disabled={currentPage === totalPages}
								className={`px-5 py-3 flex items-center gap-2 ${
									currentPage === totalPages
										? "bg-[#F9FAFB] text-[#111827] text-opacity-40 cursor-not-allowed"
										: "bg-white text-[#111827] hover:bg-[#F9FAFB]"
								} transition-colors border-l border-[#111827] border-opacity-20`}
							>
								<span className="hidden sm:inline">Next</span>
								<ChevronRight size={18} />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
