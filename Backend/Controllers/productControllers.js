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

export const GetOneProduct = async (req, res) => {
	try {
		const { id } = req.params;

		const productId = parseInt(id, 10);
		if (isNaN(productId)) {
			return res.status(400).json({ message: "Invalid product ID" });
		}

		const product = await prisma.product.findUnique({
			where: {
				id: productId,
			},
			include: {
				category: true,
			},
		});

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json(product);
	} catch (error) {
		console.error("Error fetching product:", error);
		res.status(500).json({ message: "Failed to fetch product" });
	}
};
