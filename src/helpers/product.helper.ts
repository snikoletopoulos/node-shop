import Product from "models/product";
import fs from "fs";

export const getProductFromFile = (
	filePath: string,
	callback: (products: Product[]) => void
) => {
	fs.readFile(filePath, (error, fileContent) => {
		if (error) {
			return callback([]);
		} else {
			const products = JSON.parse(fileContent.toString());
			callback(products);
		}
	});
};
