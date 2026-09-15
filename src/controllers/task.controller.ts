import { Request, Response, NextFunction } from "express";
import { createTaskSchema } from "../validators/task.validator";
import { TaskService } from "../services/task.service";

export class TaskController {
  static async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const task = await TaskService.createTask(validatedData);
      return res.status(201).json({
        status: "success",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }
}
