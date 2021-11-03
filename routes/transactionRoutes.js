const express = require('express');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// API ROUTES
router.route('/').get(transactionController.getAllTransactions).post(transactionController.createTransaction).post(transactionController.createTransactionBulk);

module.exports = router;
