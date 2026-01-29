import express from "express"
import { addBlogs, getBlogs, editBlogs, deleteBlogs } from "../controllers/blogsControllers.js"
const router = express.Router();

router.get("/getblogs", getBlogs);

router.post("/addblog", addBlogs);

router.put("/editblog/:id", editBlogs);

router.delete("/deleteblog/:id", deleteBlogs);

export default router;
