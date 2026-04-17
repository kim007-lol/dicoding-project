const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then(conn => {
    console.log('Successfully connected to the MySQL database.');
    conn.release();
  })
  .catch(err => {
    console.error('Error connecting to the MySQL database:', err.message);
  });

module.exports = pool;
