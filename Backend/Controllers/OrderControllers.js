import prisma from "../PrismaClient.js";

export const GetOrders = async (req, res) => {
	const userId = parseInt(req.params.userId);
	console.log("userId from orders", userId);

	try {
		const orders = await prisma.order.findMany({
			where: { userId },
			include: {
				orderItems: {
					include: {
						product: true,
					},
				},
				payment: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		const formattedOrders = orders.map((order) => {
			const productMap = new Map();

			order.orderItems.forEach((item) => {
				const existing = productMap.get(item.productId);
				if (existing) {
					existing.quantity += item.quantity;
					existing.totalPrice += item.price;
				} else {
					productMap.set(item.productId, {
						productId: item.product.id,
						name: item.product.name,
						image: item.product.image,
						quantity: item.quantity,
						price: item.price,
						totalPrice: item.price,
					});
				}
			});

			const groupedProducts = Array.from(productMap.values());

			return {
				id: order.id,
				totalAmount: order.totalAmount,
				status: order.status,
				createdAt: order.createdAt,
				payment: order.payment
					? {
							status: order.payment.status,
							amount: order.payment.amount,
							currency: order.payment.currency,
							createdAt: order.payment.createdAt,
					  }
					: null,
				products: groupedProducts,
			};
		});

		res.json(formattedOrders);
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ error: "Something went wrong" });
	}
};
