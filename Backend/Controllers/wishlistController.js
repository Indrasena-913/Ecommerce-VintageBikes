import prisma from "../PrismaClient.js";

export const AddToWishlist = async (req, res) => {
	const { productId } = req.body;
	const { id } = req.user;

	try {
		const existingWishlistItem = await prisma.wishlist.findFirst({
			where: {
				userId: id,
				productId: productId,
			},
		});
		console.log("eeeeeeee", existingWishlistItem);

		if (existingWishlistItem) {
			await prisma.wishlist.delete({
				where: { id: existingWishlistItem.id },
			});
			return res.status(200).json({ message: "removed", action: "removed" });
		}

		const wishlistItem = await prisma.wishlist.create({
			data: {
				userId: id,
				productId: productId,
			},
		});

		return res
			.status(200)
			.json({ message: "added", wishlistItem, action: "added" });
	} catch (error) {
		console.error("Error toggling wishlist:", error);
		return res.status(500).json({ message: "Failed to toggle wishlist" });
	}
};

export const getWishlist = async (req, res) => {
	try {
		const { userId } = req.params;

		const wishlist = await prisma.wishlist.findMany({
			where: {
				userId: Number(userId),
			},
			include: {
				product: true,
			},
		});

		res.json(wishlist);
	} catch (error) {
		console.error("Error fetching wishlist:", error);
		res.status(500).json({ error: "Something went wrong" });
	}
};

export const RemoveFromWishlist = async (req, res) => {
	const { productId } = req.body;
	const { id } = req.user;

	try {
		const existingWishlistItem = await prisma.wishlist.findFirst({
			where: {
				userId: id,
				productId: productId,
			},
		});

		if (!existingWishlistItem) {
			return res.status(404).json({ message: "Product not found in wishlist" });
		}

		await prisma.wishlist.delete({
			where: {
				id: existingWishlistItem.id,
			},
		});

		return res.status(200).json({ message: "removed", action: "removed" });
	} catch (error) {
		console.error("Error removing from wishlist:", error);
		return res.status(500).json({ message: "Failed to remove from wishlist" });
	}
};
