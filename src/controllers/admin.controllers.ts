import type { RequestHandler } from "express";
import { prisma } from "../app";

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
		await prisma.product.create({
			data: {
				title,
				imageUrl,
				description,
				price: +price,
				user: {
					connect: {
						id: req.user.id,
					},
				},
			},
		});

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
		const product = await prisma.product.findUnique({
			where: {
				id: productId,
			},
		});

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
		// TODO check what happents if product is not found
		const product = await prisma.product.update({
			where: {
				id: productId,
			},
			data: {
				title,
				imageUrl,
				description,
				price: +price,
			},
		});

		if (!product) {
			res.redirect("/");
			return;
		}

		res.redirect("/admin/products");
	} catch (error) {
		console.log(error);
	}
};

export const getProducts: RequestHandler = async (req, res) => {
	const products = await prisma.product.findMany();

	res.render("admin/products", {
		pageTitle: "Admin Products",
		path: "/admin/products",
		prods: products,
	});
};

export const postDeleteProduct: RequestHandler = async (req, res) => {
	const { productId } = req.body;

	try {
		await prisma.product.delete({
			where: {
				id: productId,
			},
		});
	} catch (error) {
		console.log(error);
	}

	res.redirect("/admin/products");
};
