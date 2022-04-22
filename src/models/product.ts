import fs from "fs";
import path from "path";

const getProductFromFile = (callback: (products: Product[]) => void) => {
	fs.readFile(filePath, (error, fileContent) => {
		if (error) {
			return callback([]);
		} else {
			const products = JSON.parse(fileContent.toString());
			callback(products);
		}
	});
};

const filePath = path.join(__dirname, "..", "data", "products.json");

class Product {
	constructor(
		public title: string,
		public imageUrl: string,
		public description: string,
		public price: number
	) {}

	save() {
		getProductFromFile(products => {
			products.push(this);

			fs.writeFile(filePath, JSON.stringify(products), error => {
				if (error) {
					console.error(error);
				}
			});
		});
	}

	static fetchAll = getProductFromFile;
}

export default Product;
