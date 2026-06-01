# 🍜 Kuliner App

Aplikasi pemesanan makanan berbasis web dengan tema kuliner. Dibangun menggunakan **NestJS + Prisma** untuk backend dan **React + Vite + Tailwind CSS** untuk frontend.

---

## 📁 Struktur Project

```
kuliner/
├── backend/        # NestJS REST API
│   ├── prisma/     # Schema & seed database
│   └── src/
│       ├── auth/       # Autentikasi JWT
│       ├── menu/       # CRUD menu makanan
│       ├── kategori/   # CRUD kategori
│       ├── pesanan/    # Manajemen pesanan
│       └── prisma/     # Prisma service
└── frontend/       # React + Vite
    └── src/
        ├── pages/      # Halaman utama
        ├── components/ # Komponen reusable
        ├── hooks/      # Context & custom hooks
        └── services/   # API calls
```

---

## ⚙️ Setup Backend

### 1. Masuk ke folder backend
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Buat file `.env`
```bash
cp .env.example .env
```
Edit `.env` sesuai konfigurasi database PostgreSQL kamu:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/kuliner_db"
JWT_SECRET="ganti_dengan_secret_yang_aman"
JWT_EXPIRES_IN="7d"
PORT=3000
```

### 4. Generate Prisma & jalankan migrasi
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Seed data awal (opsional tapi disarankan)
```bash
npm run prisma:seed
```
Ini akan membuat akun admin (`admin@kuliner.com` / `admin123`) dan contoh menu.

### 6. Jalankan backend
```bash
npm run start:dev
```

API berjalan di: `http://localhost:3000`  
Swagger docs: `http://localhost:3000/api/docs`

---

## 🎨 Setup Frontend

### 1. Masuk ke folder frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Jalankan frontend
```bash
npm run dev
```

Aplikasi berjalan di: `http://localhost:5173`

---

## 🔌 Endpoint API

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/auth/register` | Daftar akun | — |
| POST | `/auth/login` | Login, dapatkan token | — |
| GET | `/auth/profile` | Profil user | ✅ |
| GET | `/kategori` | Semua kategori | — |
| POST | `/kategori` | Tambah kategori | ✅ |
| GET | `/menu` | Semua menu (bisa filter) | — |
| POST | `/menu` | Tambah menu | ✅ |
| PATCH | `/menu/:id/toggle` | Toggle ketersediaan | ✅ |
| GET | `/pesanan` | Semua pesanan | ✅ |
| POST | `/pesanan` | Buat pesanan baru | — |
| GET | `/pesanan/saya` | Pesanan user login | ✅ |
| PATCH | `/pesanan/:id/status` | Update status pesanan | ✅ |

---

## 🗄️ Model Database

- **User** — Akun pelanggan & admin
- **Kategori** — Kategori menu (Makanan, Minuman, dll)
- **Menu** — Item makanan/minuman dengan harga
- **Pesanan** — Order dari pelanggan
- **PesananItem** — Detail item dalam satu pesanan

---

## 🧑‍💻 Pembagian Tugas Tim

| Anggota | Tugas |
|---------|-------|
| Backend Dev | Setup NestJS, Prisma, API endpoints, JWT auth |
| Frontend Dev | Setup React, halaman menu, keranjang, pesanan, admin |

---

## 🚀 Tech Stack

**Backend:** NestJS · TypeScript · Prisma ORM · PostgreSQL · JWT · Swagger  
**Frontend:** React 18 · Vite · TypeScript · Tailwind CSS · React Router · Axios
