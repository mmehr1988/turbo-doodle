const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('../models/transactionModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    // Options to deal with deprecation warnings.
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const transactionSeed = [
  {
    name: 'dinner',
    value: 30,
  },
  {
    name: 'lunch',
    value: 30,
  },
];

// SEED DB TO ATLAS
const seedData = async () => {
  try {
    await Transaction.deleteMany();
    await Transaction.create(transactionSeed);
    console.log(`Database successfully loaded with ${await Transaction.countDocuments()} records`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

seedData();
