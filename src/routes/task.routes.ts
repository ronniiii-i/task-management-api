import { Router } from "express";
import { TaskController } from "../controllers/task.controller";

const router = Router();

router.post("/", TaskController.createTask);

export default router;
