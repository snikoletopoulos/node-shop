import { Router } from "express";

import {
	getProducts,
	getIndex,
	getCart,
	getProduct,
	getOrders,
	postCart,
	postCartDeleteProduct,
	postOrder,
} from "../controllers/shop.controllers";
import { isAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.post("/create-order", isAuth, postOrder);

router.get("/orders", isAuth, getOrders);

export default router;
