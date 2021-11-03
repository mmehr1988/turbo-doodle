const Transaction = require('../models/transactionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// GET ALL REQUEST
exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const doc = await Transaction.find({}).sort({ date: -1 });

  // SEND RESPONSE
  res.json(doc);
});

// REQUEST: POST ONE
exports.createTransaction = catchAsync(async (req, res, next) => {
  const doc = await Transaction.create(req.body);

  res.json(doc);
});

exports.createTransactionBulk = catchAsync(async (req, res, next) => {
  const doc = await Transaction.insertMany(body);

  res.json(doc);
});
