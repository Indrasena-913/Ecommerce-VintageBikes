import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProductDetails from "../pages/ProductDetails";
import Wishlist from "../pages/Wishlist";
import CartManager from "../pages/CartManager";
import CheckoutForm from "../pages/CheckOutForm";
import MyOrders from "../pages/MyOrders";
import ForgotPasswordForm from "../ForgotPassword/FPForm";
import ResetPasswordForm from "../ForgotPassword/ResetPForm";
import ProtectedRoute from "../pages/ProtectedRoute";

const RoutesComponent = ({ count, setCount }) => {
	return (
		<Routes>
			{/* 🔓 Public Routes */}
			<Route path="/" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/forgot-password" element={<ForgotPasswordForm />} />
			<Route path="/reset-password/:token" element={<ResetPasswordForm />} />

			{/* 🔐 Protected Routes */}
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Dashboard count={count} setCount={setCount} />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/products/:id"
				element={
					<ProtectedRoute>
						<ProductDetails count={count} setCount={setCount} />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/wishlist"
				element={
					<ProtectedRoute>
						<Wishlist count={count} setCount={setCount} />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/cart"
				element={
					<ProtectedRoute>
						<CartManager />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/checkout"
				element={
					<ProtectedRoute>
						<CheckoutForm />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/my-orders"
				element={
					<ProtectedRoute>
						<MyOrders />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
};

export default RoutesComponent;
