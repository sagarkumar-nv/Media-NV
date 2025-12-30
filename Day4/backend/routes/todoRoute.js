import express from "express";
import { createTODO, deleteTODO, getTODOs, updateTODO } from "../controller/taskController.js";

const router = express.Router();


router.get("/", getTODOs);
router.post("/", createTODO);
router.put("/:id", updateTODO);
router.delete("/:id", deleteTODO);

export default router;