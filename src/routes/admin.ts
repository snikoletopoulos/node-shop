import { Router } from "express";

import { addProduct, postAddProduct, getProducts } from "../controllers/admin";

const router = Router();

router.get("/add-product", addProduct);

router.post("/add-product", postAddProduct);

router.get("/products", getProducts);

export default router;
