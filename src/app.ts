import path from "path";
import express from "express";

import dotenv from "dotenv";
import dotenvExpoand from "dotenv-expand";
dotenvExpoand.expand(dotenv.config());

import adminRouter from "./routes/admin.routes";
import shopRouter from "./routes/shop.routes";
import { get404 } from "./controllers/error.controllers";
import mongoose from "mongoose";
import User from "./models/user";

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
	try {
		const user = await User.findByPk(1);

		if (!user) {
			throw new Error("User not found");
		}

		req.user = user;

		next();
	} catch (error) {
		console.log(error);
	}
});

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(get404);

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined");
}

mongoose
	.connect(process.env.DATABASE_URL)
	.then(async () => {
		if (!User.findOne()) {
			const user = new User({
				name: "John",
				email: "example@example.com",
				cart: { items: [] },
			});

			await user.save();
		}
		app.listen(3000);
	})
	.catch(error => console.log(error));
