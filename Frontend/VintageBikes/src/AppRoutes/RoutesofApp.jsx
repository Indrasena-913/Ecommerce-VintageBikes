import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

const RoutesComponent = () => {
	return (
		<Routes>
			<Route path="/" element={<Login />} />

			<Route path="/register" element={<Register />} />
			<Route path="/dashboard" element={<Dashboard />} />
		</Routes>
	);
};

export default RoutesComponent;
