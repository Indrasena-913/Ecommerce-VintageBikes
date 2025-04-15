import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProductDetails from "../pages/ProductDetails";
import Wishlist from "../pages/Wishlist";

const RoutesComponent = () => {
	return (
		<Routes>
			<Route path="/" element={<Login />} />

			<Route path="/register" element={<Register />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/products/:id" element={<ProductDetails />} />
			<Route path="/wishlist" element={<Wishlist />} />
		</Routes>
	);
};

export default RoutesComponent;
