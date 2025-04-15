// components/Footer.tsx
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-[#3B2F2F] mt-24 py-10 text-white w-full ">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="md:flex md:justify-between">
						<div className="mb-6 md:mb-0">
							<h2 className="text-2xl font-extrabold text-yellow-400">
								VintageBikes
							</h2>
							<p className="mt-2 text-sm text-gray-300">
								Classic rides, timeless style.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-8 sm:gap-10 sm:grid-cols-3">
							<div>
								<h3 className="text-sm font-semibold text-yellow-400 mb-4">
									Shop
								</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#">New Arrivals</a>
									</li>
									<li>
										<a href="#">Vintage Picks</a>
									</li>
									<li>
										<a href="#">Accessories</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-sm font-semibold text-yellow-400 mb-4">
									Help
								</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#">Support</a>
									</li>
									<li>
										<a href="#">Track Order</a>
									</li>
									<li>
										<a href="#">Return Policy</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-sm font-semibold text-yellow-400 mb-4">
									Company
								</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#">About Us</a>
									</li>
									<li>
										<a href="#">Careers</a>
									</li>
									<li>
										<a href="#">Contact</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<hr className="my-6 border-[#5a4747]" />
					<div className="flex flex-col md:flex-row md:justify-between items-center">
						<p className="text-sm text-gray-400 mb-4 md:mb-0">
							© 2025 VintageBikes. All rights reserved.
						</p>
						<div className="flex gap-6">
							<a href="#" className="hover:text-yellow-400">
								<Facebook size={18} />
							</a>
							<a href="#" className="hover:text-yellow-400">
								<Instagram size={18} />
							</a>
							<a href="#" className="hover:text-yellow-400">
								<Twitter size={18} />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
