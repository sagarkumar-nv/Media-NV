import express from "express";
import authMiddleware from "../middleware/auth.js";
import validateTask from "../middleware/validate.js";

const router = express.Router();

let tasks = [];

router.post(
  "/",
  authMiddleware,
  validateTask,
  (req, res) => {
    const task = {
      id: Date.now(),
      title: req.body.title,
      user: req.user.username
    };

    tasks.push(task);
    res.status(201).json(task);
  }
);


router.get("/", authMiddleware, (req, res) => {
  const userTasks = tasks.filter(
    task => task.user === req.user.username
  );
  res.json(userTasks);
});


router.delete("/:id", authMiddleware, (req, res) => {
  tasks = tasks.filter(task => task.id != req.params.id);
  res.json({ message: "Task deleted" });
});

export default router;
