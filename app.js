const path = require('path');
// importing express
const express = require('express');

// HTTP request logger middleware
const morgan = require('morgan');
const compression = require('compression');

// Error Handlers
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const transactionRoutes = require('./routes/transactionRoutes');

// A function that upon calling will add a bunch of methods from express to our variable = app
const app = express();

//[1] MIDDLEWARES ---------------------------------------------------------------------------
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// This is so the post requests are converted into a JSON format. Without it, when we make a post request, we would not be able to see the JSON data in console.
app.use(express.json());

// To access the static files or in other words the public folder files
app.use(express.static(path.join(__dirname, 'public')));

// To compress all the text sent to client
app.use(compression());

// To add request time to when a request is made
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// [3] ROUTES ---------------------------------------------------------------------------
app.use('/api/transaction', transactionRoutes);

// MIDDLEWARE: To handle the unhandled routes
// Rememeber, middleware get added to the middleware stack and this is why this error handler works
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
