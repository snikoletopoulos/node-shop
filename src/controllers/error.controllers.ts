import type { RequestHandler } from "express";

export const get404: RequestHandler = (req, res) => {
	res.status(404).render("404", {
		pageTitle: "Page Not Found",
		path: "/404",
	});
};
