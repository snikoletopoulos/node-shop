import type { RequestHandler } from "express";

import Product from "../models/product";

export const addProduct: RequestHandler = (req, res) => {
	res.render("admin/add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		formsCSS: true,
		productCSS: true,
		activeAddProduct: true,
	});
};

export const postAddProduct: RequestHandler = (req, res) => {
	const product = new Product(req.body.title);
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
