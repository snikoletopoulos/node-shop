import type { RequestHandler } from "express";

const products: any[] = [];

export const addProduct: RequestHandler = (req, res) => {
	res.render("add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		formsCSS: true,
		productCSS: true,
		activeAddProduct: true,
	});
};

export const postAddProduct: RequestHandler = (req, res) => {
	products.push({ title: req.body.title });
	res.redirect("/");
};

export const getProducts: RequestHandler = (req, res) => {
	res.render("shop", {
		pageTitle: "Shop",
		path: "/",
		productCSS: true,
		activeShop: true,
		hasProducts: products.length > 0,
		prods: products,
	});
};
export const notFound: RequestHandler = (req, res) => {
	res.status(404).render("404", {
		pageTitle: "Page Not Found",
		path: "/404",
	});
};
