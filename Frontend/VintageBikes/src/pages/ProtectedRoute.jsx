import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
	const user = localStorage.getItem("user");
	const token = localStorage.getItem("accessToken");

	if (!user || !token) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectedRoute;
