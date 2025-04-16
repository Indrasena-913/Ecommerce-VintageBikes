import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProductDetails from "../pages/ProductDetails";
import Wishlist from "../pages/Wishlist";
import CartManager from "../pages/CartManager";
import CheckoutForm from "../pages/CheckOutForm";
import MyOrders from "../pages/MyOrders";

const RoutesComponent = ({ count, setCount }) => {
	return (
		<Routes>
			<Route path="/" element={<Login />} />

			<Route path="/register" element={<Register />} />
			<Route
				path="/dashboard"
				element={<Dashboard count={count} setCount={setCount} />}
			/>
			<Route
				path="/products/:id"
				element={<ProductDetails count={count} setCount={setCount} />}
			/>
			<Route
				path="/wishlist"
				element={<Wishlist count={count} setCount={setCount} />}
			/>
			<Route path="/cart" element={<CartManager />} />

			<Route path="/checkout" element={<CheckoutForm />} />
			<Route path="/my-orders" element={<MyOrders />} />
		</Routes>
	);
};

export default RoutesComponent;
