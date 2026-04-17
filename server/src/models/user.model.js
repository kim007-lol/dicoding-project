const db = require('../config/database');

class UserModel {
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT id, name, email, business_name, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create({ name, email, password, business_name }) {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, business_name) VALUES (?, ?, ?, ?)',
      [name, email, password, business_name || null]
    );
    return { id: result.insertId, name, email, business_name };
  }
}

module.exports = UserModel;
