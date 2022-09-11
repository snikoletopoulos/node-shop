import path from "path";
import express from "express";

import dotenv from "dotenv";
import dotenvExpoand from "dotenv-expand";
dotenvExpoand.expand(dotenv.config());

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import csrf from "csurf";
import flash from "connect-flash";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";

import adminRouter from "./routes/admin.routes";
import shopRouter from "./routes/shop.routes";
import authRouter from "./routes/auth.routes";
import { get404, get500 } from "./controllers/error.controllers";
import { errorMidleware } from "./middleware/error.middleware";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
const MongoDBStore = ConnectMongoDB(session);

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(process.cwd(), "images")));

if (!process.env.SESSION_SECRET)
	throw new Error("SESSION_SECRET is not defined");

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === "production",
		},
		store: new MongoDBStore({
			uri: process.env.DATABASE_URL,
			collection: "sessions",
		}),
	})
);
app.use(csrf());
app.use(flash());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "tiny"));
app.use(compression());
app.use(helmet());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.user;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use("/500", get500);
app.use(get404);

app.use(errorMidleware);

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined");
}

export const prisma = new PrismaClient();

prisma
	.$connect()
	.then(async () => app.listen(3000))
	.catch(console.log);
