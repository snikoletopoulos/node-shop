import { Router } from "express";

import {
	getProducts,
	getIndex,
	getCart,
	getCheckout,
	getOrders,
	getProduct,
	postCart,
	postCartDeleteProduct,
	postOrder,
} from "../controllers/shop.controllers";

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/cart-delete-item", postCartDeleteProduct);

router.post("/create-order", postOrder);

router.get("/orders", getOrders);

router.get("/checkout", getCheckout);

export default router;
