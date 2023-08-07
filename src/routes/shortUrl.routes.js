import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { urlSchema } from "../schemas/url.schemas.js";
import {
  deleteUrl,
  getUrlId,
  openShortUrl,
  shortenUrl,
} from "../controllers/shortUrl.controller.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const shortUrlRouter = Router();

shortUrlRouter.post("/urls/shorten", validateAuth, validateSchema(urlSchema), shortenUrl);
shortUrlRouter.get("/urls/:id", getUrlId);
shortUrlRouter.get("/urls/open/:shortUrl", openShortUrl);
shortUrlRouter.delete("/urls/:id", deleteUrl);

export default shortUrlRouter;
