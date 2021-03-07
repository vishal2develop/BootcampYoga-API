// Middleware example
// All middleware function will take these 3 params
// @desc logs requests to console
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
  );
  // every middleware should have next() to move onto next middleware
  next();
};

module.exports = logger;
