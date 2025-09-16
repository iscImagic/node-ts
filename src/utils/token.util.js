const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  } catch (error) {
    console.error('Error generating access token', error);
    throw error;
  }
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};