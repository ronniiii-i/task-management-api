import { z } from "zod";

export const TaskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").trim(),
  description: z.string().optional(),
  status: TaskStatusEnum.optional().default("PENDING"),
  dueDate: z
    .string()
    .datetime({ message: "dueDate must be a valid ISO date string" })
    .optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1, "Title cannot be empty").trim().optional(),
    description: z.string().optional(),
    status: TaskStatusEnum.optional(),
    dueDate: z
      .string()
      .datetime({ message: "dueDate must be a valid ISO date string" })
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const getTasksQuerySchema = z.object({
  status: TaskStatusEnum.optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type GetTasksQueryDto = z.infer<typeof getTasksQuerySchema>;
