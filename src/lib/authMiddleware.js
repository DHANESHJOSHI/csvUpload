import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const authenticateToken = (handler) => {
  return async (req, res) => {
    try {
      // Use cookie-parser middleware
      cookieParser()(req, res, () => {});

      if (!req.cookies) {
        return res.status(401).json({ message: 'Unauthorized. No cookies found.' });
      }

      // console.log('[Cookies]====>', req.cookies);

      const token = req.cookies.authToken; // Extract the authToken from cookies

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
      }

      // Verify token using secret key from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request object
      req.user = decoded;
      // Continue to the next handler if token is valid
      return handler(req, res, token);
    } catch (error) {
      console.error('Error during token verification:', error);
      return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }
  };
};

export default authenticateToken;