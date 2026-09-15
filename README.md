# Task Management API

A production-ready RESTful API for task management built with Node.js, Express, TypeScript, Zod, Prisma, and SQLite.

## Architectural Highlights

This project follows the **Controller-Service-Repository** architectural pattern to enforce clean separation of concerns:

* **Controllers (`src/controllers`)**: Handle HTTP request extraction, response formatting, and status code assignment.
* **Services (`src/services`)**: Encapsulate core business logic and coordinate data access.
* **Data Access (`src/lib/prisma.ts`)**: Prisma ORM manages type-safe SQLite database interactions.
* **Validation (`src/validators`)**: Zod schemas sanitize incoming request payloads and query parameters before reaching controller logic.
* **Global Error Middleware (`src/middleware`)**: Centralized error handling normalizes response schemas across Zod validation errors, Prisma database error codes (e.g., P2025 record missing), custom application errors, and standard exceptions.

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

### 1. Installation & Environment Setup

Clone the repository, install dependencies, and create your environment file:

```bash
git clone <repository-url>
cd task-manager-api
npm install
cp .env.example .env

```

Ensure `.env` contains your runtime variables:

```env
PORT=3000
DATABASE_URL="file:./dev.db"

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

## Assumptions & Architectural Trade-offs

* **Error-Driven 404 Resolution**: Update and delete handlers execute database operations directly without pre-fetching record existence. Missing records trigger Prisma error `P2025`, which is caught by global middleware to issue standard `404 Not Found` responses, eliminating unnecessary database lookups per write operation.
* **Strict Partial Updates**: Optional fields in update payloads are evaluated explicitly against `undefined`. This permits falsy or zero-ish updates (e.g., empty string, `false`, `0`) to be validly persisted, while truly absent fields are ignored.
* **Pagination & Filtering**: Offset-based pagination (`page`, `limit`) and status filtering (`?status=PENDING`) are implemented on `GET /api/tasks` with sensible defaults (`page=1`, `limit=10`) to protect database throughput under scale.
* **Database Choice**: SQLite was chosen for zero-dependency local setup and quick review without external service dependencies.

---

## API Documentation

### Base URL

`http://localhost:3000/api`

### Endpoints

| Method | Endpoint | Description | Query / Request Body | Response Code |
| --- | --- | --- | --- | --- |
| `GET` | `/health` | Health check endpoint | None | `200 OK` |
| `POST` | `/api/tasks` | Create a new task | `{ title, description?, status?, dueDate? }` | `201 Created` |
| `GET` | `/api/tasks` | List tasks (with pagination/filter) | Query: `?status=PENDING&page=1&limit=10` | `200 OK` |
| `GET` | `/api/tasks/:id` | Fetch task by ID | None | `200 OK` / `404` |
| `PATCH` | `/api/tasks/:id` | Update task details/status | `{ title?, description?, status?, dueDate? }` | `200 OK` / `404` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | None | `204 No Content` / `404` |

---

## Testing

Run the integration test suite covering all CRUD endpoints, validation edge cases, empty update payloads, and 404 responses:

```bash
npm test
```
