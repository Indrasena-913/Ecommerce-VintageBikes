import { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaBox, FaUserCircle } from "react-icons/fa";
import logo from "../assets/vbike.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
	const [showProfile, setShowProfile] = useState(false);
	const [User, setUser] = useState({ name: "", email: "" });
	const { setIsLoggedIn } = useAuth();

	useEffect(() => {
		const res = localStorage.getItem("user");
		const user = JSON.parse(res);

		setUser(user);
	}, []);

	const navigate = useNavigate();

	const handleLogout = () => {
		setIsLoggedIn(false);
		navigate("/");
	};

	return (
		<header className="bg-[#F5EBDD] shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50 w-full">
			<div className="flex items-center">
				<img src={logo} alt="Vbike Logo" className="w-12 h-12 rounded-full" />
				<h1 className="text-[#D2691E] font-bold text-xl ml-2 hidden sm:block">
					Vbike
				</h1>
			</div>

			<nav className="flex-1">
				<ul className="hidden md:flex justify-end items-center md:mr-16 lg:mr-40 xl:mr-60">
					<li className="mx-4">
						<a
							href="/wishlist"
							className="text-[#5E3A1D] hover:text-[#D2691E] text-lg flex items-center gap-1"
						>
							<FaHeart /> Wishlist
						</a>
					</li>
					<li className="mx-4">
						<a
							href="/cart"
							className="text-[#5E3A1D] hover:text-[#D2691E] text-lg flex items-center gap-1"
						>
							<FaShoppingCart /> Cart
						</a>
					</li>
					<li className="mx-4">
						<a
							href="/orders"
							className="text-[#5E3A1D] hover:text-[#D2691E] text-lg flex items-center gap-1"
						>
							<FaBox /> My Orders
						</a>
					</li>
					<li className="mx-4 relative">
						<button
							onClick={() => setShowProfile(!showProfile)}
							className="text-[#5E3A1D] hover:text-[#D2691E] text-lg flex items-center gap-1 focus:outline-none"
						>
							<FaUserCircle /> Profile
						</button>
						{showProfile && (
							<div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg p-4 z-50">
								<p className="font-semibold text-[#5E3A1D]">{User.userName}</p>
								<p className="text-sm text-gray-500 mb-3">{User.userEmail}</p>
								<button className="w-full bg-[#D2691E] text-white py-1.5 rounded-full hover:bg-[#a75d2a]">
									Logout
								</button>
							</div>
						)}
					</li>
				</ul>
			</nav>

			<div className="md:hidden">
				<button
					onClick={() => setShowProfile(!showProfile)}
					className="text-2xl text-[#5E3A1D] focus:outline-none"
				>
					<FaUserCircle />
				</button>

				{showProfile && (
					<div className="absolute top-16 right-4 w-60 bg-white rounded-xl shadow-lg p-4 z-50">
						<p className="font-semibold text-[#5E3A1D]">{User.userName}</p>
						<p className="text-sm text-gray-500 mb-3">{User.userEmail}</p>
						<a
							href="/wishlist"
							className=" mb-2 text-[#5E3A1D] hover:text-[#D2691E] flex items-center gap-2"
						>
							<FaHeart /> Wishlist
						</a>
						<a
							href="/cart"
							className=" mb-2 text-[#5E3A1D] hover:text-[#D2691E] flex items-center gap-2"
						>
							<FaShoppingCart /> Cart
						</a>
						<a
							href="/orders"
							className=" mb-4 text-[#5E3A1D] hover:text-[#D2691E] flex items-center gap-2"
						>
							<FaBox /> My Orders
						</a>
						<button
							className="w-full bg-[#D2691E] text-white py-1.5 rounded-full hover:bg-[#a75d2a]"
							onClick={handleLogout}
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;
