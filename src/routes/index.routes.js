import { Router } from "express";
import signupRouter from "./signup.routes.js";
import signinRouter from "./signin.routes.js";
import shortUrlRouter from "./shortUrl.routes.js";
import personalRouter from "./personal.routes.js";

const router = Router();

router.use(signupRouter);
router.use(signinRouter);
router.use(shortUrlRouter);
router.use(personalRouter);

export default router;
