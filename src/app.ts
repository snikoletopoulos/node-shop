import path from "path";
import express from "express";

import "dotenv/config";

import adminRouter from "./routes/admin.routes";
import shopRouter from "./routes/shop.routes";
import { get404 } from "./controllers/error.controllers";
import sequelize from "./helpers/db.helpers";

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(get404);

(async () => {
	try {
		const result = await sequelize.sync({ force: true });
		console.log(result);

		app.listen(3000);
	} catch (error) {
		console.log(error, "tessta");
	}
})();
