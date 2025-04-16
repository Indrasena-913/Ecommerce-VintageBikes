import prisma from "../PrismaClient.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckout = async (req, res) => {
	const { cartItems, userId } = req.body;

	try {
		const productIds = cartItems
			.map((item) => item.product?.id)
			.filter((id) => id !== undefined && id !== null);

		if (productIds.length === 0) {
			return res
				.status(400)
				.json({ error: "No valid products provided in cart." });
		}

		const products = await prisma.product.findMany({
			where: {
				id: { in: productIds },
			},
			select: {
				id: true,
				price: true,
			},
		});

		const orderItems = cartItems.map((item) => {
			const product = products.find((p) => p.id === item.product?.id);
			return {
				productId: item.product?.id,
				quantity: item.quantity,
				price: product?.price ?? 0,
			};
		});

		const totalAmount = orderItems.reduce((sum, item) => {
			return sum + item.quantity * item.price;
		}, 0);

		const order = await prisma.order.create({
			data: {
				totalAmount,
				status: "pending",
				userId,
				orderItems: {
					create: orderItems,
				},
			},
		});

		const amountInCents = Math.round(totalAmount * 100);
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

export const confirmPayment = async (req, res) => {
	try {
		const { paymentIntentId } = req.body;

		if (!paymentIntentId) {
			return res.status(400).json({ message: "paymentIntentId is required" });
		}

		const payment = await prisma.payment.findUnique({
			where: {
				paymentIntentId,
			},
		});

		if (!payment) {
			return res.status(404).json({ message: "Payment not found" });
		}

		await prisma.order.update({
			where: { id: payment.orderId },
			data: { status: "delivered" },
		});

		res.status(200).json({ message: "Payment confirmed successfully" });
	} catch (error) {
		console.error("Error confirming payment:", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
