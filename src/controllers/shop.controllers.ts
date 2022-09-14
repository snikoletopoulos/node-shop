import type { RequestHandler } from "express";
import { z } from "zod";
import validator from "validator";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

import { prisma } from "../app";
import { Order } from "@prisma/client";

const ITEMS_PER_PAGE = 2;

const paginationQueryParams = z.object({
	page: z
		.string()
		.refine(page => validator.isNumeric(page))
		.transform(Number)
		.optional(),
});

export const getProducts: RequestHandler = async (req, res, next) => {
	const { page = 1 } = paginationQueryParams.parse(req.query);

	try {
		const productCount = await prisma.product.count();
		const products = await prisma.product.findMany({
			skip: ITEMS_PER_PAGE * (page - 1),
			take: ITEMS_PER_PAGE,
		});

		res.render("shop/product-list", {
			pageTitle: "All Products",
			path: "/products",
			prods: products,
			hasProducts: products.length > 0,
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < productCount,
			hasPreviousPage: page > 1,
			lastPage: Math.ceil(productCount / ITEMS_PER_PAGE),
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

export const getProduct: RequestHandler = async (req, res, next) => {
	const { productId } = req.params;

	try {
		const product = await prisma.product.findUnique({
			where: {
				id: productId,
			},
		});

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
		if (!(error instanceof Error)) throw error;
		const customError = {
			...error,
			httpCode: 500,
		};
		next(customError);
	}
};

export const getIndex: RequestHandler = async (req, res, next) => {
	const { page = 1 } = paginationQueryParams.parse(req.query);

	try {
		const productCount = await prisma.product.count();
		const products = await prisma.product.findMany({
			skip: ITEMS_PER_PAGE * (page - 1),
			take: ITEMS_PER_PAGE,
		});

		res.render("shop/index", {
			pageTitle: "Shop",
			path: "/",
			prods: products,
			currentPage: page,
			hasNextPage: ITEMS_PER_PAGE * page < productCount,
			hasPreviousPage: page > 1,
			lastPage: Math.ceil(productCount / ITEMS_PER_PAGE),
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

export const getCart: RequestHandler = async (req, res, next) => {
	try {
		if (!req.session.user) return res.redirect("/");

		const user = await prisma.user.findUnique({
			where: {
				id: req.session.user.id,
			},
		});

		const cart = user?.cart;

		const cartProducts = await prisma.product.findMany({
			where: {
				id: {
					in: cart?.items.map(item => item.productId),
				},
			},
		});

		const cartProductsWithQuantity = cartProducts.map(product => ({
			...product,
			quantity:
				cart?.items.find(item => item.productId === product.id)?.quantity ?? 0,
		}));

		res.render("shop/cart", {
			pageTitle: "Your Cart",
			path: "/cart",
			products: cartProductsWithQuantity,
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

export const postCart: RequestHandler = async (req, res, next) => {
	if (!req.session.user) return res.redirect("/");

	const { productId } = req.body as { productId: string };

	try {
		await prisma.product.findUniqueOrThrow({
			where: {
				id: productId,
			},
		});

		const user = await prisma.user.findUniqueOrThrow({
			where: {
				id: req.session.user.id,
			},
		});

		const cartItems = user?.cart?.items ?? [];

		const selectedItem = cartItems.findIndex(
			item => item.productId === productId
		);
		if (selectedItem !== -1) {
			cartItems[selectedItem].quantity++;
		} else {
			cartItems.push({
				productId,
				quantity: 1,
			});
		}

		await prisma.user.update({
			where: {
				id: req.session.user.id,
			},
			data: {
				v: {
					increment: 1,
				},
				cart: {
					items: cartItems,
				},
			},
		});

		res.redirect("/cart");
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		const customError = {
			...error,
			httpCode: 500,
		};
		next(customError);
	}
};

export const postCartDeleteProduct: RequestHandler = async (req, res, next) => {
	if (!req.session.user) return res.redirect("/");
	const { cartItemId } = req.body;

	try {
		const { cart } = await prisma.user.findUniqueOrThrow({
			where: {
				id: req.session.user.id,
			},
			select: {
				cart: true,
			},
		});

		await prisma.user.update({
			where: {
				id: req.session.user.id,
			},
			data: {
				cart: {
					items: cart?.items.filter(item => item.productId !== cartItemId),
				},
			},
		});

		res.redirect("/cart");
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		const customError = {
			...error,
			httpCode: 500,
		};
		next(customError);
	}
};

export const getCheckout: RequestHandler = async (req, res, next) => {
	if (!req.session.user) return res.redirect("/");

	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.session.user.id,
			},
		});

		const cart = user?.cart;

		const cartProducts = await prisma.product.findMany({
			where: {
				id: {
					in: cart?.items.map(item => item.productId),
				},
			},
		});

		const cartProductsWithQuantity = cartProducts.map(product => ({
			...product,
			quantity:
				cart?.items.find(item => item.productId === product.id)?.quantity ?? 0,
		}));

		const totalSum = cartProductsWithQuantity.reduce((total, product) => {
			return total + product.price * product.quantity;
		}, 0);

		res.render("shop/checkout", {
			pageTitle: "Checkout",
			path: "/checkout",
			products: cartProductsWithQuantity,
			totalSum,
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

export const postOrder: RequestHandler = async (req, res, next) => {
	if (!req.session.user) return res.redirect("/");

	const { cart } = await prisma.user.findUniqueOrThrow({
		where: {
			id: req.session.user.id,
		},
		select: {
			cart: true,
		},
	});
	const newOrder = cart?.items ?? [];

	if (!newOrder.length) return res.status(400).redirect("/cart");

	try {
		prisma.$transaction([
			prisma.order.create({
				data: {
					user: {
						connect: {
							id: req.session.user.id,
						},
					},
					products: newOrder,
				},
			}),
			prisma.user.update({
				where: {
					id: req.session.user.id,
				},
				data: {
					cart: {
						items: [],
					},
				},
			}),
		]);
	} catch (error) {
		if (!(error instanceof Error)) throw error;
		const customError = {
			...error,
			httpCode: 500,
		};
		next(customError);
	}

	res.redirect("/orders");
};

export const getOrders: RequestHandler = async (req, res, next) => {
	if (!req.session.user) return res.redirect("/");

	try {
		const orders = await prisma.order.findMany({
			where: {
				userId: req.session.user.id,
			},
		});

		const fullOrders = orders.map(async order => {
			const productIds = order.products.map(product => product.productId);

			const products = await prisma.product.findMany({
				where: {
					id: {
						in: productIds,
					},
				},
			});

			return {
				orderId: order.id,
				products: products.map(product => ({
					...product,
					quantity:
						order.products.find(
							productInOrder => productInOrder.productId === product.id
						)?.quantity ?? 0,
				})),
			};
		});

		res.render("shop/orders", {
			pageTitle: "Your Orders",
			path: "/orders",
			orders: await Promise.all(fullOrders),
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

export const getInvoice: RequestHandler = async (req, res, next) => {
	const { orderId } = req.params;

	let order: Order;
	try {
		order = await prisma.order.findUniqueOrThrow({
			where: {
				id: orderId,
			},
		});

		if (order.userId !== req.session.user?.id) {
			return next(new Error("Unauthorized"));
		}
	} catch (error) {
		next(error);
		return;
	}

	try {
		const invoiceName = "invoice-" + orderId + ".pdf";
		const invoicePath = path.join(process.cwd(), "invoices", invoiceName);

		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

		const pdfDoc = new PDFDocument();
		pdfDoc.pipe(fs.createWriteStream(invoicePath));
		pdfDoc.pipe(res);

		pdfDoc.fontSize(26).text("Invoice", {
			underline: true,
		});

		pdfDoc.text("---------------------");
		let totalPrice = 0;
		order.products.forEach(async product => {
			const productData = await prisma.product.findUniqueOrThrow({
				where: {
					id: product.productId,
				},
			});

			totalPrice += productData.price * product.quantity;

			pdfDoc
				.fontSize(14)
				.text(
					productData.title +
						" - " +
						product.quantity +
						" x $" +
						productData.price
				);
		});

		pdfDoc.text("---");
		pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

		pdfDoc.end();
	} catch (error) {
		next(error);
	}
};
