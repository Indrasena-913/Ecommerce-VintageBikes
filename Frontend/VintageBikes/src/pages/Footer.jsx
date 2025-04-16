// components/Footer.tsx
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
	return (
		<footer className="bg-[#111827] mt-24 py-10 text-[#F9FAFB] w-full">
			<div className="w-full px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="md:flex md:justify-between">
						<div className="mb-6 md:mb-0">
							<h2 className="text-2xl font-extrabold text-[#6366F1]">
								VintageBikes
							</h2>
							<p className="mt-2 text-sm text-[#F9FAFB]">
								Classic rides, timeless style.
							</p>
						</div>
						<div className="grid grid-cols-2 gap-8 sm:gap-10 sm:grid-cols-3">
							<div>
								<h3 className="text-sm font-semibold text-[#6366F1] mb-4">
									Shop
								</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											New Arrivals
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											Vintage Picks
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											Accessories
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-sm font-semibold text-[#6366F1] mb-4">
									Help
								</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											Support
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											Track Order
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											Return Policy
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-sm font-semibold text-[#6366F1] mb-4">
									Company
								</h3>
								<ul className="space-y-2 text-sm">
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											About Us
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											Careers
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#6366F1]">
											Contact
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<hr className="my-6 border-[#6366F1]/20" />
					<div className="flex flex-col md:flex-row md:justify-between items-center">
						<p className="text-sm text-[#F9FAFB]/70 mb-4 md:mb-0">
							© 2025 VintageBikes. All rights reserved.
						</p>
						<div className="flex gap-6">
							<a href="#" className="text-[#F9FAFB] hover:text-[#6366F1]">
								<Facebook size={18} />
							</a>
							<a href="#" className="text-[#F9FAFB] hover:text-[#6366F1]">
								<Instagram size={18} />
							</a>
							<a href="#" className="text-[#F9FAFB] hover:text-[#6366F1]">
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
