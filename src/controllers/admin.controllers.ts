import type { RequestHandler } from "express";
import * as z from "zod";
import validator from "validator";

import { prisma } from "../app";

export const getAddProduct: RequestHandler = (req, res) => {
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
		hasErrors: false,
		errorMessage: false,
		validationErrors: [],
	});
};

const postProductSchema = z.object({
	title: z.string().min(1).trim(),
	price: z
		.string()
		.min(0)
		.transform(price => +price),
	description: z.string().min(5).max(400),
	imageUrl: z.string().refine(url => validator.isURL(url)),
});

export const postAddProduct: RequestHandler = async (req, res, next) => {
	if (!req.session.user) return res.redirect("/");

	let requestBody: z.infer<typeof postProductSchema>;
	try {
		requestBody = postProductSchema.parse(req.body);
	} catch (error) {
		if (!(error instanceof z.ZodError)) throw error;

		res.status(422).render("admin/edit-product", {
			pageTitle: "Add Product",
			path: "/admin/add-product",
			editing: false,
			product: req.body,
			hasErrors: true,
			validationErrors: error.flatten(),
			errorMessage: error.issues.map(error => error.message).join("\n"),
		});
		return;
	}
	const { title, imageUrl, description, price } = requestBody;

	try {
		await prisma.product.create({
			data: {
				title,
				imageUrl,
				description,
				price: +price,
				user: {
					connect: {
						id: req.session.user.id,
					},
				},
			},
		});

		res.redirect("/");
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		const customError = {
			...error,
			httpCode: 500,
		};
		next(customError);
	}
};

export const getEditProduct: RequestHandler = async (req, res, next) => {
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
			hasErrors: false,
		});
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		const customError = {
			...error,
			httpCode: 500,
		};
		next(customError);
	}
};

const postEditProductSchema = z.object({
	productId: z.string().min(1),
	title: z.string().min(3).trim(),
	imageUrl: z
		.string()
		.min(5)
		.max(400)
		.trim()
		.refine(url => validator.isURL(url)),
	price: z.number(),
	description: z.string().min(5).max(400).trim(),
});

export const postEditProduct: RequestHandler = async (req, res, next) => {
	if (!req.session.user) return res.redirect("/");

	let requestBody: z.infer<typeof postEditProductSchema>;
	try {
		requestBody = postEditProductSchema.parse(req.body);
	} catch (error) {
		if (!(error instanceof z.ZodError)) throw error;

		res.status(422).render("admin/edit-product", {
			pageTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: true,
			product: {
				...req.body,
				id: req.body.productId,
			},
			hasErrors: true,
			validationErrors: error.flatten(),
			errorMessage: error.issues.map(error => error.message).join("\n"),
		});
		return;
	}

	const { productId, title, imageUrl, description, price } = requestBody;

	try {
		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				user: {
					id: req.session.user.id,
				},
			},
		});

		if (!product) throw new Error("Product not found");

		await prisma.product.update({
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

		res.redirect("/admin/products");
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		const customError = {
			...error,
			httpCode: 500,
		};
		next(customError);
	}
};

export const getProducts: RequestHandler = async (req, res) => {
	if (!req.session.user) return res.redirect("/");

	const products = await prisma.product.findMany({
		where: {
			user: {
				id: req.session.user.id,
			},
		},
	});

	res.render("admin/products", {
		pageTitle: "Admin Products",
		path: "/admin/products",
		prods: products,
		isAuthenticated: !!req.session.user,
	});
};

export const postDeleteProduct: RequestHandler = async (req, res, next) => {
	if (!req.session.user) return res.redirect("/");
	const { productId } = req.body;

	try {
		await prisma.product.findFirstOrThrow({
			where: {
				id: productId,
				user: {
					id: req.session.user.id,
				},
			},
		});

		await prisma.product.delete({
			where: {
				id: productId,
			},
		});
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		const customError = {
			...error,
			httpCode: 500,
		};
		next(customError);
	}

	res.redirect("/admin/products");
};
