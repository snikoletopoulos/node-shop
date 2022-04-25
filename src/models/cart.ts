import path from "path";
import fs from "fs/promises";

import { baseFilePath } from "../constants/files.constants";
import CartItem from "./cart-item";

class Cart {
	static products: CartItem[] = [];
	static totalPrice = 0;

	static readonly filePath = path.join(baseFilePath, "cart.json");

	static getObject() {
		return {
			products: Cart.products,
			totalPrice: Cart.totalPrice,
		};
	}

	static async addProduct(id: number) {
		return Cart.updateCart(async () => {
			const existingProductIndex = Cart.products.findIndex(
				product => product.id === id
			);

			let updatedCartItem: CartItem;
			if (existingProductIndex !== -1) {
				updatedCartItem = Cart.products[existingProductIndex];
				updatedCartItem.quantity += 1;
			} else {
				updatedCartItem = new CartItem(id, 1);
				Cart.products.push(updatedCartItem);
			}

			const product = await updatedCartItem.getProduct();
			Cart.totalPrice += product.price;
		});
	}

	static async getCart() {
		try {
			const fileContent = await fs.readFile(Cart.filePath);
			const cart = JSON.parse(fileContent.toString());
			Cart.products = cart.products.map(
				(cartItemData: CartItem) =>
					new CartItem(cartItemData.id, cartItemData.quantity)
			);
			Cart.totalPrice = +cart.totalPrice;

			return cart;
		} catch (error) {
			console.log(error);
		}
	}

	static async getProducts() {
		await Cart.getCart();
		const products = await Promise.all(
			Cart.products.map(async cartItem => {
				const product = await cartItem.getProduct();
				return {
					...product,
					quantity: cartItem.quantity,
				};
			})
		);
		return products;
	}

	static updateFileCart() {
		fs.writeFile(Cart.filePath, JSON.stringify(Cart.getObject())).catch(
			error => {
				if (error) {
					console.log(error);
				}
			}
		);
	}

	static async updateCart<T>(callback: () => Promise<T>) {
		await Cart.getCart();
		const response = await callback();
		Cart.updateFileCart();
		return response;
	}
}

export default Cart;
