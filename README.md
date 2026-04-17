# 📈 KasTumbuh

KasTumbuh adalah aplikasi pencatatan keuangan modern untuk UMKM yang berfokus pada kemudahan penggunaan dan kepatuhan standar **SAK EMKM** (Standar Akuntansi Keuangan Entitas Mikro, Kecil, dan Menengah). KasTumbuh membantu pelaku usaha memisahkan keuangan pribadi dan bisnis dengan aman.

---

## 🚀 Fitur Unggulan

- **🔐 Autentikasi JWT & Isolasi Data**: Sistem Login/Register riil. Data Anda 100% terisolasi dari pengguna lain. 
- **💼 Manajemen Multi-Kas (Cash Pools)**: Buat berbagai "rekening" (Laci Toko, Bank, E-Wallet, Tabungan) lengkap dengan Preset Kategori & Kategori Custom.
- **📊 Dashboard Analitik**: Pantau total aset usaha, ringkasan masuk/keluar harian, dan laba bersih bulanan dalam satu layar.
- **💸 Pencatatan Pintar & Transfer**: Catat Pemasukan, Pengeluaran, dan Transfer Antar Kas dengan interface Slide-Over yang elegan.
- **☁️ Cloud Auto-Sync (Real-time)**: Semua data otomatis disimpan ke *database* MySQL sesaat setelah perubahan dilakukan. Data aman meski Anda ganti peramban atau *device*.
- **🛡️ Validasi Transaksi Tingkat Tinggi**: 
  - *Auto-formatting* mata uang (Rupiah otomatis dengan pemisah ribuan).
  - Validasi ketat untuk mencegah nominal 0, transfer ke akun yang sama, atau pengeluaran melebihi saldo.
  - *Confirmation Modal* saat menghapus untuk keamanan berlapis.

---

## 💻 Tech Stack

- **Frontend:** React + Vite, Tailwind CSS v4, Context API (State Management)
- **Backend:** Node.js, Express.js, JWT (JSON Web Tokens)
- **Database:** MySQL
- **Tooling:** Laragon (Local Environment)

---

## 🛠 Panduan Instalasi & Menjalankan Aplikasi

Aplikasi ini dibagi menjadi dua bagian utama: `client` (Frontend) dan `server` (Backend).

### 1. Persiapan Database (MySQL)
1. Buka aplikasi **Laragon** (atau XAMPP) dan jalankan MySQL.
2. Buat database baru bernama `kastumbuh`.
3. Jalankan file `database_setup.sql` yang ada di dalam folder `server` untuk membuat skema tabel secara otomatis.

### 2. Konfigurasi & Menjalankan Backend
1. Buka terminal, masuk ke folder `server`:
   ```bash
   cd server
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Sesuaikan konfigurasi koneksi database di `server/src/config/database.js` jika password `root` Anda berbeda.
4. Jalankan server backend:
   ```bash
   npm run dev
   ```
   *Server akan berjalan di http://localhost:5000*

### 3. Konfigurasi & Menjalankan Frontend
1. Buka terminal baru, masuk ke folder `client`:
   ```bash
   cd client
   ```
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan server frontend:
   ```bash
   npm run dev
   ```
   *Aplikasi dapat diakses di http://localhost:5173*

---

## 📂 Struktur Database

Database `kastumbuh` terdiri dari 3 tabel utama:
1. `users` - Menyimpan data pengguna dan profil bisnis dengan password yang di-*hash*.
2. `cash_pools` - Menyimpan data rekening/kas yang dimiliki oleh masing-masing user, lengkap dengan tipe (`is_business`) dan tujuan/kategori (`purpose`).
3. `transactions` - Menyimpan riwayat mutasi per user, mendukung *Income*, *Expense*, dan *Transfer*. Terdapat fitur `status = 'VOIDED'` untuk transaksi yang dibatalkan.

---

## 💡 Developer Notes
- **Atomicity & Real-time Sync**: Aplikasi menggunakan logika sinkronisasi canggih di `DataContext.jsx` yang mengirimkan *state* ke Backend MySQL secara *real-time* setiap fungsi mutasi (`addPool`, `addTransaction`, `transfer`, `voidTransaction`) dipanggil. Tidak perlu lagi tombol "Sinkronisasi" manual!
- **Idempotency**: Pembuatan ID *(timestamp+uuid)* dilakukan di *client* untuk menjamin dukungan interaksi *offline-first* di masa depan.

---
*© 2026 KasTumbuh Dev Team - Dirancang untuk UMKM Indonesia.*
