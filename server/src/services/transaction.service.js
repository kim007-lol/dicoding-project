const TransactionModel = require('../models/transaction.model');
const ApiError = require('../utils/ApiError');

class TransactionService {
  static async create(userId, data) {
    const { type, amount, category, description, transaction_date, idempotency_key, cash_pool_id } = data;

    if (!type || !amount || !transaction_date) {
      throw new ApiError(400, 'Type, amount, dan transaction_date wajib diisi');
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      throw new ApiError(400, 'Type harus INCOME atau EXPENSE');
    }

    if (amount <= 0) {
      throw new ApiError(400, 'Amount harus lebih dari 0');
    }

    return TransactionModel.create({
      user_id: userId,
      type,
      amount,
      category,
      notes: description,
      date: transaction_date,
      idempotency_key,
      cash_pool_id
    });
  }

  static async transfer(userId, data) {
    const { amount, transaction_date, idempotency_key, from_pool_id, to_pool_id, description, pool_name } = data;

    if (!amount || !transaction_date || !from_pool_id || !to_pool_id) {
      throw new ApiError(400, 'Amount, transaction_date, from_pool_id, dan to_pool_id wajib diisi');
    }

    if (amount <= 0) {
      throw new ApiError(400, 'Amount harus lebih dari 0');
    }

    if (from_pool_id === to_pool_id) {
      throw new ApiError(400, 'Kas asal dan tujuan tidak boleh sama');
    }

    return TransactionModel.createTransfer(userId, {
      cash_pool_id: from_pool_id,
      related_pool_id: to_pool_id,
      idempotency_key,
      amount,
      notes: description,
      date: transaction_date,
      pool_name
    });
  }

  static async getAll(userId, filters) {
    return TransactionModel.findAllByUserId(userId, filters);
  }

  static async getOne(userId, transactionId) {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      throw new ApiError(404, 'Transaksi tidak ditemukan');
    }
    if (transaction.user_id !== userId) {
      throw new ApiError(403, 'Tidak memiliki akses ke transaksi ini');
    }
    return transaction;
  }

  static async update(userId, transactionId, data) {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      throw new ApiError(404, 'Transaksi tidak ditemukan');
    }
    if (transaction.user_id !== userId) {
      throw new ApiError(403, 'Tidak memiliki akses ke transaksi ini');
    }

    if (data.type && !['INCOME', 'EXPENSE'].includes(data.type)) {
      throw new ApiError(400, 'Type harus INCOME atau EXPENSE');
    }

    if (data.amount !== undefined && data.amount <= 0) {
      throw new ApiError(400, 'Amount harus lebih dari 0');
    }

    return TransactionModel.update(transactionId, data);
  }

  static async delete(userId, transactionId) {
    const transaction = await TransactionModel.findById(transactionId);
    if (!transaction) {
      throw new ApiError(404, 'Transaksi tidak ditemukan');
    }
    if (transaction.user_id !== userId) {
      throw new ApiError(403, 'Tidak memiliki akses ke transaksi ini');
    }
    return TransactionModel.delete(transactionId);
  }

  static async getSummary(userId) {
    return TransactionModel.getSummary(userId);
  }

  static async getRecent(userId, limit) {
    return TransactionModel.getRecentByUserId(userId, limit);
  }

  static async getIncomeStatement(userId, startDate, endDate) {
    if (!startDate || !endDate) {
      throw new ApiError(400, 'startDate dan endDate wajib diisi');
    }
    return TransactionModel.getIncomeStatement(userId, startDate, endDate);
  }
}

module.exports = TransactionService;
