const express = require('express');
const authRoutes = require('./auth.routes');
const transactionRoutes = require('./transaction.routes');
const syncRoutes = require('./sync.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes); // Kept for legacy compatibility if needed
router.use('/sync', syncRoutes);

module.exports = router;
