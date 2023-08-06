import { Router } from "express";
import signupRouter from "./signup.routes.js";
import signinRouter from "./signin.routes.js";

const router = Router();

router.use(signupRouter);
router.use(signinRouter);

export default router;
