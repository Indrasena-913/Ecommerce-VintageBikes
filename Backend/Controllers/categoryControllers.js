import prisma from "../PrismaClient.js";

export const GetCategories = async (req, res) => {
	try {
		const categories = await prisma.category.findMany();
		console.log(categories);

		res.json(categories);
	} catch (error) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ message: "Failed to fetch categories" });
	}
};
