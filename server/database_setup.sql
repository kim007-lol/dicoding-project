-- Create Database
-- CREATE DATABASE IF NOT EXISTS kastumbuh;
-- USE kastumbuh;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Cash Pools (Wallets/Accounts) Table
CREATE TABLE IF NOT EXISTS cash_pools (
    id BIGINT PRIMARY KEY, -- Using frontend timestamp IDs
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_business TINYINT(1) DEFAULT 1,
    purpose VARCHAR(100) DEFAULT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT PRIMARY KEY, -- Using frontend timestamp IDs
    user_id INT NOT NULL,
    cash_pool_id BIGINT NOT NULL,
    related_pool_id BIGINT DEFAULT NULL, -- For transfers
    idempotency_key VARCHAR(255) UNIQUE,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    pool_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (cash_pool_id) REFERENCES cash_pools(id) ON DELETE CASCADE,
    FOREIGN KEY (related_pool_id) REFERENCES cash_pools(id) ON DELETE SET NULL,
    CHECK (type IN ('INCOME', 'EXPENSE', 'TRANSFER'))
) ENGINE=InnoDB;
