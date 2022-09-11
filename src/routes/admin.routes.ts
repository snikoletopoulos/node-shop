import { Router } from "express";
import upload from "multer";

import {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
	postEditProduct,
	deleteProduct,
} from "../controllers/admin.controllers";
import { isAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/add-product", isAuth, getAddProduct);

router.post(
	"/add-product",
	isAuth,
	upload({
		storage: upload.diskStorage({
			destination: (req, file, cb) => {
				cb(null, "images");
			},
			filename: (req, file, cb) => {
				cb(null, new Date().toISOString() + "-" + file.originalname);
			},
		}),
		fileFilter: (req, file, cb) => {
			if (
				file.mimetype === "image/png" ||
				file.mimetype === "image/jpg" ||
				file.mimetype === "image/jpeg"
			) {
				cb(null, true);
			} else {
				cb(null, false);
			}
		},
	}).single("image"),
	postAddProduct
);

router.get("/products", isAuth, getProducts);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
	"/edit-product",
	isAuth,
	upload({
		storage: upload.diskStorage({
			destination: (req, file, cb) => {
				cb(null, "images");
			},
			filename: (req, file, cb) => {
				cb(null, new Date().toISOString() + "-" + file.originalname);
			},
		}),
		fileFilter: (req, file, cb) => {
			if (
				file.mimetype === "image/png" ||
				file.mimetype === "image/jpg" ||
				file.mimetype === "image/jpeg"
			) {
				cb(null, true);
			} else {
				cb(null, false);
			}
		},
	}).single("image"),
	postEditProduct
);

router.delete("/product/:productId", isAuth, deleteProduct);

export default router;
