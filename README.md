# Task Management API

A production-ready RESTful API for task management built with Node.js, Express, TypeScript, Zod, Prisma, and SQLite.

## Architectural Highlights

This project follows the **Controller-Service-Repository** architectural pattern to enforce a clean separation of concerns:

* **Controllers (`src/controllers`)**: Handle HTTP request extraction, response formatting, and status code assignment.
* **Services (`src/services`)**: Enapsulate core business logic and coordinate data access.
* **Data Access (`src/lib/prisma.ts`)**: Prisma ORM manages type-safe SQLite database interactions.
* **Validation (`src/validators`)**: Zod schemas sanitize incoming request payloads before reaching controller handlers.
* **Global Error Middleware (`src/middleware`)**: Centralized error handling normalizes response schemas across Zod validation errors, custom application errors (e.g., 404 Not Found), and unhandled standard exceptions.

---

## Tech Stack

* **Runtime**: Node.js (v22+)
* **Framework**: Express.js
* **Language**: TypeScript
* **Database & ORM**: SQLite + Prisma 6
* **Validation**: Zod
* **Execution Engine**: `tsx` (development)
* **Testing**: Jest + Supertest

---

## Getting Started

### Prerequisites

Ensure you have **Node.js (v18+)** and **npm** installed on your system.

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd task-manager-api
npm install

```

### 2. Database Setup

Initialize the SQLite database and run Prisma migrations:

```bash
npx prisma migrate dev --name init

```

### 3. Running the Server

Start the development server with live reload:

```bash
npm run dev

```

The API will be available at `http://localhost:3000`.

---

## API Documentation

### Base URL

`http://localhost:3000/api`

### Endpoints

| Method | Endpoint | Description | Request Body | Response Code |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | Health check endpoint | None | `200 OK` |
| `POST` | `/api/tasks` | Create a new task | `{ title, description?, dueDate? }` | `201 Created` |
| `GET` | `/api/tasks` | List all tasks | None | `200 OK` |
| `GET` | `/api/tasks/:id` | Fetch task by ID | None | `200 OK` / `404` |
| `PATCH` | `/api/tasks/:id` | Update task details/status | `{ title?, status?, dueDate? }` | `200 OK` / `404` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | None | `204 No Content` / `404` |

---

## Testing

Run the integration test suite covering all CRUD endpoints and error scenarios:

```bash
npm test

```
