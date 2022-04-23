import type { RequestHandler } from "express";

import Product from "../models/product";

export const getProducts: RequestHandler = (req, res) => {
	Product.fetchAll(products => {
		res.render("shop/product-list", {
			pageTitle: "All Products",
			path: "/products",
			prods: products,
			productCSS: true,
			activeShop: true,
			hasProducts: products.length > 0,
		});
	});
};

export const getProduct: RequestHandler = async (req, res, next) => {
	const { productId } = req.params;

	let product: Product;
	try {
		product = await Product.findById(+productId);
		console.log(product);
	} catch (error) {
		console.error(error);
		next();
		return;
	}

	res.render("shop/product-detail", {
		product,
		pageTitle: product.title,
		path: "/products",
	});
};

export const getIndex: RequestHandler = (req, res) => {
	Product.fetchAll(products => {
		res.render("shop/index", {
			pageTitle: "Shop",
			path: "/",
			prods: products,
		});
	});
};

export const getCart: RequestHandler = (req, res) => {
	res.render("shop/cart", {
		pageTitle: "Your Cart",
		path: "/cart",
	});
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
