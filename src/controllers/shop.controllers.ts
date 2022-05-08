import type { RequestHandler } from "express";

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
	try {
		if (!req.user) {
			res.redirect("/");
		}

		const cart = await req.user.getCart();

		const cartProducts = await cart.getProducts();

		res.render("shop/cart", {
			pageTitle: "Your Cart",
			path: "/cart",
			products: cartProducts,
		});
	} catch (error) {
		console.log(error);
	}
};

export const postCart: RequestHandler = async (req, res) => {
	const { productId } = req.body;

	try {
		const cart = await req.user.getCart();

		const products = await cart.getProducts({ where: { id: productId } });

		let product: Product;
		if (products.length) {
			product = products[0];
		}

		let newQuantity = 1;
		if (product) {
			const oldQuantity = product.cartItem.quantity;
			newQuantity += oldQuantity;
		} else {
			product = await Product.findById(+productId);
		}

		await cart.addProduct(product, { through: { quantity: newQuantity } });

		res.redirect("/cart");
	} catch (error) {
		console.log(error);
	}
};

export const postCartDeleteProduct: RequestHandler = async (req, res) => {
	const { cartItemId } = req.body;
	if (!req.user) {
		res.redirect("/");
		return;
	}

	try {
		const cart = await req.user.getCart();

		const [product] = await cart.getProducts({ where: { id: cartItemId } });

		await product.cartItem.destroy();

		res.redirect("/cart");
	} catch (error) {
		console.log(error);
	}
};

export const postOrder: RequestHandler = async (req, res) => {
	if (!req.user) {
		res.redirect("/");
		return;
	}

	const cart = await req.user.getCart();

	const products = await cart.getProducts();

	const newOrder = await req.user.createOrder();

	await newOrder.addProducts(
		products.map(product => ({
			...product,
			orderItem: {
				quantity: product.cartItem.quantity,
			},
		}))
	);

	await cart.setProducts([]);

	res.redirect("/orders");
};

export const getOrders: RequestHandler = async (req, res) => {
	if (!req.user) {
		res.redirect("/");
		return;
	}

	try {
		const orders = await req.user.getOrders({ include: ["products"] });

		res.render("shop/orders", {
			pageTitle: "Your Orders",
			path: "/orders",
			orders,
		});
	} catch (error) {
		console.log(error);
	}
};
