import jwt from 'jsonwebtoken';
import Admin from '../../../models/Admin';
import connectToDatabase from '../../lib/db';

const userHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Extract token from cookies
    const token = req.headers.cookie?.split('authToken=')[1];

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in .env

    await connectToDatabase(); // Establish connection to MongoDB

    const admin = await Admin.findOne(decoded.email).select('-password');

    if (!admin) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Return user details
    res.status(200).json({ user: admin });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default userHandler;
