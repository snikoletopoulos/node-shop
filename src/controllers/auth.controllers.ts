import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";
import * as z from "zod";

import { prisma } from "../app";

if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL)
	throw new Error("Sendgrid env variables are not defined");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const getLogin: RequestHandler = (req, res) => {
	const message = req.flash("error");

	res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
		errorMessage: message.length ? message : null,
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
		req.flash("error", "Invalid credentials");
		req.session.save(err => {
			if (err) {
				console.log(err);
			}
			res.redirect("/login");
		});
		console.log(error);
		// return res.redirect("/login");
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
	const message = req.flash("error");

	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		errorMessage: message.length ? message : null,
		initialValues: null,
		validationErrors: null,
	});
};

const postSignupSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1, { message: "Name must be at least 1 character" }),
		email: z
			.string()
			.trim()
			.email()
			.refine(
				async email =>
					email
						? !(await prisma.user.findUnique({
								where: { email },
						  }))
						: true,
				{ message: "Email already exists" }
			),
		password: z
			.string()
			.trim()
			.min(5, { message: "Password must be at least 5 characters" }),
		confirmPassword: z.string(),
	})
	.refine(({ password, confirmPassword }) => password === confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
export const postSignup: RequestHandler = async (req, res) => {
	let parsedBody: z.infer<typeof postSignupSchema>;
	try {
		parsedBody = await postSignupSchema.parseAsync(req.body);
	} catch (error) {
		if (!(error instanceof z.ZodError)) {
			req.flash("error", "Invalid credentials");
			return;
		}
		console.log(error.flatten());
		res.status(422).render("auth/signup", {
			path: "/signup",
			pageTitle: "Signup",
			errorMessage: error.issues.map(error => error.message).join("\n"),
			initialValues: {
				name: req.body.name,
				email: req.body.email,
			},
			validationErrors: error.flatten(),
		});
		return;
	}

	const { name, email, password } = parsedBody;

	try {
		await prisma.user.create({
			data: {
				email,
				name,
				password: await bcrypt.hash(password, 12),
				cart: { items: [] },
			},
		});

		sgMail.send({
			to: email,
			from: process.env.SENDGRID_FROM_EMAIL ?? "",
			subject: "Signup succeeded",
			html: `<h1>You successfully signed up!</h1>`,
		});

		res.redirect("/login");
	} catch (error) {
		res.redirect("/signup");
	}
};

export const getReset: RequestHandler = (req, res) => {
	const message = req.flash("error");

	res.render("auth/reset", {
		path: "/reset",
		pageTitle: "Reset Password",
		errorMessage: message.length ? message : null,
	});
};

export const postReset: RequestHandler = async (req, res) => {
	crypto.randomBytes(32, async (error, buffer) => {
		if (error) {
			console.log(error);
			req.flash("error", "Something went wrong");
			return res.redirect("/reset");
		}

		const token = buffer.toString("hex");

		try {
			const user = await prisma.user.findUniqueOrThrow({
				where: { email: req.body.email },
				select: { id: true, email: true },
			});

			await prisma.user.update({
				where: { id: user.id },
				data: {
					resetToken: token,
					resetTokenExpiration: new Date(Date.now() + 1000 * 60 * 60 * 1),
				},
			});

			sgMail.send({
				to: user.email,
				from: process.env.SENDGRID_FROM_EMAIL ?? "",
				subject: "Password reset",
				html: `
				<p>You requested a password reset. Click the link below to reset your password:</p>
				<p>
					<a href="http://localhost::3000/reset/${token}">Reset Password</a>
				</p>`,
			});

			res.redirect("/login");
		} catch (error) {
			req.flash("error", "No user with that e-mail found");
			return res.redirect("/reset");
		}
	});
};

export const getResetPassword: RequestHandler = async (req, res) => {
	const token = req.params.token;

	try {
		const user = await prisma.user.findFirst({
			where: {
				resetToken: token,
				resetTokenExpiration: {
					gt: new Date(),
				},
			},
		});

		if (!user) throw new Error("Invalid token");

		const message = req.flash("error");

		res.render("auth/new-password", {
			path: "/reset",
			pageTitle: "Reset Password",
			errorMessage: message.length ? message : null,
			userId: user.id.toString(),
			passwordToken: token,
		});
	} catch (error) {
		console.log(error);
		req.flash("error", "Invalid token");
		res.redirect("/reset");
	}
};

export const postResetPassword: RequestHandler = async (req, res) => {
	const { password, confirmPassword, userId, passwordToken } = req.body as {
		password: string;
		confirmPassword: string;
		userId: string;
		passwordToken: string;
	};

	if (password !== confirmPassword) throw new Error("Passwords do not match");

	try {
		const user = await prisma.user.findFirst({
			where: {
				id: userId,
				resetToken: passwordToken,
				resetTokenExpiration: {
					gt: new Date(),
				},
			},
			select: { id: true, email: true },
		});

		if (!user) throw new Error("Invalid token");

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: await bcrypt.hash(password, 12),
				resetToken: undefined,
				resetTokenExpiration: undefined,
			},
		});

		res.redirect("/login");
	} catch (error) {
		console.log(error);
		req.flash("error", "Invalid token");
		res.redirect("/reset-password");
	}
};
