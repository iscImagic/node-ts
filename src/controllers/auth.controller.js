const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token.util');
const userService = require('../services/user.service');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await userService.findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await userService.createUser({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }
    // Generate a JWT token
    const token = generateAccessToken(user._id);
    // Optionally, you can generate a refresh token here
    const refreshToken = generateRefreshToken(user._id);
    await userService.saveRefreshToken(user._id, refreshToken);

    res.status(200)
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,       // en producción, HTTPS obligatorio
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      })
      .json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  } 
}

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming userId is set in the request by authentication middleware
    const user = await userService.getUserById(userId); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Get the refresh token from cookies
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const user = await userService.findUserByRefreshToken(refreshToken);
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
      // Generate a new access token
      const newAccessToken = generateAccessToken(user._id);
      res.status(200).json({ token: newAccessToken });
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: 'No refresh token provided' });
  }

  try {
    // Clear the refresh token from the user's record
    await userService.clearRefreshToken(refreshToken);
    res.clearCookie('refreshToken'); // Clear the cookie
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
