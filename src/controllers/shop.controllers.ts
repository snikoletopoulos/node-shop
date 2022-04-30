import type { RequestHandler } from "express";

import Cart from "../models/cart";
import Product from "../models/product";

export const getProducts: RequestHandler = async (req, res) => {
	try {
		const products = await Product.findAll();

		res.render("shop/product-list", {
			pageTitle: "All Products",
			path: "/products",
			prods: products,
			hasProducts: products.length > 0,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getProduct: RequestHandler = async (req, res, next) => {
	const { productId } = req.params;

	try {
		const product = await Product.findByPk(+productId);

		if (!product) {
			next();
			return;
		}

		res.render("shop/product-detail", {
			product,
			pageTitle: product.title,
			path: "/products",
		});
	} catch (error) {
		next();
		return;
	}
};

export const getIndex: RequestHandler = async (req, res) => {
	try {
		const products = await Product.findAll();

		res.render("shop/index", {
			pageTitle: "Shop",
			path: "/",
			prods: products,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getCart: RequestHandler = async (req, res) => {
	const cartProducts = await Cart.getProducts();
	res.render("shop/cart", {
		pageTitle: "Your Cart",
		path: "/cart",
		products: cartProducts,
	});
};

export const postCart: RequestHandler = async (req, res) => {
	const { productId } = req.body;
	await Cart.addProduct(+productId);

	res.redirect("/cart");
};

export const postCartDeleteProduct: RequestHandler = async (req, res) => {
	const { cartItemId } = req.body;
	await Cart.removeItem(+cartItemId);

	res.redirect("/cart");
};

export const getOrders: RequestHandler = (req, res) => {
	res.render("shop/orders", {
		pageTitle: "Your Orders",
		path: "/orders",
	});
};

export const getCheckout: RequestHandler = (req, res) => {
	res.render("shop/checkout", {
		pageTitle: "Checkout",
		path: "/checkout",
	});
};
