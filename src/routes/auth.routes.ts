import { Router } from "express";

import {
	getLogin,
	postLogin,
	postLogout,
	getSignup,
	postSignup,
} from "../controllers/auth.controllers";

const router = Router();

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post("/signup", postSignup);

export default router;
