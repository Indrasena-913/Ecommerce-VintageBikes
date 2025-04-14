import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

const RoutesComponent = () => {
	return (
		<Routes>
			<Route path="/" element={<Login />} />

			<Route path="/register" element={<Register />} />
		</Routes>
	);
};

export default RoutesComponent;
