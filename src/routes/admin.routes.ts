import { Router } from "express";

import {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
	postEditProduct,
	postDeleteProduct,
} from "../controllers/admin.controllers";
import { isAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/add-product", isAuth, getAddProduct);

router.post("/add-product", isAuth, postAddProduct);

router.get("/products", isAuth, getProducts);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post("/edit-product", isAuth, postEditProduct);

router.post("/delete-product", isAuth, postDeleteProduct);

export default router;
