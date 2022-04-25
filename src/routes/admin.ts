import { Router } from "express";

import {
	getAddProduct,
	postAddProduct,
	getProducts,
	getEditProduct,
  postEditProduct,
} from "../controllers/admin";

const router = Router();

router.get("/add-product", getAddProduct);

router.post("/add-product", postAddProduct);

router.get("/products", getProducts);

router.get("/edit-product/:productId", getEditProduct);

router.post("/edit-product", postEditProduct);

export default router;
