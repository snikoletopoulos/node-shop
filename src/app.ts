import path from "path";
import express from "express";

import adminRouter from "./routes/admin";
import shopRouter from "./routes/shop";
import { get404 } from "./controllers/error";

const app = express();

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouter);
app.use(shopRouter);

app.use(get404);

app.listen(3000);
