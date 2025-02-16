const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Add user from payload with both id and userId for compatibility
    req.user = {
      id: decoded.userId,
      userId: decoded.userId // Keep userId for backward compatibility
    };

    console.log('Auth middleware:', {
      token: token.substring(0, 20) + '...',
      decodedUserId: decoded.userId,
      userObject: req.user
    });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
}; 