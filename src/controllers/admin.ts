import type { RequestHandler } from "express";

import Product from "../models/product";

export const addProduct: RequestHandler = (req, res) => {
	res.render("admin/add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
	});
};

export const postAddProduct: RequestHandler = (req, res) => {
	const { title, imageUrl, description, price } = req.body;

	const product = new Product(title, imageUrl, description, +price);
	product.save();

	res.redirect("/");
};

export const getProducts: RequestHandler = (req, res) => {
	Product.fetchAll(products => {
		res.render("admin/products", {
			pageTitle: "Admin Products",
			path: "/admin/products",
			prods: products,
		});
	});
};
