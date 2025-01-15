import authenticateToken from '@/lib/authMiddleware';
import { connectToDatabase } from '@/lib/db';
import Admin from '../../../models/Admin';

const handler = async (req, res) => {
  try {
    // Check if the request method is GET
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Access the user data attached by the middleware (authenticateToken)
    const user = req.user;

    // Connect to MongoDB and find the admin data based on the user ID
    const { db } = await connectToDatabase();
    const adminData = await Admin.findOne({ _id: user.id });

    if (!adminData) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Respond with the admin data
    res.status(200).json(adminData);
  } catch (error) {
    console.error('Error in /api/admin/dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Wrap the handler with authentication middleware
export default authenticateToken(handler);
