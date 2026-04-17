const TransactionService = require('../services/transaction.service');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

const createTransaction = catchAsync(async (req, res) => {
  const transaction = await TransactionService.create(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, transaction, 'Transaksi berhasil dibuat'));
});

const getTransactions = catchAsync(async (req, res) => {
  const { type, start_date, end_date } = req.query;
  const transactions = await TransactionService.getAll(req.user.id, {
    type,
    startDate: start_date,
    endDate: end_date,
  });
  res.status(200).json(new ApiResponse(200, transactions, 'Data transaksi berhasil diambil'));
});

const getTransaction = catchAsync(async (req, res) => {
  const transaction = await TransactionService.getOne(req.user.id, parseInt(req.params.transactionId));
  res.status(200).json(new ApiResponse(200, transaction, 'Detail transaksi berhasil diambil'));
});

const updateTransaction = catchAsync(async (req, res) => {
  const transaction = await TransactionService.update(req.user.id, parseInt(req.params.transactionId), req.body);
  res.status(200).json(new ApiResponse(200, transaction, 'Transaksi berhasil diperbarui'));
});

const deleteTransaction = catchAsync(async (req, res) => {
  await TransactionService.delete(req.user.id, parseInt(req.params.transactionId));
  res.status(200).json(new ApiResponse(200, null, 'Transaksi berhasil dihapus'));
});

const getSummary = catchAsync(async (req, res) => {
  const summary = await TransactionService.getSummary(req.user.id);
  res.status(200).json(new ApiResponse(200, summary, 'Ringkasan keuangan berhasil diambil'));
});

const getRecent = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const transactions = await TransactionService.getRecent(req.user.id, limit);
  res.status(200).json(new ApiResponse(200, transactions, 'Transaksi terbaru berhasil diambil'));
});

const createTransfer = catchAsync(async (req, res) => {
  const transaction = await TransactionService.transfer(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, transaction, 'Transfer berhasil diproses'));
});

const getIncomeStatement = catchAsync(async (req, res) => {
  const { start_date, end_date } = req.query;
  const report = await TransactionService.getIncomeStatement(req.user.id, start_date, end_date);
  res.status(200).json(new ApiResponse(200, report, 'Laporan Laba Rugi SAK EMKM berhasil diambil'));
});

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getRecent,
  createTransfer,
  getIncomeStatement,
};
