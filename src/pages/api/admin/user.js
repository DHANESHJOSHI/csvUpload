import jwt from 'jsonwebtoken';
import Admin from '../../../models/Admin';
import connectToDatabase from '../../../lib/db';
import authenticateToken from '@/lib/authMiddleware';

const userHandler = async (req, res, token) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await connectToDatabase(); // Establish connection to MongoDB

    const users = await Admin.find().select('-password');

    if (!users) {
      return res.status(404).json({ error: 'No users found' });
    }

    // Return all users
    res.status(200).json({ users: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

export default authenticateToken(userHandler);