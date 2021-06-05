const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.headers.authorization) res.status(401).json({ message: 'not authorized' })
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);   // jwt.verify both verifies and decodes the token
    req.userData = decoded;
    next();
  } catch (error) {
      return res.status(401).json({
        message: 'Auth failed'
      });
  }
};

// Frontend when sending accessToken send in header as
// key: Authorization
// value: Bearer token_value
