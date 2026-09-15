import express from "express";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Task Manager API is running" });
});

app.use(errorHandler);

export default app;
