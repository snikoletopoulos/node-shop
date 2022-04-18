import fs from "fs";
import path from "path";

const getProductFromFile = (callback: (products: Product[]) => void) => {
	const filePath = path.join(__dirname, "..", "data", "products.json");

	fs.readFile(filePath, (error, fileContent) => {
		if (error) {
			callback([]);
		}

		callback(JSON.parse(fileContent.toString()));
	});
};

class Product {
	constructor(public title: string) {}

	save() {
		const filePath = path.join(__dirname, "..", "data", "products.json");

		fs.readFile(filePath, (error, fileContent) => {
			let products: Product[] = [];
			if (!error) {
				products = JSON.parse(fileContent.toString());
			}

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
