import type { RequestHandler } from "express";

import Product from "../models/product";

export const getAddProduct: RequestHandler = (req, res) => {
	res.render("admin/edit-product", {
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

export const getEditProduct: RequestHandler = async (req, res) => {
	const editMode = req.query.edit;

	if (!editMode) {
		res.redirect("/");
		return;
	}

	const { productId } = req.params;

	try {
		const product = await Product.findById(+productId);

		if (!product) {
			throw new Error("Product not found");
		}

		res.render("admin/edit-product", {
			pageTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: editMode,
			product,
		});
	} catch (error) {
		console.log(error);
		res.redirect("/");
	}
};

export const postEditProduct: RequestHandler = async (req, res) => {};

export const getProducts: RequestHandler = (req, res) => {
	Product.fetchAll(products => {
		res.render("admin/products", {
			pageTitle: "Admin Products",
			path: "/admin/products",
			prods: products,
		});
	});
};
