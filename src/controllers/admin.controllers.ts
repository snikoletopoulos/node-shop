import type { RequestHandler } from "express";

import Product from "../models/product";

export const getAddProduct: RequestHandler = (req, res) => {
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
	});
};

export const postAddProduct: RequestHandler = async (req, res) => {
	const { title, imageUrl, description, price } = req.body;

	try {
		const product = new Product({
			title,
			imageUrl,
			description,
			price,
		});

		await product.save();

		res.redirect("/");
	} catch (error) {
		console.log(error);
	}
};

export const getEditProduct: RequestHandler = async (req, res) => {
	const editMode = req.query.edit;

	if (!editMode) {
		res.redirect("/");
		return;
	}

	const { productId } = req.params;

	try {
		const product = await Product.findById(productId);

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

export const postEditProduct: RequestHandler = async (req, res) => {
	const { productId, title, imageUrl, description, price } = req.body as {
		[x: string]: string;
	};

	try {
		const product = await Product.findById(productId);

		if (!product) {
			res.redirect("/");
			return;
		}

		product.title = title;
		product.imageUrl = imageUrl;
		product.description = description;
		product.price = +price;

		await product.save();

		res.redirect("/admin/products");
	} catch (error) {
		console.log(error);
	}
};

export const getProducts: RequestHandler = async (req, res) => {
	const products = await Product.find();

	res.render("admin/products", {
		pageTitle: "Admin Products",
		path: "/admin/products",
		prods: products,
	});
};

export const postDeleteProduct: RequestHandler = async (req, res) => {
	const { productId } = req.body;

	try {
		const product = await Product.findById(productId);

		if (!product) {
			res.redirect("/");
			return;
		}

		await product.remove();
	} catch (error) {
		console.log(error);
	}

	res.redirect("/admin/products");
};
