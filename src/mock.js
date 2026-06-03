// src/mock.js
// Todo API — MOCK SERVER (hardcoded data, tanpa database)
// Dipakai untuk test Postman sebelum database siap
// Web Advanced Development — P5
//
// Jalankan: node src/mock.js
// Server: http://localhost:3001

const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.json());

// ── In-memory "database" ────────────────────────────────────
let todos = [
  { id: 1, title: "Belajar Prisma ORM",      done: true,  createdAt: "2025-01-10T08:00:00.000Z", updatedAt: "2025-01-10T10:00:00.000Z" },
  { id: 2, title: "Setup PostgreSQL lokal",   done: true,  createdAt: "2025-01-10T08:05:00.000Z", updatedAt: "2025-01-10T09:00:00.000Z" },
  { id: 3, title: "Buat REST API full CRUD",  done: false, createdAt: "2025-01-10T08:10:00.000Z", updatedAt: "2025-01-10T08:10:00.000Z" },
  { id: 4, title: "Test semua endpoint di Postman", done: false, createdAt: "2025-01-10T08:15:00.000Z", updatedAt: "2025-01-10T08:15:00.000Z" },
  { id: 5, title: "Deploy ke Railway",        done: false, createdAt: "2025-01-10T08:20:00.000Z", updatedAt: "2025-01-10T08:20:00.000Z" },
];

let nextId = 6;

// Helper: cari todo by id
function findTodo(id) {
  return todos.find((t) => t.id === id) || null;
}

// ── GET /todos ──────────────────────────────────────────────
app.get("/todos", (req, res) => {
  // Sort: terbaru dulu (descending createdAt)
  const sorted = [...todos].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(sorted);
});

// ── GET /todos/:id ──────────────────────────────────────────
app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "id harus berupa angka" });

  const todo = findTodo(id);
  if (!todo)
    return res.status(404).json({ error: "Todo tidak ditemukan" });

  res.json(todo);
});

// ── POST /todos ─────────────────────────────────────────────
app.post("/todos", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "")
    return res.status(400).json({ error: "title wajib diisi" });

  const now = new Date().toISOString();
  const newTodo = {
    id: nextId++,
    title: title.trim(),
    done: false,
    createdAt: now,
    updatedAt: now,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// ── PUT /todos/:id ──────────────────────────────────────────
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "id harus berupa angka" });

  const { title, done } = req.body;
  if (title === undefined && done === undefined)
    return res.status(400).json({ error: "Kirim minimal title atau done" });

  const todo = findTodo(id);
  if (!todo)
    return res.status(404).json({ error: "Todo tidak ditemukan" });

  if (title !== undefined) todo.title = title.trim();
  if (done  !== undefined) todo.done  = done;
  todo.updatedAt = new Date().toISOString();

  res.json(todo);
});

// ── DELETE /todos/:id ───────────────────────────────────────
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id))
    return res.status(400).json({ error: "id harus berupa angka" });

  const index = todos.findIndex((t) => t.id === id);
  if (index === -1)
    return res.status(404).json({ error: "Todo tidak ditemukan" });

  todos.splice(index, 1);
  res.status(204).send();
});

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🧪 MOCK server running on http://localhost:${PORT}`);
  console.log(`   (Data hardcoded, tidak pakai database)`);
  console.log(`   Data awal: ${todos.length} todos`);
  console.log(``);
  console.log(`   GET    http://localhost:${PORT}/todos`);
  console.log(`   GET    http://localhost:${PORT}/todos/1`);
  console.log(`   POST   http://localhost:${PORT}/todos`);
  console.log(`   PUT    http://localhost:${PORT}/todos/1`);
  console.log(`   DELETE http://localhost:${PORT}/todos/1`);
});
