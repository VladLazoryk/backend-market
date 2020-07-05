/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    let token;
    const authorization = req.headers.authorization.split(' ');
    if (authorization[1]) {
      token = authorization[1];
    } else {
      token = authorization[0];
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
