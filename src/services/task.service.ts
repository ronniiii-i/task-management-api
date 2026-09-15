import { prisma } from "../lib/prisma";
import { CreateTaskDto } from "../validators/task.validator";

export class TaskService {
  static async createTask(data: CreateTaskDto) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });
  }
  
  static async getAllTasks() {
    return prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getTaskById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  }
}
