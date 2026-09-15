import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Task API Endpoints", () => {
  let createdTaskId: string;

  beforeAll(async () => {
    await prisma.task.deleteMany({});
  });

  afterAll(async () => {
    await prisma.task.deleteMany({});
    await prisma.$disconnect();
  });

  describe("POST /api/tasks", () => {
    it("should create a new task with valid data", async () => {
      const res = await request(app).post("/api/tasks").send({
        title: "Test Task",
        description: "Testing task creation",
      });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.title).toBe("Test Task");
      expect(res.body.data.status).toBe("PENDING");

      createdTaskId = res.body.data.id;
    });

    it("should return 400 if title is missing", async () => {
      const res = await request(app).post("/api/tasks").send({
        description: "Missing title",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("should return 400 for invalid TaskStatus enum", async () => {
      const res = await request(app).post("/api/tasks").send({
        title: "Invalid Status Task",
        status: "INVALID_STATUS",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("should return 400 for malformed ISO dueDate string", async () => {
      const res = await request(app).post("/api/tasks").send({
        title: "Invalid Date Task",
        dueDate: "invalid-date-string",
      });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("GET /api/tasks", () => {
    it("should retrieve tasks with pagination metadata", async () => {
      const res = await request(app).get("/api/tasks");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty("pagination");
    });

    it("should filter tasks by status", async () => {
      const res = await request(app).get("/api/tasks?status=PENDING");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.every((t: any) => t.status === "PENDING")).toBe(
        true,
      );
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should retrieve a task by valid ID", async () => {
      const res = await request(app).get(`/api/tasks/${createdTaskId}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.id).toBe(createdTaskId);
    });

    it("should return 404 for a non-existent task ID", async () => {
      const res = await request(app).get(
        "/api/tasks/00000000-0000-0000-0000-000000000000",
      );

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("should update task details", async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}`)
        .send({ status: "COMPLETED" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.status).toBe("COMPLETED");
    });

    it("should return 400 when sent an empty body", async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("should return 404 when patching a non-existent task ID", async () => {
      const res = await request(app)
        .patch("/api/tasks/00000000-0000-0000-0000-000000000000")
        .send({ title: "New Title" });

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("should return 404 when deleting a non-existent task ID", async () => {
      const res = await request(app).delete(
        "/api/tasks/00000000-0000-0000-0000-000000000000",
      );

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });

    it("should delete an existing task", async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
      expect(res.status).toBe(204);

      const checkRes = await request(app).get(`/api/tasks/${createdTaskId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
