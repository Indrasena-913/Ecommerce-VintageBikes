import prisma from "../PrismaClient.js";

export const addToCart = async (req, res) => {
	const { productId, quantity } = req.body;
	const userId = req.user.id;

	try {
		const existingCartItem = await prisma.cartItem.findFirst({
			where: { userId, productId },
		});

		if (existingCartItem) {
			const updatedItem = await prisma.cartItem.update({
				where: { id: existingCartItem.id },
				data: {
					quantity: existingCartItem.quantity + quantity,
				},
			});
			return res.status(200).json(updatedItem);
		}

		const newCartItem = await prisma.cartItem.create({
			data: {
				userId,
				productId,
				quantity,
			},
		});
		return res.status(201).json(newCartItem);
	} catch (error) {
		console.error("Error adding to cart:", error);
		res
			.status(500)
			.json({ error: "Something went wrong while adding to cart" });
	}
};

export const getCart = async (req, res) => {
	const userId = req.user.id;

	try {
		const cartItems = await prisma.cartItem.findMany({
			where: { userId },
			include: {
				product: true,
			},
		});
		res.status(200).json(cartItems);
	} catch (error) {
		console.error("Error fetching cart:", error);
		res.status(500).json({ error: "Something went wrong while fetching cart" });
	}
};

export const removeFromCart = async (req, res) => {
	const userId = req.user.id;
	const productId = parseInt(req.params.productId);

	try {
		const cartItem = await prisma.cartItem.findFirst({
			where: { userId, productId },
		});

		if (!cartItem) {
			return res.status(404).json({ error: "Cart item not found" });
		}

		await prisma.cartItem.delete({ where: { id: cartItem.id } });

		const updatedCart = await prisma.cartItem.findMany({
			where: { userId },
			include: { product: true },
			orderBy: { createdAt: "asc" },
		});

		res.status(200).json(updatedCart);
	} catch (error) {
		console.error("Error removing item:", error);
		res.status(500).json({ error: "Failed to remove item from cart" });
	}
};

export const clearCart = async (req, res) => {
	const userId = req.user.id;

	try {
		await prisma.cartItem.deleteMany({
			where: { userId },
		});
		res.status(200).json({ message: "Cart cleared" });
	} catch (error) {
		console.error("Error clearing cart:", error);
		res.status(500).json({ error: "Failed to clear cart" });
	}
};

export const updateQuantity = async (req, res) => {
	const { productId } = req.params;
	const { quantity } = req.body;
	const userId = req.user.id;

	if (quantity < 1) {
		return res.status(400).json({ error: "Quantity must be greater than 0" });
	}

	try {
		const cartItem = await prisma.cartItem.findFirst({
			where: {
				userId,
				productId: parseInt(productId),
			},
		});

		if (!cartItem) {
			return res.status(404).json({ error: "Cart item not found" });
		}

		const updatedCartItem = await prisma.cartItem.update({
			where: { id: cartItem.id },
			data: { quantity: quantity },
			include: { product: true },
		});

		res.status(200).json(updatedCartItem);
	} catch (error) {
		console.error("Error updating quantity:", error);
		res.status(500).json({
			error: "Something went wrong while updating quantity",
			details:
				process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};
