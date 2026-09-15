import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();

router.post("/", TaskController.createTask);
router.get("/", TaskController.getAllTasks);
router.get("/:id", TaskController.getTaskById);

export default router;
