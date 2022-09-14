import { Router } from "express";

import {
	getProducts,
	getIndex,
	getCart,
	getProduct,
	getOrders,
	getCheckout,
	postCart,
	postCartDeleteProduct,
	postOrder,
	getInvoice,
} from "../controllers/shop.controllers";
import { isAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.get("/checkout", isAuth, getCheckout);

router.post("/create-order", isAuth, postOrder);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getInvoice);

export default router;
