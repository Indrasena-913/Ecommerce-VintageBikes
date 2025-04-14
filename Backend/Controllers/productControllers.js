import prisma from "../PrismaClient.js";

export const GetProducts = async (req, res) => {
	try {
		const products = await prisma.product.findMany({
			include: {
				category: true,
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		res.json(products);
	} catch (error) {
		console.error("Error fetching products:", error);
		res.status(500).json({ message: "Failed to fetch products" });
	}
};
