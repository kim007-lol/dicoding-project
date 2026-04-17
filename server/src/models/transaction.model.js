const db = require('../config/database');

class TransactionModel {
  static async findAllByUserId(userId, { type, startDate, endDate } = {}) {
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create({ id, user_id, cash_pool_id, related_pool_id, idempotency_key, type, amount, category, notes, date, pool_name, status }) {
    const txId = id || Date.now();
    await db.query(
      `INSERT INTO transactions (id, user_id, cash_pool_id, related_pool_id, idempotency_key, type, amount, category, notes, date, pool_name, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [txId, user_id, cash_pool_id, related_pool_id || null, idempotency_key || null, type, amount, category || null, notes || null, date, pool_name, status || 'COMPLETED']
    );
    const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [txId]);
    return rows[0];
  }

  static async createTransfer(userId, data) {
    const { id, cash_pool_id, related_pool_id, idempotency_key, amount, notes, date, pool_name, status } = data;
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      const txId = id || Date.now();
      await conn.query(
        `INSERT INTO transactions (id, user_id, cash_pool_id, related_pool_id, idempotency_key, type, amount, category, notes, date, pool_name, status) 
         VALUES (?, ?, ?, ?, ?, 'TRANSFER', ?, 'Transfer Antar Kas', ?, ?, ?, ?)`,
        [txId, userId, cash_pool_id, related_pool_id, idempotency_key || null, amount, notes || null, date, pool_name, status || 'COMPLETED']
      );

      // Update balances
      await conn.query('UPDATE cash_pools SET balance = balance - ?, last_activity = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [amount, cash_pool_id, userId]);
      await conn.query('UPDATE cash_pools SET balance = balance + ?, last_activity = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [amount, related_pool_id, userId]);

      await conn.commit();

      const [rows] = await conn.query('SELECT * FROM transactions WHERE id = ?', [txId]);
      return rows[0];
    } catch (e) {
      await conn.rollback();
      throw e;
    } finally {
      conn.release();
    }
  }

  static async update(id, { type, amount, category, notes, date }) {
    const fields = [];
    const params = [];

    if (type !== undefined) { fields.push('type = ?'); params.push(type); }
    if (amount !== undefined) { fields.push('amount = ?'); params.push(amount); }
    if (category !== undefined) { fields.push('category = ?'); params.push(category); }
    if (notes !== undefined) { fields.push('notes = ?'); params.push(notes); }
    if (date !== undefined) { fields.push('date = ?'); params.push(date); }

    if (fields.length === 0) return null;

    params.push(id);
    await db.query(`UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`, params);
    return TransactionModel.findById(id);
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM transactions WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getSummary(userId) {
    const [rows] = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS total_expense,
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS balance,
        COUNT(*) AS total_transactions
      FROM transactions WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  }

  static async getRecentByUserId(userId, limit = 5) {
    const [rows] = await db.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC LIMIT ?',
      [userId, limit]
    );
    return rows;
  }

  static async getIncomeStatement(userId, startDate, endDate) {
    const [rows] = await db.query(
      `SELECT 
         SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) as total_revenue,
         SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) as total_expenses,
         t.category,
         t.type
       FROM transactions t
       JOIN cash_pools p ON t.cash_pool_id = p.id
       WHERE t.user_id = ? 
         AND p.is_business = 1 
         AND t.date >= ? AND t.date <= ?
       GROUP BY t.category, t.type`,
      [userId, startDate, endDate]
    );
    return rows;
  }
}

module.exports = TransactionModel;
