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
    console.log('Received token:', token); // Debug log

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in .env

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

export default userHandler;