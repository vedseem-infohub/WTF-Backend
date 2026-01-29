import express from "express";
import { addyoutubeLink, getyoutubeLink } from "../controllers/youtubeLinkControllers.js";
const router = express.Router();

router.get("/getyoutubeLink", getyoutubeLink)
router.post("/addyoutubeLink", addyoutubeLink)

export default router;