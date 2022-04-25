import fs from "fs/promises";
import path from "path";

import { baseFilePath } from "../constants/files.constants";
import Cart from "./cart";

class Product {
	static readonly filePath = path.join(baseFilePath, "products.json");

	constructor(
		public id: number | null,
		public title: string,
		public imageUrl: string,
		public description: string,
		public price: number
	) {}

	save() {
		Product.fetchAll(products => {
			if (this.id) {
				const existingProductIndex = products.findIndex(
					prod => prod.id === this.id
				);

				const updatedProduct = [...products];
				updatedProduct[existingProductIndex] = this;

				fs.writeFile(Product.filePath, JSON.stringify(updatedProduct)).catch(
					error => {
						if (error) {
							console.error(error);
						}
					}
				);
			} else {
				this.id = Math.random();
				products.push(this);

				fs.writeFile(Product.filePath, JSON.stringify(products)).catch(
					error => {
						if (error) {
							console.error(error);
						}
					}
				);
			}
		});
	}

	static deleteById(id: number) {
		Product.fetchAll(async products => {
			const updatedProducts = products.filter(prod => prod.id !== id);

			try {
				await Cart.deleteProduct(id);
				await fs.writeFile(Product.filePath, JSON.stringify(updatedProducts));
			} catch (error) {
				console.log(error);
			}
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

		if (!products) {
			throw new Error("No products found.");
		}

		const product = products.find(product => product.id === id);

		if (!product) {
			throw new Error("Incorect product ID");
		}

		return product;
	}
}

export default Product;
