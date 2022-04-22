import { Router } from "express";

import {
	getProducts,
	getIndex,
	getCart,
	getCheckout,
} from "../controllers/shop";

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/cart", getCart);

router.get("/checkout", getCheckout);

export default router;
