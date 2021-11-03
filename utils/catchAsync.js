//MIDDLEWARE to write cleaner Async functions
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};
