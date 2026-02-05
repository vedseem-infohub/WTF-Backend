import express from "express";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/events.controllers.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", addEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
