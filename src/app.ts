import path from "path";
import express from "express";

import "dotenv/config";

import adminRouter from "./routes/admin.routes";
import shopRouter from "./routes/shop.routes";
import { get404 } from "./controllers/error.controllers";
import sequelize from "./helpers/db.helpers";
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

(async () => {
	try {
		await sequelize.sync({ force: true });

		let user = await User.findByPk(1);

		if (!user) {
			user = await User.create({
				name: "Nikero",
				email: "nikero@test.com",
			});
		}

		await user.createCart();

		console.log(user);

		app.listen(3000);
	} catch (error) {
		console.log(error, "tessta");
	}
})();
