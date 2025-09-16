const User = require('../models/user.model');

async function getUserById(id) {
  return await User.findById(id).select('-password -refreshToken');
}

async function findUserByUsernameOrEmail(username, email) {
  return await User.findOne({ $or: [{ username }, { email }] });
}

async function findUserByEmail(email) {
  return await User.findOne({ email });
}


async function findUserByRefreshToken(refreshToken) {
  return await User.findOne({ refreshToken });
}


async function createUser(userData) {
  const user = new User(userData);
  return await user.save();
}

async function clearRefreshToken(refreshToken) {
  return await User.updateOne({ refreshToken }, { $set: { refreshToken: null } });
}

async function saveRefreshToken(userId, refreshToken) {
  return await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
}

module.exports = { getUserById, findUserByUsernameOrEmail, findUserByEmail, findUserByRefreshToken, createUser, saveRefreshToken };