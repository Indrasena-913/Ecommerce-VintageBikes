import { useEffect, useState } from "react";
import {
	FaHeart,
	FaShoppingCart,
	FaBox,
	FaUserCircle,
	FaHome,
} from "react-icons/fa";
import logo from "../assets/vbike.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "../api";
import axios from "axios";

const Header = ({ count }) => {
	const [showProfile, setShowProfile] = useState(false);
	const [wishlistCount, setWishlistCount] = useState(0);

	const { setIsLoggedIn } = useAuth();
	const navigate = useNavigate();

	const cartItems = useSelector((state) => state.cart.items);
	const cartCount = cartItems.length;

	const res = localStorage.getItem("user");
	const user = JSON.parse(res);

	useEffect(() => {
		const fetchWishlistCount = async () => {
			try {
				const token = localStorage.getItem("accessToken");

				const res = await axios.get(`${BASE_API_URL}/wishlist/${user.userId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				setWishlistCount(res.data.length);
			} catch (error) {
				console.error("Error fetching wishlist count:", error);
			}
		};

		fetchWishlistCount();
	}, [count]);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("user");
		setIsLoggedIn(false);
		navigate("/");
	};

	return (
		<>
			<header className="bg-[#F9FAFB] shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50 w-full">
				{/* Logo */}
				<div className="flex items-center">
					<img src={logo} alt="Vbike Logo" className="w-12 h-12 rounded-full" />
					<h1 className="text-[#111827] font-bold text-xl ml-2 hidden sm:block">
						Vbike
					</h1>
				</div>

				{/* Desktop Nav */}
				<nav className="flex-1">
					<ul className="hidden md:flex justify-end items-center md:mr-16 lg:mr-40 xl:mr-60">
						<li className="mx-4">
							<a
								href="/dashboard"
								className="text-[#111827] hover:text-[#6366F1] text-lg flex items-center gap-1"
							>
								<FaHome /> Home
							</a>
						</li>

						<li className="mx-4 relative">
							<a
								href="/wishlist"
								className="text-[#111827] hover:text-[#6366F1] text-lg flex items-center gap-1 relative"
							>
								<FaHeart />
								Wishlist
								{wishlistCount > 0 && (
									<span className="absolute -top-2 -right-4 bg-[#111827] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
										{wishlistCount}
									</span>
								)}
							</a>
						</li>

						<li className="mx-4 relative">
							<a
								href="/cart"
								className="text-[#111827] hover:text-[#6366F1] text-lg flex items-center gap-1 relative"
							>
								<FaShoppingCart />
								Cart
								{cartCount > 0 && (
									<span className="absolute -top-2 -right-4 bg-[#111827] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
										{cartCount}
									</span>
								)}
							</a>
						</li>

						<li className="mx-4">
							<a
								href="/orders"
								className="text-[#111827] hover:text-[#6366F1] text-lg flex items-center gap-1"
							>
								<FaBox /> My Orders
							</a>
						</li>

						{/* Profile Dropdown */}
						<li className="mx-4 relative">
							<button
								onClick={() => setShowProfile(!showProfile)}
								className="text-[#111827] hover:text-[#6366F1] text-lg flex items-center gap-1 focus:outline-none"
							>
								<FaUserCircle /> Profile
							</button>
							{showProfile && (
								<div className="absolute right-0 mt-2 w-62 bg-[#FFFFFF] rounded-xl shadow-lg p-4 z-50 border border-[#D1D5DB]">
									<p className="font-semibold text-[#111827]">
										{user.userName}
									</p>
									<p className="text-sm text-[#6B7280] mb-3">
										{user.userEmail}
									</p>
									<button
										className="w-full bg-[#6366F1] text-white py-1.5 rounded-full hover:bg-[#4F46E5]"
										onClick={handleLogout}
									>
										Logout
									</button>
								</div>
							)}
						</li>
					</ul>
				</nav>

				{/* Mobile Right-side Icons */}
				<div className="flex items-center gap-4 md:hidden">
					<a
						href="/dashboard"
						className="text-xl text-[#111827] hover:text-[#6366F1]"
					>
						<FaHome />
					</a>

					<a
						href="/wishlist"
						className="relative text-xl text-[#111827] hover:text-[#6366F1]"
					>
						<FaHeart />
						{wishlistCount > 0 && (
							<span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
								{wishlistCount}
							</span>
						)}
					</a>

					<a
						href="/cart"
						className="relative text-xl text-[#111827] hover:text-[#6366F1]"
					>
						<FaShoppingCart />
						{cartCount > 0 && (
							<span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
								{cartCount}
							</span>
						)}
					</a>

					<button
						onClick={() => setShowProfile(!showProfile)}
						className="text-2xl text-[#111827] focus:outline-none"
					>
						<FaUserCircle />
					</button>

					{showProfile && (
						<div className="absolute top-16 right-4 w-60 bg-[#FFFFFF] rounded-xl shadow-lg p-4 z-50 border border-[#D1D5DB]">
							<p className="font-semibold text-[#111827]">{user.userName}</p>
							<p className="text-sm text-[#6B7280] mb-3">{user.userEmail}</p>
							<a
								href="/orders"
								className="mb-4 text-[#6366F1] hover:text-[#4F46E5] flex items-center gap-2"
							>
								<FaBox /> My Orders
							</a>
							<button
								className="w-full bg-[#6366F1] text-white py-1.5 rounded-full hover:bg-[#4F46E5]"
								onClick={handleLogout}
							>
								Logout
							</button>
						</div>
					)}
				</div>
			</header>
		</>
	);
};

export default Header;
