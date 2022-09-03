import { ErrorRequestHandler } from "express";

export const errorMidleware: ErrorRequestHandler = (error, req, res, next) => {
	res.redirect("/500");
};
