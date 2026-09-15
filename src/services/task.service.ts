import { prisma } from "../lib/prisma";
import { CreateTaskDto, UpdateTaskDto } from "../validators/task.validator";

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

  static async updateTask(id: string, data: UpdateTaskDto) {
    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.status && { status: data.status }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
      },
    });
  }

  static async deleteTask(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
}
