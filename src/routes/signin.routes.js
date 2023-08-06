import { Router } from "express";
import { signin } from "../controllers/signin.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { authSchema } from "../schemas/user.schemas.js";

const signinRouter = Router();

signinRouter.post("/signin", validateSchema(authSchema), signin);

export default signinRouter;
