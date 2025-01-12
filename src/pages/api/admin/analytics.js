import jwt from 'jsonwebtoken';
import Admin from '../../../models/Admin';
import Scholarship from '../../models/Scholarship';
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
    const totalScholarshipCount = await Scholarship.countDocuments();
    const selectCount = await Scholarship.countDocuments({ status: 'Selected' });
    const notSelectCount = await Scholarship.countDocuments({ status: 'Not Selected' });
    
    if (!totalScholarshipCount && totalScholarshipCount !== 0) {
      return res.status(404).json({ error: 'Error counting scholarships' });
    }

    // Return scholarship counts
    res.status(200).json({ 
      totalScholarships: totalScholarshipCount,
      selectCount: selectCount,
      notSelectCount: notSelectCount,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching scholarship count' });
  }
};

export default userHandler;