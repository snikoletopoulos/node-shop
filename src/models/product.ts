import fs from "fs";
import path from "path";

import { getProductFromFile } from "../helpers/product.helper";

const filePath = path.join(__dirname, "..", "data", "products.json");

class Product {
	public id: number | null = null;

	constructor(
		public title: string,
		public imageUrl: string,
		public description: string,
		public price: number
	) {}

	save() {
		this.id = Math.random();
		getProductFromFile(filePath, products => {
			products.push(this);

			fs.writeFile(filePath, JSON.stringify(products), error => {
				if (error) {
					console.error(error);
				}
			});
		});
	}

	static fetchAll = getProductFromFile.bind(this, filePath);
}

export default Product;
