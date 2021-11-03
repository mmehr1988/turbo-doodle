const mongoose = require('mongoose');
const dotenv = require('dotenv');

// In order for morgan to work, the const = app needs to be placed after the dotenv
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// This will return a promise, and as a result we need to handle the promise as well.
mongoose
  .connect(DB, {
    // Options to deal with deprecation warnings.
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// START SERVER ---------------------------------------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
