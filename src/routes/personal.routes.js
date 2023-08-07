import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuth.js";
import { getRanking, getUserProfile } from "../controllers/personal.controller.js";

const personalRouter = Router()

personalRouter.get("/users/me", validateAuth, getUserProfile)
personalRouter.get("/ranking", getRanking)

export default personalRouter