# Ayo Belajar — Sistem Informasi Lembaga Bimbingan Belajar

Aplikasi Next.js + Prisma + PostgreSQL Neon yang siap dideploy ke Vercel.

## Penting: Keamanan

Jangan pernah memasukkan kredensial Neon ke GitHub atau file ZIP. Jika kredensial pernah dikirim melalui chat, rotasi password di Neon Console sebelum memakai proyek ini.

## Instalasi lokal

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
SEED_ADMIN_PASSWORD="kata-sandi-minimal-12-karakter" npm run db:seed
npm run dev
```

Masuk admin: `admin@ayobelajar.com`; gunakan nilai `SEED_ADMIN_PASSWORD` yang Anda buat sendiri.

## Deploy Vercel

1. Upload seluruh isi folder ini ke repository GitHub privat.
2. Import repository tersebut ke Vercel.
3. Atur Environment Variables pada Vercel untuk Production, Preview, dan Development:
   - `DATABASE_URL`: URL Neon **pooled** (hostname `-pooler`).
   - `DIRECT_URL`: URL Neon direct/non-pooled.
   - `AUTH_SECRET`: buat dengan `openssl rand -base64 32`.
   - `AUTH_URL`: URL aplikasi produksi.
   - `NEXT_PUBLIC_SITE_URL`: URL aplikasi produksi.
4. Terapkan migrasi dari komputer lokal atau CI: `npx prisma migrate deploy`.
5. Jalankan seed sekali untuk membuat admin dan data unit awal.

`npm run build` sudah menjalankan `prisma generate && next build` agar Prisma Client tersedia saat build Vercel.

## Catatan

- Endpoint Prisma memakai Node.js runtime, bukan Edge runtime.
- Sertifikat menggunakan HTML/CSS untuk A4 landscape dan dapat dicetak dari browser.
- URL Google Maps harus berupa URL embed resmi `https://www.google.com/maps/embed...`.
- Untuk unggah logo/tanda tangan, tambahkan Vercel Blob/Cloudinary pada tahap berikutnya; starter ini menerima URL HTTPS yang disimpan admin.
