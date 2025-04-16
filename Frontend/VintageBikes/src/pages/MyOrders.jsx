import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
	PackageCheck,
	CreditCard,
	Clock,
	ChevronDown,
	ChevronUp,
	ShoppingBag,
	CheckCircle,
	AlertCircle,
	Truck,
} from "lucide-react";
import { BASE_API_URL } from "../api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../Redux/MyOrderSlice";

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
					<ShoppingBag size={18} />
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

const OrdersSkeleton = () => {
	return (
		<div className="space-y-6">
			{[1, 2].map((item) => (
				<div
					key={item}
					className="rounded-xl border border-gray-200 shadow-sm p-6 bg-white"
				>
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
						<div className="space-y-2">
							<div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
							<div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
						</div>
						<div className="space-y-2 text-right">
							<div className="h-4 bg-gray-200 rounded w-28 animate-pulse ml-auto"></div>
							<div className="h-6 bg-gray-200 rounded w-16 animate-pulse ml-auto"></div>
						</div>
					</div>

					<div className="h-px bg-gray-200 w-full my-4"></div>

					<div className="space-y-4 mt-6">
						{[1, 2].map((product) => (
							<div key={product} className="flex items-center gap-4">
								<div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse"></div>
								<div className="flex-1 space-y-2 min-w-0">
									<div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
									<div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
								</div>
								<div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
							</div>
						))}
					</div>

					<div className="mt-6 flex justify-between">
						<div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
						<div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
					</div>
				</div>
			))}
		</div>
	);
};

const EmptyOrders = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			<div className="bg-gray-100 p-6 rounded-full mb-4">
				<PackageCheck className="h-12 w-12 text-gray-400" />
			</div>
			<h3 className="text-xl font-semibold text-gray-900 mb-2">
				No orders found
			</h3>
			<p className="text-gray-500 mb-6 max-w-md">
				You haven't placed any orders yet. Start shopping to see your orders
				here.
			</p>
			<button
				onClick={() => navigate("/products")}
				className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition-all duration-300"
			>
				Browse Products
			</button>
		</div>
	);
};

