import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-black mt-24 py-12 text-white w-full">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="md:flex md:justify-between">
						<div className="mb-8 md:mb-0">
							<h2 className="text-2xl font-extrabold tracking-tighter">
								VintageBikes
							</h2>
							<p className="mt-2 text-sm text-gray-400">
								Classic rides, timeless style.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-8 sm:gap-16 sm:grid-cols-3">
							<div>
								<h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-4">
									Shop
								</h3>
								<ul className="space-y-3 text-sm">
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											New Arrivals
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											Vintage Picks
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											Accessories
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-4">
									Help
								</h3>
								<ul className="space-y-3 text-sm">
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											Support
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											Track Order
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											Return Policy
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-4">
									Company
								</h3>
								<ul className="space-y-3 text-sm">
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											About Us
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											Careers
										</a>
									</li>
									<li>
										<a
											href="#"
											className="hover:text-gray-400 transition-colors duration-200"
										>
											Contact
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<hr className="my-8 border-gray-800" />
					<div className="flex flex-col md:flex-row md:justify-between md:items-center">
						<p className="text-xs text-gray-500 mb-6 md:mb-0">
							© 2025 VintageBikes. All rights reserved.
						</p>
						<div className="flex space-x-8">
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors duration-200"
							>
								<Facebook size={16} />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors duration-200"
							>
								<Instagram size={16} />
							</a>
							<a
								href="#"
								className="text-gray-400 hover:text-white transition-colors duration-200"
							>
								<Twitter size={16} />
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
