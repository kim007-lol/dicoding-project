const db = require('../config/database');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

exports.loadData = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const [pools] = await db.query(
    'SELECT id, name, is_business, purpose, balance, last_activity FROM cash_pools WHERE user_id = ? ORDER BY last_activity DESC',
    [userId]
  );

  const [transactions] = await db.query(
    'SELECT id, cash_pool_id, related_pool_id, idempotency_key, type, category, amount, date, notes, pool_name, status, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );

  // Convert is_business from 0/1 to boolean
  const formattedPools = pools.map(p => ({
    ...p,
    id: Number(p.id),
    is_business: p.is_business === 1,
    balance: Number(p.balance),
  }));

  const formattedTx = transactions.map(t => ({
    ...t,
    id: Number(t.id),
    cash_pool_id: Number(t.cash_pool_id),
    related_pool_id: t.related_pool_id ? Number(t.related_pool_id) : null,
    amount: Number(t.amount),
  }));

  res.status(200).json(new ApiResponse(200, { pools: formattedPools, transactions: formattedTx }, 'Data berhasil dimuat'));
});

exports.syncData = catchAsync(async (req, res) => {
  const { pools, transactions } = req.body;
  const userId = req.user.id; // From auth middleware

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Sync Pools (Upsert)
    if (pools && pools.length > 0) {
      for (const pool of pools) {
        await conn.query(
          `INSERT INTO cash_pools (id, user_id, name, is_business, purpose, balance, last_activity) 
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           name = VALUES(name), is_business = VALUES(is_business), purpose = VALUES(purpose), balance = VALUES(balance), last_activity = VALUES(last_activity)`,
          [pool.id, userId, pool.name, pool.is_business === true || pool.is_business === 'true' ? 1 : 0, pool.purpose || null, pool.balance, new Date(pool.last_activity)]
        );
      }
    }

    // 2. Sync Transactions (Upsert)
    if (transactions && transactions.length > 0) {
      for (const tx of transactions) {
        await conn.query(
          `INSERT INTO transactions (id, user_id, cash_pool_id, related_pool_id, idempotency_key, type, category, amount, date, notes, pool_name, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           cash_pool_id = VALUES(cash_pool_id), related_pool_id = VALUES(related_pool_id), idempotency_key = VALUES(idempotency_key), type = VALUES(type), 
           category = VALUES(category), amount = VALUES(amount), date = VALUES(date), notes = VALUES(notes), 
           pool_name = VALUES(pool_name), status = VALUES(status)`,
          [
            tx.id, userId, tx.cash_pool_id, tx.related_pool_id || null, tx.idempotency_key || null, tx.type, 
            tx.category, tx.amount, tx.date, tx.notes, tx.pool_name, tx.status
          ]
        );
      }
    }

    await conn.commit();
    res.status(200).json(new ApiResponse(200, null, 'Data successfully synced with Cloud Database.'));
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
});
