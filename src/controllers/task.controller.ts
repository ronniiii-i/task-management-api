import { Request, Response, NextFunction } from "express";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator";
import { TaskService } from "../services/task.service";
import { NotFoundError } from "../middleware/error.middleware";

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

  static async getAllTasks(_req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await TaskService.getAllTasks();
      return res.status(200).json({
        status: "success",
        results: tasks.length,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const taskId = Array.isArray(id) ? id[0] : id;
      const task = await TaskService.getTaskById(taskId);

      if (!task) {
        throw new NotFoundError(`Task with ID ${id} not found`);
      }

      return res.status(200).json({
        status: "success",
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateTaskSchema.parse(req.body);

      const taskId = Array.isArray(id) ? id[0] : id;
      const existingTask = await TaskService.getTaskById(taskId);
      if (!existingTask) {
        throw new NotFoundError(`Task with ID ${id} not found`);
      }

      const updatedTask = await TaskService.updateTask(taskId, validatedData);
      return res.status(200).json({
        status: "success",
        data: updatedTask,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const taskId = Array.isArray(id) ? id[0] : id;
      const existingTask = await TaskService.getTaskById(taskId);
      if (!existingTask) {
        throw new NotFoundError(`Task with ID ${id} not found`);
      }

      await TaskService.deleteTask(taskId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
