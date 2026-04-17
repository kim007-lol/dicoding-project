const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

// All transaction routes require authentication
router.use(auth);

router.get('/summary', transactionController.getSummary);
router.get('/recent', transactionController.getRecent);
router.get('/reports/income-statement', transactionController.getIncomeStatement);
router.post('/transfers', transactionController.createTransfer);

router
  .route('/')
  .post(transactionController.createTransaction)
  .get(transactionController.getTransactions);

router
  .route('/:transactionId')
  .get(transactionController.getTransaction)
  .patch(transactionController.updateTransaction)
  .delete(transactionController.deleteTransaction);

module.exports = router;
