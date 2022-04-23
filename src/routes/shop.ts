import { Router } from "express";

import {
	getProducts,
	getIndex,
	getCart,
	getCheckout,
	getOrders,
	getProduct,
} from "../controllers/shop";

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

export default router;
