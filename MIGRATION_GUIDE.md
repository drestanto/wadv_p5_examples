# Todo API — Setup & Migration Guide
## Web Advanced Development — P5

---

## 1. Clone / Buat Project

```bash
# Kalau dari scratch:
mkdir todo-api && cd todo-api

# Kalau dari repo:
git clone <url-repo>
cd todo-api
```

---

## 2. Install Dependencies

```bash
npm install
```

Dependencies yang terinstall:
- `express` — web framework
- `@prisma/client` — Prisma runtime client
- `prisma` (dev) — Prisma CLI untuk migrate & generate
- `nodemon` (dev) — auto-restart server saat kode berubah

---

## 3. Setup Database

### PostgreSQL
1. Pastikan PostgreSQL sudah jalan di komputer kalian
2. Buat database baru:

```sql
-- Di psql atau pgAdmin:
CREATE DATABASE todo_api_db;
```

### MySQL (alternatif)
```sql
-- Di MySQL Workbench atau terminal:
CREATE DATABASE todo_api_db;
```

---

## 4. Konfigurasi .env

```bash
# Copy template:
cp .env.example .env   # atau edit langsung file .env

# Isi sesuai database kalian:
DATABASE_URL="postgresql://postgres:PASSWORD_KALIAN@localhost:5432/todo_api_db"

# Kalau MySQL:
# DATABASE_URL="mysql://root:PASSWORD_KALIAN@localhost:3306/todo_api_db"
```

> ⚠️ Jangan commit .env ke GitHub — sudah masuk .gitignore

---

## 5. Jalankan Migration

```bash
# Migration pertama — buat tabel Todo di database
npx prisma migrate dev --name init
```

Output yang diharapkan:
```
✔ Generated migration: 20250101000000_init
✔ Applied migration to database
✔ Generated Prisma Client
```

Folder yang terbuat:
```
prisma/
├── migrations/
│   └── 20250101000000_init/
│       └── migration.sql    ← SQL yang di-generate Prisma
└── schema.prisma
```

---

## 6. Generate Prisma Client (kalau perlu)

Prisma Client di-generate otomatis setelah migrate. Tapi kalau
perlu generate ulang (misalnya setelah pull dari repo):

```bash
npx prisma generate
```

---

## 7. Jalankan Server

```bash
# Production mode:
npm start

# Development mode (auto-restart):
npm run dev
```

Output:
```
✅ Server running on http://localhost:3000
   Endpoints tersedia:
   GET    /todos
   GET    /todos/:id
   POST   /todos
   PUT    /todos/:id
   DELETE /todos/:id
```

---

## 8. Verifikasi dengan Prisma Studio

Prisma Studio = GUI untuk lihat/edit data di database:

```bash
npm run db:studio
# → buka http://localhost:5555 di browser
```

---

## Workflow Perubahan Schema

Kalau mau tambah/ubah kolom di schema:

```bash
# 1. Edit prisma/schema.prisma
#    Contoh: tambah kolom priority

# 2. Jalankan migration
npx prisma migrate dev --name add_priority_to_todo

# 3. Prisma Client otomatis di-regenerate
#    Langsung bisa pakai field baru di kode
```

---

## Command Reference

| Command | Fungsi |
|---------|--------|
| `npx prisma migrate dev --name <nama>` | Buat & jalankan migration baru |
| `npx prisma migrate reset` | Reset DB + jalankan ulang semua migration |
| `npx prisma generate` | Regenerate Prisma Client dari schema |
| `npx prisma studio` | Buka GUI database di browser |
| `npx prisma db pull` | Sync schema dari DB yang sudah ada |
| `npx prisma migrate status` | Lihat status semua migration |

---

## Troubleshooting

| Error | Solusi |
|-------|--------|
| `connect ECONNREFUSED 127.0.0.1:5432` | PostgreSQL tidak jalan — start service dulu |
| `P1001: Can't reach database server` | Cek DATABASE_URL di .env |
| `PrismaClientInitializationError` | Jalankan `npx prisma generate` |
| `P2025: Record not found` | id yang dicari tidak ada di database |
| `Cannot read properties of undefined` | Lupa `app.use(express.json())` |
| `400 dari Postman padahal body benar` | Pastikan header `Content-Type: application/json` |
