import React, { useEffect, useState, Suspense } from "react";
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
	X,
	Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleWishlist } from "./AddtoWishList.jsx";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/CartSlice.js";
import toast from "react-hot-toast";

const ProductSkeleton = () => (
	<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full animate-pulse">
		<div className="h-48 bg-gray-200"></div>
		<div className="p-4 flex-grow flex flex-col gap-3">
			<div className="h-6 bg-gray-200 rounded w-3/4"></div>
			<div className="flex justify-between items-center">
				<div className="h-5 bg-gray-200 rounded w-1/4"></div>
				<div className="flex gap-1">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="h-4 w-4 bg-gray-200 rounded-full"></div>
					))}
				</div>
			</div>
			<div className="h-10 bg-gray-200 rounded mt-auto"></div>
		</div>
	</div>
);

const FilterSkeleton = () => (
	<div className="bg-white rounded-lg shadow-sm p-4 mb-6 animate-pulse">
		<div className="flex flex-col md:flex-row gap-3 items-center">
			<div className="h-10 bg-gray-200 rounded w-full"></div>
			<div className="h-10 bg-gray-200 rounded w-full md:w-52"></div>
			<div className="flex gap-2 shrink-0">
				<div className="h-10 w-28 bg-gray-200 rounded"></div>
				<div className="h-10 w-10 bg-gray-200 rounded"></div>
			</div>
		</div>
	</div>
);

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
	const [loading, setLoading] = useState(true);
	const [imageLoaded, setImageLoaded] = useState({});

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
				setLoading(true);
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
				setTimeout(() => setLoading(false), 800); // Simulate loading for better UX
			} catch (error) {
				console.error("Error fetching products or categories:", error);
				toast.error("Failed to load products. Please try again.");
				setLoading(false);
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

	const handleImageLoad = (productId) => {
		setImageLoaded((prev) => ({
			...prev,
			[productId]: true,
		}));
	};

	return (
		<div className="min-h-screen bg-gray-50 pt-16 pb-12">
			<div className="container mx-auto px-4 z-10 relative">
				{/* Header Section */}
				<div className="mb-10 text-center">
					<h1 className="text-4xl font-bold text-black tracking-tight mb-2">
						Vintage Collection
					</h1>
					<p className="text-gray-600 italic">
						Discover timeless classics for your collection
					</p>
				</div>

				{/* Filter Section - New Compact Design */}
				{loading ? (
					<FilterSkeleton />
				) : (
					<div className="bg-white rounded-lg shadow-sm p-4 mb-5 border border-gray-200">
						{/* Main filter row */}
						<div className="flex flex-col md:flex-row gap-3 items-center">
							<div className="relative flex-grow">
								<input
									type="text"
									placeholder="Search motorcycles..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full pl-9 pr-3 py-2 h-10 text-sm rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-colors"
								/>
								<Search
									className="absolute left-3 top-2.5 text-gray-500"
									size={16}
								/>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
									>
										<X size={14} />
									</button>
								)}
							</div>

							<div className="relative md:w-52 w-full shrink-0">
								<select
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="w-full pl-3 pr-8 py-2 h-10 text-sm rounded-md border border-gray-300 focus:border-black focus:ring-1 focus:ring-black focus:outline-none appearance-none transition-colors bg-white"
								>
									<option value="">All Categories</option>
									{categories.map((category) => (
										<option key={category.id} value={category.name}>
											{category.name}
										</option>
									))}
								</select>
								<div className="absolute right-3 top-2.5 pointer-events-none">
									<Filter size={14} className="text-gray-500" />
								</div>
							</div>

							<div className="flex gap-2 shrink-0 w-full md:w-auto">
								<button
									onClick={() => setShowFilters(!showFilters)}
									className="px-3 py-2 h-10 rounded-md bg-black hover:bg-gray-900 text-white transition-colors flex items-center gap-1.5 text-sm flex-1 md:flex-none justify-center md:justify-start"
								>
									<SlidersHorizontal size={14} />
									<span className="font-medium">
										{showFilters ? "Hide" : "Filters"}
									</span>
								</button>

								<button
									onClick={resetFilters}
									className="h-10 w-10 rounded-md bg-white border border-gray-300 hover:border-black text-gray-700 transition-colors flex items-center justify-center"
									title="Reset all filters"
								>
									<RefreshCw size={14} />
								</button>
							</div>
						</div>

						{/* Advanced Filters - Collapsible section */}
						{showFilters && (
							<div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-5 text-sm">
								{/* Price Range Slider */}
								<div className="space-y-2 md:col-span-4">
									<div className="flex justify-between mb-1">
										<label className="text-gray-700 font-medium text-xs">
											Price Range
										</label>
										<span className="text-black font-medium text-xs">
											${priceRange[0]} - ${priceRange[1]}
										</span>
									</div>
									<input
										type="range"
										min={0}
										max={10000}
										value={priceRange[1]}
										onChange={(e) =>
											setPriceRange([priceRange[0], parseInt(e.target.value)])
										}
										className="w-full h-1.5 accent-black"
									/>
									<div className="flex justify-between text-xs text-gray-500 mt-1">
										<span>$0</span>
										<span>$10,000</span>
									</div>
								</div>

								{/* Year Range Slider */}
								<div className="space-y-2 md:col-span-4">
									<div className="flex justify-between mb-1">
										<label className="text-gray-700 font-medium text-xs">
											Year Range
										</label>
										<span className="text-black font-medium text-xs">
											{yearRange[0]} - {yearRange[1]}
										</span>
									</div>
									<input
										type="range"
										min={1900}
										max={2025}
										value={yearRange[1]}
										onChange={(e) =>
											setYearRange([yearRange[0], parseInt(e.target.value)])
										}
										className="w-full h-1.5 accent-black"
									/>
									<div className="flex justify-between text-xs text-gray-500 mt-1">
										<span>1900</span>
										<span>2025</span>
									</div>
								</div>

								{/* Sort Options */}
								<div className="md:col-span-4">
									<label className="text-gray-700 font-medium text-xs block mb-2">
										Sort By
									</label>
									<div className="grid grid-cols-2 gap-2">
										<button
											className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
												sortBy === "price_asc"
													? "bg-black text-white"
													: "bg-gray-100 text-gray-800 hover:bg-gray-200"
											}`}
											onClick={() => setSortBy("price_asc")}
										>
											Price: Low to High
										</button>
										<button
											className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
												sortBy === "price_desc"
													? "bg-black text-white"
													: "bg-gray-100 text-gray-800 hover:bg-gray-200"
											}`}
											onClick={() => setSortBy("price_desc")}
										>
											Price: High to Low
										</button>
										<button
											className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
												sortBy === "year_asc"
													? "bg-black text-white"
													: "bg-gray-100 text-gray-800 hover:bg-gray-200"
											}`}
											onClick={() => setSortBy("year_asc")}
										>
											Year: Old to New
										</button>
										<button
											className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
												sortBy === "year_desc"
													? "bg-black text-white"
													: "bg-gray-100 text-gray-800 hover:bg-gray-200"
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
				)}

				{/* Results Summary */}
				<div className="mb-6 flex justify-between items-center">
					<h2 className="text-lg font-medium text-black">
						Found{" "}
						<span className="font-semibold">{filteredProducts.length}</span>{" "}
						vintage motorcycles
					</h2>
					<div className="text-sm text-gray-600">
						Page {currentPage} of {totalPages || 1}
					</div>
				</div>

				{/* Product Grid */}
				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{[...Array(8)].map((_, index) => (
							<ProductSkeleton key={index} />
						))}
					</div>
				) : paginatedProducts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{paginatedProducts.map((product) => (
							<div
								key={product.id}
								className="bg-white rounded-lg shadow-sm overflow-hidden transition hover:shadow-md border border-gray-200 flex flex-col h-full"
							>
								<div
									className="relative cursor-pointer h-48 overflow-hidden bg-gray-100"
									onClick={() => navigate(`/products/${product.id}`)}
								>
									{!imageLoaded[product.id] && (
										<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
											<div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
										</div>
									)}
									<img
										src={product.image[0]}
										alt={product.name}
										className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
											imageLoaded[product.id] ? "opacity-100" : "opacity-0"
										}`}
										onLoad={() => handleImageLoad(product.id)}
									/>
									<div className="absolute top-2 right-2">
										<button
											className="bg-white p-2 rounded-full shadow-sm transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black"
											onClick={(e) => {
												e.stopPropagation();
												handleWishlistClick(product.id);
											}}
											disabled={isWishlistLoading}
										>
											<Heart
												className={`h-4 w-4 ${
													likedProducts.includes(product.id)
														? "fill-black text-black"
														: "text-gray-500"
												}`}
											/>
										</button>
									</div>
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1 px-2">
										<div className="flex justify-start gap-2">
											<span className="text-white text-xs px-2 py-1 rounded-sm bg-black/80">
												{product.category.name}
											</span>
											<span className="text-white text-xs px-2 py-1 rounded-sm bg-gray-700/80">
												{product.modelYear}
											</span>
										</div>
									</div>
								</div>

								<div className="p-4 flex-grow flex flex-col">
									<h3
										className="text-base font-medium text-black mb-1 cursor-pointer hover:underline line-clamp-2"
										onClick={() => navigate(`/products/${product.id}`)}
									>
										{product.name}
									</h3>

									<div className="flex justify-between items-center mb-3">
										<p className="text-black font-semibold">
											${product.price.toLocaleString()}
										</p>
										<div className="flex items-center text-xs">
											{Array.from({ length: 5 }, (_, index) => (
												<Star
													key={index}
													size={12}
													className={
														index < product.rating
															? "fill-black text-black"
															: "text-gray-300"
													}
												/>
											))}
										</div>
									</div>

									<button
										className="w-full py-2 rounded-md bg-black hover:bg-gray-900 text-white text-sm font-medium transition-colors mt-auto"
										onClick={() => handleAddToCart(product)}
									>
										Add to Cart
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200">
						<h3 className="text-lg font-medium text-black mb-2">
							No products found
						</h3>
						<p className="text-gray-600 text-sm">
							Try adjusting your search criteria or filters
						</p>
					</div>
				)}

				{/* Pagination */}
				{!loading && totalPages > 1 && (
					<div className="mt-10 flex justify-center">
						<div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
							<button
								onClick={() => setCurrentPage(currentPage - 1)}
								disabled={currentPage === 1}
								className={`px-4 py-2 flex items-center gap-1 text-sm ${
									currentPage === 1
										? "bg-gray-50 text-gray-400 cursor-not-allowed"
										: "bg-white text-black hover:bg-gray-50"
								} transition-colors border-r border-gray-200`}
							>
								<ChevronLeft size={14} />
								<span className="hidden sm:inline">Previous</span>
							</button>

							<div className="px-4 py-2 bg-white text-black text-sm font-medium flex items-center">
								{currentPage} / {totalPages}
							</div>

							<button
								onClick={() => setCurrentPage(currentPage + 1)}
								disabled={currentPage === totalPages}
								className={`px-4 py-2 flex items-center gap-1 text-sm ${
									currentPage === totalPages
										? "bg-gray-50 text-gray-400 cursor-not-allowed"
										: "bg-white text-black hover:bg-gray-50"
								} transition-colors border-l border-gray-200`}
							>
								<span className="hidden sm:inline">Next</span>
								<ChevronRight size={14} />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
