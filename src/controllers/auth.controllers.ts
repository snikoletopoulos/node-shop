import { RequestHandler } from "express";
import { prisma } from "../app";

export const getLogin: RequestHandler = (req, res) => {
	res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
		isAuthenticated: !!req.session.user,
	});
};

export const postLogin: RequestHandler = async (req, res) => {
	try {
		req.session.user = await prisma.user.findUniqueOrThrow({
			where: {
				id: "627af4531f6eb14f3d128306",
			},
			select: {
				id: true,
				email: true,
				name: true,
			},
		});

		req.session.save(err => {
			if (err) {
				console.log(err);
			}
			res.redirect("/login");
		});
	} catch (error) {
		console.log(error);
	}
};

export const postLogout: RequestHandler = async (req, res) => {
	req.session.destroy(err => {
		if (err) {
			console.log(err);
		}
		res.redirect("/");
	});
};
