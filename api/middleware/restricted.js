const { JWT_SECRET } = require('../secrets/index');
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next({ status: 401, message: 'token required' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      next({
        status: 401,
        message: 'Invalid token',
        stack: err.message,
      });
    } else {
      req.decodedJwt = decoded;
      next();
    }
  });
};
