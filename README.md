# KasTumbuh - Aplikasi Pencatatan Keuangan UMKM Berbasis SAK EMKM

Selamat datang di repositori proyek **KasTumbuh**! Proyek ini bertujuan untuk membangun _Minimum Viable Product_ (MVP) aplikasi manajemen keuangan yang dikhususkan untuk Usaha Mikro Kecil dan Menengah (UMKM).

Aplikasi ini menggunakan arsitektur **Full-Stack** dengan pemisahan lingkup kerja yang tegas antara _Front-End_ dan _Back-End_.

---

## 📂 Struktur Repositori Terpadu (Monorepo)

Repositori ini terbagi menjadi 2 ruang kerja (_workspace_) utama. **Mohon jangan mencampuradukkan kode _Front-End_ di folder _Back-End_ dan sebaliknya.**

```text
KasTumbuh/
├── client/          Area Tim Front-End (React.js + Vite + Tailwind)
└── server/          Area Tim Back-End (Node.js + Express + MySQL)
```

---

## Cara Menjalankan Proyek (Setup Guide)

Setiap anggota tim **wajib** melakukan instalasi di masing-masing lingkungan kerja sesuai divisinya. Buka terminal Anda dan ikuti langkah berikut:

### 1. Setup Backend (Tim API & Database)

Buka terminal dan arahkan ke folder `server`:

```bash
cd KasTumbuh/server
npm install
```

**Konfigurasi Database:**

1. Pastikan Anda telah menginstal dan menyalakan **MySQL** (misalnya melalui XAMPP/Laragon).
2. Buka phpMyAdmin (atau konektor IDE), buat database bernama `kastumbuh`.
3. Lakukan **Import** _file_ `server/database_setup.sql` untuk men-generate tabel-tabel utama.
4. Sesuaikan kredensial di _file_ `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=       # Isi jika MySQL Anda memiliki password
   DB_NAME=kastumbuh
   ```

**Jalankan Server Development:**

```bash
npm run dev
# Server akan berjalan di http://localhost:5000
```

### 2. Setup Frontend (Tim UI/UX)

Buka terminal baru dan arahkan ke folder `client`:

```bash
cd KasTumbuh/client
npm install
```

**Jalankan React Vite Development:**

```bash
npm run dev
# Web app akan bisa diakses melalui URL lokal yang diberikan Vite (biasanya http://localhost:5173)
```

---

## Peraturan Kebersihan Kode (Clean Code Rules)

Demi mencegah konflik saat penggabungan kode (_integrasi_), kita menerapkan **Standar Senior Programmer** berikut:

1. **Penamaan Berkas / Komponen (Front-End) - _PascalCase_:**
   Seluruh berkas komponen React di `client/src/components` atau `client/src/pages` **WAJIB** diawali huruf kapital. Contoh: `TransactionCard.jsx`, `Dashboard.jsx`.
2. **Penamaan Fungsi / Variabel - _camelCase_:**
   Penamaan fungsi lokal, fungsi _hooks_, dan nama variabel wajib menggunakan awalan huruf kecil. Contoh: `fetchData()`, `totalIncome`.
3. **Sentralisasi Pemanggilan API:**
   Komponen UI **dilarang keras** melakukan `axios.get` atau `axios.post` langsung di dalam halamannya. Semua _networking calls_ WAJIB didaftarkan ke dalam folder `client/src/services`.
4. **Respon API yang Standar (Back-End):**
   Tim Back-End wajib selalu menggunakan struktur respons yang membungkus _data_, sehingga formatnya konsisten (_Gunakan file utils `ApiResponse.js` dan `ApiError.js` yang sudah disediakan_).
5. **Konvensi RESTful:**
   Nama endpoint URL harus menggunakan _kebab-case_ dan menggunakan kata jamak. (Contoh: `/api/v1/transactions` BUKAN `/api/v1/AmbilTransaksi`).

---

## 🛠️ Teknologi & Konfigurasi Utama (Tech Stack)

**Front-End:**

- **React.js (Vite):** Digunakan sebagai _framework UI single-page application_ dengan waktu _build_ yang instan.
- **Tailwind CSS:** _Utility-first CSS framework_ untuk _styling_ antarmuka responsif tanpa harus menulis banyak _file CSS_ manual.
- **Axios:** Terpusat di `client/src/services/api.js` untuk manajemen _request/response_ HTTP serta intersepsi _token_ otentikasi.

**Back-End:**

- **Node.js & Express.js:** _Runtime_ dan _framework_ utama untuk _RESTful API_.
- **MySQL (mysql2 package):** Database relasional yang dipilih karena reliabilitas tingginya dalam mengelola relasi transaksi keuangan (Tabel Users & Transactions).
- **Morgan & Helmet:** _Middleware_ yang sudah ditanamkan untuk keamanan _header_ HTTP dasar dan _logging_ jalan API selama _development_.

---

## 🔐 Standar Kolaborasi API (Postman)

1. **Bagikan Collection:** Tim Back-End **diwajibkan** untuk melakukan _ekspor Collection Postman_ (format `.json`) dan membagikannya ke tim Front-End secepatnya agar tim Front-End bisa merancang _flow_ aplikasi lebih awal tanpa harus menunggu API 100% jadi (_mock-up data_).
2. **Format Standar:** Pastikan setiap endpoint selalu mengembalikan format JSON yang konsisten, berkat `ApiResponse.js` dan `ApiError.js`, sehingga tim _Front-End_ selalu mendapatkan `body` data seperti ini:
   ```json
   {
     "success": true,
     "statusCode": 200,
     "message": "Pesan sukses atau error",
     "data": { ... }
   }
   ```

---

## Alur Pengerjaan (Git Flow)

1. Jangan pernah nge-push langsung ke _branch_ `main`.
2. Buat _branch_ baru untuk fitur yang sedang Anda kerjakan (misal: `git checkout -b feature/login-page` atau `git checkout -b api/create-transaction`).
3. Lakukan _Pull Request_ dan minta setidaknya 1 anggota lain untuk melakukan _Review_ sebelum di-_Merge_.
