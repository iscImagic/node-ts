const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token no proporcionado' });

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}