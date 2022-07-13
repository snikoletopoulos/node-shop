import { RequestHandler } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../app";

export const getLogin: RequestHandler = (req, res) => {
	res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
	});
};

export const postLogin: RequestHandler = async (req, res) => {
	const { email, password } = req.body as { email: string; password: string };
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: { email },
			select: {
				id: true,
				email: true,
				name: true,
				password: true,
			},
		});

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			throw new Error("Invalid credentials");
		}

		req.session.user = {
			id: user.id,
			email: user.email,
			name: user.name,
		};

		req.session.save(err => {
			if (err) {
				console.log(err);
			}
			res.redirect("/");
		});
	} catch (error) {
		console.log(error);
		res.redirect("/login");
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

export const getSignup: RequestHandler = (req, res) => {
	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
	});
};

export const postSignup: RequestHandler = async (req, res) => {
	const { name, email, password, confirmPassword } = req.body as {
		[key: string]: string;
	};

	try {
		await prisma.user.create({
			data: {
				email,
				name,
				password: await bcrypt.hash(password, 12),
				cart: { items: [] },
			},
		});

		res.redirect("/login");
	} catch (error) {
		console.error(error);
		res.redirect("/signup");
	}
};
