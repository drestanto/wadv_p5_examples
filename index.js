// src/index.js
// Todo API — Full CRUD dengan Express + Prisma
// Web Advanced Development — P5

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());

// ── GET /todos ──────────────────────────────────────────────
// List semua todo, diurutkan dari yang terbaru
app.get("/todos", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(todos);
  } catch (e) {
    res.status(500).json({ error: "Server error", detail: e.message });
  }
});

// ── GET /todos/:id ──────────────────────────────────────────
// Detail satu todo berdasarkan id
app.get("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ error: "id harus berupa angka" });

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo)
      return res.status(404).json({ error: "Todo tidak ditemukan" });

    res.json(todo);
  } catch (e) {
    res.status(500).json({ error: "Server error", detail: e.message });
  }
});

// ── POST /todos ─────────────────────────────────────────────
// Buat todo baru
app.post("/todos", async (req, res) => {
  try {
    const { title } = req.body;

    // Validasi: title wajib ada dan tidak kosong
    if (!title || title.trim() === "")
      return res.status(400).json({ error: "title wajib diisi" });

    const todo = await prisma.todo.create({
      data: { title: title.trim() },
    });

    res.status(201).json(todo);
  } catch (e) {
    res.status(500).json({ error: "Server error", detail: e.message });
  }
});

// ── PUT /todos/:id ──────────────────────────────────────────
// Update todo — kirim title, done, atau keduanya
app.put("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, done } = req.body;

    if (isNaN(id))
      return res.status(400).json({ error: "id harus berupa angka" });

    // Harus kirim minimal satu field
    if (title === undefined && done === undefined)
      return res.status(400).json({ error: "Kirim minimal title atau done" });

    // Bangun data object secara dinamis — hanya field yang dikirim
    const data = {};
    if (title !== undefined) data.title = title.trim();
    if (done !== undefined)  data.done  = done;

    const updated = await prisma.todo.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (e) {
    // P2025 = record not found
    if (e.code === "P2025")
      return res.status(404).json({ error: "Todo tidak ditemukan" });
    res.status(500).json({ error: "Server error", detail: e.message });
  }
});

// ── DELETE /todos/:id ───────────────────────────────────────
// Hapus todo berdasarkan id
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id))
      return res.status(400).json({ error: "id harus berupa angka" });

    await prisma.todo.delete({ where: { id } });

    // 204 No Content — berhasil, tidak ada body
    res.status(204).send();
  } catch (e) {
    if (e.code === "P2025")
      return res.status(404).json({ error: "Todo tidak ditemukan" });
    res.status(500).json({ error: "Server error", detail: e.message });
  }
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Endpoints tersedia:`);
  console.log(`   GET    /todos`);
  console.log(`   GET    /todos/:id`);
  console.log(`   POST   /todos`);
  console.log(`   PUT    /todos/:id`);
  console.log(`   DELETE /todos/:id`);
});
