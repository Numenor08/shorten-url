
# Shorten Link API

Shorten Link API adalah sebuah aplikasi berbasis Node.js yang memungkinkan pengguna untuk mempersingkat URL dan mengelola autentikasi pengguna menggunakan Google OAuth dan autentikasi lokal.

## Table of Contents

- [Fitur](#Fitur)
- [Teknologi yang Digunakan](#Teknologi-yang-Digunakan)
- [Instalasi dan Penggunaan](#Instalasi-dan-Penggunaan)
- [API Routes](#API-Routes)
  - [Autentikasi](#Autentikasi)
  - [URL Shortener](#URL-Shortener)

---

## Fitur

- **Autentikasi**: Mendukung Google OAuth dan autentikasi lokal.
- **URL Shortener**: Membuat URL pendek dengan opsi kustomisasi.
- **Rate Limiting**: Membatasi jumlah permintaan untuk mencegah penyalahgunaan.
- **Session Management**: Menggunakan PostgreSQL untuk menyimpan sesi pengguna.

---

## Teknologi yang Digunakan

Berikut adalah teknologi dan library yang digunakan dalam proyek ini:

- **Node.js**: v18+
- **Express**: v4.21.2
- **TypeScript**: v5.8.2
- **Sequelize**: v6.37.6
- **PostgreSQL**: Database untuk menyimpan data URL dan pengguna.
- **Passport**: v0.7.0 (untuk autentikasi)
  - **passport-google-oauth20**: v2.0.0
  - **passport-local**: v1.0.0
- **express-session**: v1.18.1 (untuk manajemen sesi)
- **connect-pg-simple**: v10.0.0 (untuk menyimpan sesi di PostgreSQL)
- **express-validator**: v7.2.1 (untuk validasi input)
- **express-rate-limit**: v7.5.0 (untuk membatasi permintaan)
- **nanoid**: v5.1.3 (untuk membuat URL pendek)
- **bcryptjs**: v3.0.2 (untuk hashing password)
- **dotenv**: v16.4.7 (untuk mengelola variabel lingkungan)

---

## Instalasi dan Penggunaan

### 1. Clone Repository

```bash
git clone https://github.com/username/shorten-link.git
cd shorten-link
```


### 2. Install Dependencies

Gunakan `npm` untuk menginstal dependensi:

npm install

### 3. Konfigurasi Environment

Buat file `.env` berdasarkan `.env.example`:

```bash
PORT=3000
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

### 4. Jalankan Server

Untuk mode pengembangan:

```bash
npm run dev
```

Untuk mode produksi:

```bash
npm run build
npm run start
```

## API Routes

---

### Autentikasi

#### 1. Google OAuth

* **GET** `/api/auth/google`
  Mengarahkan pengguna ke halaman login Google.
* **GET** `/api/auth/google/callback`
  Callback URL setelah login Google berhasil.

#### 2. Register

* **POST** `/api/auth/register`
  Mendaftarkan pengguna baru.
  **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "Password123"
  }
  ```

#### 3. Login

* **POST** `/api/auth/login`
  Login menggunakan email dan password.
  **Body:**
  ```json
  {
    "email": "johndoe@example.com",
    "password": "Password123"
  }
  ```

#### 4. Get Session

* **GET** `/api/auth/google/callback`
  Callback URL setelah login Google berhasil.

#### 5. Logout

* **GET** `/api/auth/google/logout`
  Logout dari sesi saat ini.

---

### URL Shortener

#### 1. Create Short URL

* **POST** `/shorten`
  Membuat URL pendek.

  **Body:**

  ```json
  {
    "originalUrl": "https://example.com",
    "customUrl": "mycustomurl" // Optional
  }
  ```

#### 2. Redirect Short URL

* **POST** `/:shortUrl`
  Mengarahlan pengguna ke URL asli berdasarkan URL pendek.

---

## Struktur Proyek

```
shorten-link/
├── src/
│   ├── config/         # Konfigurasi database dan passport
│   ├── controllers/    # Logika bisnis untuk autentikasi dan URL
│   ├── middlewares/    # Middleware untuk validasi dan autentikasi
│   ├── models/         # Model Sequelize untuk database
│   ├── routes/         # Definisi rute API
│   ├── types/          # Deklarasi tipe TypeScript
│   └── server.ts       # Entry point aplikasi
├── db/                 # File SQL untuk database
├── [.env.example](http://_vscodecontentref_/1)        # Contoh file environment
├── [package.json](http://_vscodecontentref_/2)        # Konfigurasi npm
├── [tsconfig.json](http://_vscodecontentref_/3)       # Konfigurasi TypeScript
└── [README.md](http://_vscodecontentref_/4)           # Dokumentasi proyek
```

---

## Notes:

* Pastikan PostgreSQL sudah terinstal dan berjalan di sistem Anda.
* Gunakan library seperti Postman untuk menguji endpoint API.
* Jangan lupa untuk menjaga keamanan file `.env` Anda.

---

## Kontributor

* **Athaya Razan Zaidan**
  Penulis dan pengembang utama proyek ini.
