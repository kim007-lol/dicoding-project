-- Skema Database untuk Aplikasi KasTumbuh (Pencatatan Keuangan UMKM)
-- Cara eksekusi: Import file ini ke dalam phpMyAdmin atau jalankan di MySQL CLI

CREATE DATABASE IF NOT EXISTS kastumbuh;
USE kastumbuh;

-- Tabel Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    business_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Transaksi (Pemasukan / Pengeluaran Harian)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL, -- INCOME = Pemasukan, EXPENSE = Pengeluaran
    amount DECIMAL(15, 2) NOT NULL,
    category VARCHAR(50),      -- Contoh: 'Penjualan', 'Gaji', 'Bahan Baku'
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relasi ke tabel Users
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
