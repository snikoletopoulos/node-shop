import fs from "fs/promises";
import path from "path";

class Product {
	public id: number | null = null;

	static readonly filePath = path.join(
		__dirname,
		"..",
		"data",
		"products.json"
	);

	constructor(
		public title: string,
		public imageUrl: string,
		public description: string,
		public price: number
	) {}

	save() {
		this.id = Math.random();
		Product.fetchAll(products => {
			products.push(this);

			fs.writeFile(Product.filePath, JSON.stringify(products)).catch(error => {
				if (error) {
					console.error(error);
				}
			});
		});
	}

	static async fetchAll(
		callback?: (products: Product[]) => void
	): Promise<Product[] | void> {
		try {
			const fileContent = await fs.readFile(this.filePath);

			const products = JSON.parse(fileContent.toString());
			return callback ? callback(products) : products;
		} catch (error) {
			return callback ? callback([]) : [];
		}
	}

	static async findById(id: number) {
		const products = await this.fetchAll();
	}
}

export default Product;
