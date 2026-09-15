import { prisma } from "../lib/prisma";
import {
  CreateTaskDto,
  UpdateTaskDto,
  GetTasksQueryDto,
} from "../validators/task.validator";

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

  static async getAllTasks(query: GetTasksQueryDto) {
    const { status, page, limit } = query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.status !== undefined && { status: data.status }),
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
