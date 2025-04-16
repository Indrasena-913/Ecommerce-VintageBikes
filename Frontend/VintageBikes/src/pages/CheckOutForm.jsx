import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { clearCart } from "../Redux/CartSlice";
import { addOrder } from "../Redux/MyOrderSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_API_URL } from "../api";
import BikeImage from "../assets/FinalDel.png";

const CheckoutForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);

	const cartItems = useSelector((state) => state.cart.items);
	const response = localStorage.getItem("user");
	const user = JSON.parse(response);
	const userId = user.userId;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!stripe || loading) return;

		setLoading(true);
		const token = localStorage.getItem("accessToken");

		try {
			const { data } = await axios.post(
				`${BASE_API_URL}/checkout`,
				{ cartItems, userId },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const clientSecret = data.clientSecret;

			const result = await stripe.confirmCardPayment(clientSecret, {
				payment_method: { card: elements.getElement(CardElement) },
			});

			if (result.error) {
				toast.error(result.error.message);
				setLoading(false);
			} else if (result.paymentIntent.status === "succeeded") {
				await axios.post(
					`${BASE_API_URL}/confirm-payment`,
					{ paymentIntentId: result.paymentIntent.id },
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				const newOrder = {
					userId,
					cartItems,
					paymentIntentId: result.paymentIntent.id,
					paymentStatus: result.paymentIntent.status,
					createdAt: new Date().toISOString(),
				};

				dispatch(addOrder(newOrder));

				setShowAnimation(true);

				setTimeout(() => {
					dispatch(clearCart());
					toast.success("Payment successful!");
					navigate("/my-orders");
				}, 4000);
			}
		} catch (err) {
			console.error("Payment failed:", err);
			toast.error("Payment failed. Try again.");
			setLoading(false);
		}
	};

	const bikeAnimationStyles = {
		animation: "bikeMove 4s ease-in-out forwards",
		position: "absolute",
		left: "-200px",
		height: "80px",
	};

	const keyframes = `
    @keyframes bikeMove {
      0% {
        left: -200px;
      }
      100% {
        left: 100%;
      }
    }
  `;

	if (showAnimation) {
		return (
			<>
				<style>{keyframes}</style>
				<div className="w-full h-screen flex flex-col items-center justify-center bg-white z-50">
					<p className="text-xl font-semibold mb-6">
						Your bike is on the way ➡️
					</p>
					<div className="relative w-full h-40 overflow-hidden scale-150">
						<img src={BikeImage} alt="bike" style={bikeAnimationStyles} />
					</div>
				</div>
			</>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={`max-w-md mx-auto p-6 bg-white rounded shadow space-y-6 mt-24 ${
				loading ? "opacity-50 pointer-events-none" : ""
			}`}
		>
			<h2 className="text-xl font-bold text-center">Checkout</h2>
			<CardElement className="p-4 border border-gray-300 rounded" />
			<button
				type="submit"
				disabled={!stripe || loading}
				className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
			>
				{loading ? "Processing..." : "Pay Now"}
			</button>
		</form>
	);
};

export default CheckoutForm;
