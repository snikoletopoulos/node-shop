import { RequestHandler } from "express";

export const isAuth: RequestHandler = (req, res, next) => {
	if (!req.session.user) return res.redirect("/login");

	next();
};
