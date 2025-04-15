import prisma from "../PrismaClient.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckout = async (req, res) => {
	const { cartItems, userId } = req.body;

	try {
		const totalAmount = cartItems.reduce((sum, item) => {
			return sum + item.price * item.quantity;
		}, 0);
		const amountInCents = Math.round(totalAmount * 100);

		const order = await prisma.order.create({
			data: {
				totalAmount,
				status: "PENDING",
				userId,
				orderItems: {
					create: cartItems.map((item) => ({
						productId: item.productId,
						quantity: item.quantity,
						price: item.price,
					})),
				},
			},
		});

		const paymentIntent = await stripe.paymentIntents.create({
			amount: amountInCents,
			currency: "usd",
			metadata: { orderId: order.id.toString() },
		});

		await prisma.payment.create({
			data: {
				paymentIntentId: paymentIntent.id,
				amount: amountInCents,
				currency: "usd",
				status: "created",
				orderId: order.id,
				userId,
			},
		});

		res.status(200).json({ clientSecret: paymentIntent.client_secret });
	} catch (error) {
		console.error("Checkout error:", error);
		res.status(500).json({ error: "Checkout failed", details: error.message });
	}
};
