import { Router } from "express";
import { signup } from "../controllers/signup.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { userSchema } from "../schemas/user.schemas.js";

const signupRouter = Router();

signupRouter.post("/signup", validateSchema(userSchema), signup);

export default signupRouter;
