import path from "path";
import express from "express";

import dotenv from "dotenv";
import dotenvExpoand from "dotenv-expand";
dotenvExpoand.expand(dotenv.config());
import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
const MongoDBStore = ConnectMongoDB(session);

import adminRouter from "./routes/admin.routes";
import shopRouter from "./routes/shop.routes";
import authRouter from "./routes/auth.routes";
import { get404 } from "./controllers/error.controllers";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

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

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(get404);

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not defined");
}

export const prisma = new PrismaClient();

prisma
	.$connect()
	.then(async () => app.listen(3000))
	.catch(error => console.log(error));
