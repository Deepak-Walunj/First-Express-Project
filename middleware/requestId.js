const { v4: uuidv4 } = require('uuid');

module.exports = function requestId(req, res, next) {
  const requestId = uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};
