import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getTasks, getTaskByUserId, createTask, deleteTask } from "../controller/taskController.js";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.get("/user", authMiddleware, getTaskByUserId);
router.post("/", authMiddleware, createTask);
router.delete("/:id", authMiddleware, deleteTask);


export default router;
