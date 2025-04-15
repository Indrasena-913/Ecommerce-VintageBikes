import axios from "axios";
import toast from "react-hot-toast";
import { BASE_API_URL } from "../api";

export const toggleWishlist = async (productId) => {
	try {
		const token = localStorage.getItem("accessToken");

		if (!token) {
			toast.error("Please login to manage your wishlist.");
			return { success: false };
		}

		const res = await axios.post(
			`${BASE_API_URL}/wishlist`,
			{ productId },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		console.log(res);

		if (res.data.message === "added") {
			toast.success("Added to wishlist");
		} else if (res.data.message === "removed") {
			toast("Removed from wishlist", { icon: "💔" });
		}

		return { success: true, action: res.data.message };
	} catch (err) {
		console.error("Wishlist toggle error:", err);
		toast.error("Could not update wishlist. Try again.");
		return { success: false };
	}
};
