import { Router } from "express";

import { addProduct, postAddProduct } from "../controllers/products";

const router = Router();

router.get("/add-product", addProduct);

router.post("/add-product", postAddProduct);

export default router;
