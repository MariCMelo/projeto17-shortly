import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { urlSchema } from "../schemas/url.schemas.js";
import { getUrlId, shortenUrl } from "../controllers/shortUrl.controller.js";

const shortUrlRouter = Router();

shortUrlRouter.post("/urls/shorten", validateSchema(urlSchema), shortenUrl)
shortUrlRouter.get("/urls/:id", getUrlId) 

export default shortUrlRouter