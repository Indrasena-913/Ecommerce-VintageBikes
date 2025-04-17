import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import {
	Heart,
	ShoppingCart,
	Package,
	User,
	Home,
	LogOut,
	ChevronDown,
} from "lucide-react";
import logo from "../assets/vbike2.png";
import { fetchCartItems } from "../Redux/CartSlice";
import { fetchMyOrders } from "../Redux/MyOrderSlice";
import { fetchWishlistItems } from "../Redux/WishListSlice";

const Header = ({ count }) => {
	const [showProfile, setShowProfile] = useState(false);

	const { setIsLoggedIn } = useAuth();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const cartItems = useSelector((state) => state.cart.items);
	const cartCount = cartItems.length;

	const myOrders = useSelector((state) => state.myOrders.orders);
	const orderCount = myOrders.length;

	const wishlistItems = useSelector((state) => state.wishlist.items);
	const wishlistCount = wishlistItems.length;

	const res = localStorage.getItem("user");
	const user = res ? JSON.parse(res) : null;

	useEffect(() => {
		if (user?.userId) {
			dispatch(fetchCartItems(user.userId));
			dispatch(fetchMyOrders(user.userId));
			dispatch(fetchWishlistItems(user.userId));
		}
	}, [dispatch, user?.userId]);

	useEffect(() => {
		if (user?.userId && count !== undefined) {
			dispatch(fetchWishlistItems(user.userId));
		}
	}, [count, dispatch, user?.userId]);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("user");
		localStorage.removeItem("cartItems");
		localStorage.removeItem("myOrders");
		localStorage.removeItem("wishlistItems");
		localStorage.removeItem("wishlistLastFetched");
		setIsLoggedIn(false);
		navigate("/");
	};

	return (
		<header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50 w-full border-b border-gray-100">
			{/* Logo */}
			<div className="flex items-center">
				<img
					src={logo}
					alt="Vbike Logo"
					className="w-9 h-9 rounded-full object-cover scale-140"
					onClick={() => navigate("/dashboard")}
				/>
				<h1 className="text-black font-bold text-xl ml-2 hidden sm:block tracking-tight logo-font">
					VBike
				</h1>
			</div>

			{/* Desktop Nav */}
			<nav className="flex-1">
				<ul className="hidden md:flex justify-end items-center space-x-8 mr-4">
					<li>
						<a
							href="/dashboard"
							className="text-black hover:text-gray-700 text-sm font-medium flex items-center gap-1.5 transition-colors duration-200"
						>
							<Home size={15} strokeWidth={2} /> Home
						</a>
					</li>

					<li className="relative">
						<a
							href="/wishlist"
							className="text-black hover:text-gray-700 text-sm font-medium flex items-center gap-1.5 transition-colors duration-200"
						>
							<Heart size={15} strokeWidth={2} />
							Wishlist
							{wishlistCount > 0 && (
								<span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
									{wishlistCount}
								</span>
							)}
						</a>
					</li>

					<li className="relative">
						<a
							href="/cart"
							className="text-black hover:text-gray-700 text-sm font-medium flex items-center gap-1.5 transition-colors duration-200"
						>
							<ShoppingCart size={15} strokeWidth={2} />
							Cart
							{cartCount > 0 && (
								<span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
									{cartCount}
								</span>
							)}
						</a>
					</li>

					<li className="relative">
						<a
							href="/my-orders"
							className="text-black hover:text-gray-700 text-sm font-medium flex items-center gap-1.5 transition-colors duration-200"
						>
							<Package size={15} strokeWidth={2} />
							Orders
							{orderCount > 0 && (
								<span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
									{orderCount}
								</span>
							)}
						</a>
					</li>

					{/* Profile Dropdown */}
					<li className="relative">
						<button
							onClick={() => setShowProfile(!showProfile)}
							className="text-black hover:text-gray-700 text-sm font-medium flex items-center gap-1.5 transition-colors duration-200 focus:outline-none"
						>
							<User size={15} strokeWidth={2} />
							{user?.userName?.split(" ")[0]}
							<ChevronDown
								size={14}
								strokeWidth={2}
								className={`transition-transform duration-200 ${
									showProfile ? "rotate-180" : ""
								}`}
							/>
						</button>

						{showProfile && (
							<div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg p-4 z-50 border border-gray-100">
								<div className="flex flex-col">
									<p className="font-medium text-black">{user?.userName}</p>
									<p className="text-xs text-gray-600 mb-3 truncate">
										{user?.userEmail}
									</p>
									<div className="h-px bg-gray-100 my-2" />
									<button
										className="mt-2 flex items-center gap-2 bg-black text-white py-1.5 px-4 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors duration-200"
										onClick={handleLogout}
									>
										<LogOut size={14} />
										Sign out
									</button>
								</div>
							</div>
						)}
					</li>
				</ul>
			</nav>

			{/* Mobile Navigation */}
			<div className="flex items-center gap-5 md:hidden">
				<a
					href="/dashboard"
					className="text-black hover:text-gray-700 transition-colors duration-200"
				>
					<Home size={18} strokeWidth={2} />
				</a>

				<a
					href="/wishlist"
					className="relative text-black hover:text-gray-700 transition-colors duration-200"
				>
					<Heart size={18} strokeWidth={2} />
					{wishlistCount > 0 && (
						<span className="absolute -top-1.5 -right-1.5 bg-black text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-medium">
							{wishlistCount}
						</span>
					)}
				</a>

				<a
					href="/cart"
					className="relative text-black hover:text-gray-700 transition-colors duration-200"
				>
					<ShoppingCart size={18} strokeWidth={2} />
					{cartCount > 0 && (
						<span className="absolute -top-1.5 -right-1.5 bg-black text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-medium">
							{cartCount}
						</span>
					)}
				</a>

				<button
					onClick={() => setShowProfile(!showProfile)}
					className="text-black focus:outline-none hover:text-gray-700 transition-colors duration-200"
				>
					<User size={18} strokeWidth={2} />
				</button>

				{showProfile && (
					<div className="absolute top-16 right-4 w-60 bg-white rounded-lg shadow-lg p-3 z-50 border border-gray-100">
						<p className="font-medium text-black">{user?.userName}</p>
						<p className="text-xs text-gray-600 mb-2 truncate">
							{user?.userEmail}
						</p>
						<div className="h-px bg-gray-100 my-2" />
						<a
							href="/my-orders"
							className="mb-3 text-black hover:text-gray-700 flex items-center gap-2 text-sm py-1"
						>
							<Package size={14} strokeWidth={2} /> My Orders
							{orderCount > 0 && (
								<span className="bg-black text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-medium ml-1">
									{orderCount}
								</span>
							)}
						</a>
						<button
							className="w-full bg-black text-white py-1.5 rounded-md text-sm font-medium hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2"
							onClick={handleLogout}
						>
							<LogOut size={14} /> Sign out
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
