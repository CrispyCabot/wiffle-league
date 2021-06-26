const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
require('dotenv').config()

const createAccessToken = (user) => {
  return jwt.sign({ userId: String(user._id) }, process.env.JWT_KEY, { expiresIn: "2h" });
}

const createJRTEM = (user) => {
  return jwt.sign({ userId: String(user._id), tokenVersion: user.token_version }, process.env.JRTEM_KEY, { expiresIn: "7d" });
}

const sendRefreshToken = (req, res, token) => {
  res.cookie('jrtem', token, {
    sameSite: 'None',
    secure: true,
    httpOnly: true
  })
}

module.exports = {
  createAccessToken,
  createJRTEM,
  sendRefreshToken
}