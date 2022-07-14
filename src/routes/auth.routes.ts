import { Router } from "express";

import {
	getLogin,
	postLogin,
	postLogout,
	getSignup,
	postSignup,
	getReset,
	getResetPassword,
	postResetPassword,
	postReset,
} from "../controllers/auth.controllers";

const router = Router();

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post("/signup", postSignup);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/reset/:token", getResetPassword);

router.post("/reset-password", postResetPassword);

export default router;