const StatusBadge = ({ status }) => {
	const getStatusConfig = () => {
		switch (status?.toLowerCase()) {
			case "delivered":
				return {
					icon: <CheckCircle size={14} />,
					label: "Delivered",
					color: "bg-green-50 text-green-700 border-green-200",
				};
			case "shipped":
				return {
					icon: <Truck size={14} />,
					label: "Shipped",
					color: "bg-blue-50 text-blue-700 border-blue-200",
				};
			case "processing":
				return {
					icon: <Clock size={14} />,
					label: "Processing",
					color: "bg-yellow-50 text-yellow-700 border-yellow-200",
				};
			case "cancelled":
				return {
					icon: <AlertCircle size={14} />,
					label: "Cancelled",
					color: "bg-red-50 text-red-700 border-red-200",
				};
			default:
				return {
					icon: <Clock size={14} />,
					label: status || "Pending",
					color: "bg-gray-50 text-gray-700 border-gray-200",
				};
		}
	};

	const { icon, label, color } = getStatusConfig();

	return (
		<span
			className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${color} gap-1`}
		>
			{icon}
			{label}
		</span>
	);
};

function MyOrders() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const [expandedOrders, setExpandedOrders] = useState({});
	const navigate = useNavigate();
	const orders = useSelector((state) => state.myOrders.orders);
	const dispatch = useDispatch();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	useEffect(() => {
		const fetchOrders = async () => {
			const token = localStorage.getItem("accessToken");
			try {
				const res = await axios.get(`${BASE_API_URL}/myorders/${user.userId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				const fetchedOrders = Array.isArray(res.data) ? res.data : [];

				const initialExpanded = {};
				fetchedOrders.forEach((order, index) => {
					initialExpanded[order.id] = index < 1;
				});
				setExpandedOrders(initialExpanded);

				dispatch(setOrders(fetchedOrders));
			} catch (error) {
				console.error("Failed to fetch orders:", error);
				dispatch(setOrders([]));
			} finally {
				setLoading(false);
			}
		};

		if (user?.userId) {
			fetchOrders();
		} else {
			dispatch(setOrders([]));
			setLoading(false);
		}
	}, [user, dispatch]);

	const toggleOrderExpand = (orderId) => {
		setExpandedOrders((prev) => ({
			...prev,
			[orderId]: !prev[orderId],
		}));
	};

	if (loading) {
		return (
			<div className="max-w-5xl mx-auto px-4 py-8 mt-12">
				<h2 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h2>
				<OrdersSkeleton />
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="max-w-5xl mx-auto px-4 py-8 mt-12">
				<h2 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h2>
				<EmptyOrders />
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto px-4 py-8 mt-12">
			<h2 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h2>

			<div className="space-y-6">
				{orders.map((order) => (
					<div
						key={order.id}
						className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white transition-all duration-300 hover:border-gray-300"
					>
						{/* Order Header - Always visible */}
						<div
							className="p-4 sm:p-5 cursor-pointer bg-gray-50 border-b border-gray-200"
							onClick={() => toggleOrderExpand(order.id)}
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-0">
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
									<StatusBadge status={order.status} />

									<div>
										<p className="text-sm text-gray-500 mt-2 sm:mt-0">
											Order #{order.id}
										</p>
										<p className="text-sm text-gray-500">
											{format(new Date(order.createdAt), "dd MMMM yyyy")}
										</p>
									</div>
								</div>

								<div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-6 mt-3 sm:mt-0">
									<div className="text-right">
										<p className="text-xs text-gray-500">Total Amount</p>
										<p className="text-base sm:text-lg font-bold text-gray-900">
											$
											{order.totalAmount.toLocaleString("en-US", {
												minimumFractionDigits: 2,
											})}
										</p>
									</div>

									<button
										className="text-gray-500 hover:text-gray-700 p-2"
										aria-label={
											expandedOrders[order.id]
												? "Collapse order details"
												: "Expand order details"
										}
									>
										{expandedOrders[order.id] ? (
											<ChevronUp size={20} />
										) : (
											<ChevronDown size={20} />
										)}
									</button>
								</div>
							</div>
						</div>

						{/* Order Details - Expandable */}
						{expandedOrders[order.id] && (
							<div className="p-4 sm:p-5">
								{/* Order Timeline */}
								<div className="mb-6 pb-6 border-b border-gray-100">
									<h4 className="text-sm font-medium text-gray-700 mb-3">
										Order Timeline
									</h4>
									<div className="flex items-center text-sm">
										<div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mr-3">
											<CheckCircle size={16} />
										</div>
										<div>
											<p className="font-medium">Order Placed</p>
											<p className="text-gray-500">
												{format(
													new Date(order.createdAt),
													"dd MMM yyyy, hh:mm a"
												)}
											</p>
										</div>
									</div>
								</div>

								{/* Products List */}
								<h4 className="text-sm font-medium text-gray-700 mb-3">
									Products ({order.products.length})
								</h4>
								<div className="space-y-4 mb-6">
									{order.products.map((product) => (
										<div
											key={product.productId}
											className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
											onClick={() => navigate(`/products/${product.productId}`)}
										>
											<Suspense
												fallback={
													<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg"></div>
												}
											>
												<LazyImage
													src={product.image[0]}
													alt={product.name}
													className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex-shrink-0"
												/>
											</Suspense>

											<div className="flex-1 min-w-0">
												<p className="font-medium text-gray-900 truncate text-sm sm:text-base">
													{product.name}
												</p>
												<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 mt-1">
													<p className="text-xs sm:text-sm text-gray-500">
														Qty:{" "}
														<span className="font-medium text-gray-700">
															{product.quantity}
														</span>
													</p>
													<span className="hidden sm:inline mx-2 text-gray-300">
														•
													</span>
													<p className="text-xs sm:text-sm text-gray-500">
														Price:{" "}
														<span className="font-medium text-gray-700">
															$
															{product.price.toLocaleString("en-US", {
																minimumFractionDigits: 2,
															})}
														</span>
													</p>
												</div>
											</div>

											<div className="text-right flex-shrink-0">
												<p className="font-bold text-gray-900 text-sm sm:text-base">
													$
													{(product.quantity * product.price).toLocaleString(
														"en-US",
														{ minimumFractionDigits: 2 }
													)}
												</p>
											</div>
										</div>
									))}
								</div>

								{/* Payment Information */}
								{order.payment && (
									<div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
										<h4 className="text-sm font-medium text-gray-700 mb-3">
											Payment Information
										</h4>
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
											<div className="flex items-center gap-2">
												<div className="p-2 bg-white rounded-full">
													<CreditCard className="h-4 w-4 text-gray-700" />
												</div>
												<div>
													<p className="text-sm font-medium text-gray-900">
														{order.payment.status === "created"
															? "Payment Complete"
															: "Payment Pending"}
													</p>
													<p className="text-xs text-gray-500">
														{format(
															new Date(order.payment.createdAt),
															"dd MMM yyyy, hh:mm a"
														)}
													</p>
												</div>
											</div>

											<p className="text-sm font-bold text-gray-900 mt-2 sm:mt-0">
												$
												{order.totalAmount.toLocaleString("en-US", {
													minimumFractionDigits: 2,
												})}
											</p>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default MyOrders;
