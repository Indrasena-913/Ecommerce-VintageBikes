import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Loader2, PackageCheck, CreditCard } from "lucide-react";
import { BASE_API_URL } from "../api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../Redux/MyOrderSlice";
import { useAuth } from "../context/AuthContext";

function MyOrders() {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
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

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<Loader2 className="animate-spin h-8 w-8 text-gray-500" />
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className="text-center py-16 text-gray-600">
				<PackageCheck className="mx-auto mb-4 h-10 w-10" />
				<p>No orders found yet.</p>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto px-4 py-8 mt-20">
			<h2 className="text-3xl font-bold mb-6">My Orders</h2>
			<div className="space-y-6">
				{orders.map((order) => (
					<div
						key={order.id}
						className="rounded-2xl border shadow-sm p-6 hover:shadow-md transition-all duration-300"
					>
						<div className="flex justify-between items-center mb-4">
							<div>
								<p className="text-sm text-gray-500">Order ID: #{order.id}</p>
								<p className="text-md text-gray-700">
									Status:{" "}
									<span className="capitalize font-medium">{order.status}</span>
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm text-gray-500">
									Date: {format(new Date(order.createdAt), "dd MMM yyyy")}
								</p>
								<p className="text-lg font-semibold text-gray-900">
									₹{order.totalAmount}
								</p>
							</div>
						</div>

						{/* Product items */}
						<div className="grid md:grid-cols-2 gap-4 mt-4">
							{order.products.map((product) => (
								<div
									key={product.productId}
									className="flex items-center gap-4 border rounded-xl p-3 cursor-pointer"
									onClick={() => navigate(`/products/${product.productId}`)}
								>
									<img
										src={product.image[0]}
										alt={product.name}
										className="w-16 h-16 object-cover rounded-lg"
									/>
									<div className="flex-1">
										<p className="font-semibold text-gray-800">
											{product.name}
										</p>
										<p className="text-sm text-gray-500">
											Qty: {product.quantity} × ₹{product.price}
										</p>
									</div>
									<div className="text-sm text-right text-gray-700">
										₹{product.quantity * product.price}
									</div>
								</div>
							))}
						</div>

						{order.payment && (
							<div className="mt-4 flex items-center justify-between text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<CreditCard className="h-4 w-4" />
									<span>
										{order.payment.status === "created" ? "Paid" : "Pending"}
									</span>
								</div>
								<span>
									{format(
										new Date(order.payment.createdAt),
										"dd MMM yyyy, hh:mm a"
									)}
								</span>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default MyOrders;
