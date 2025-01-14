import jwt from 'jsonwebtoken';
import Scholarship from '../../../models/Scholarship';
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
    // Connect to the database
    await connectToDatabase(); // Establish connection to MongoDB

    // Extract parameters from the query (scholarshipName, status)
    const { scholarshipName, status } = req.query;

    // Create a filter object for scholarshipName and status if provided
    let filter = {};
    if (scholarshipName) {
      filter.scholarshipName = scholarshipName;
    }
    if (status) {
      filter.status = status;
    }

    // Fetch scholarship counts based on the filter
    const totalScholarshipCount = await Scholarship.countDocuments(filter);
    const selectCount = await Scholarship.countDocuments({ ...filter, status: 'Selected' });
    const notSelectCount = await Scholarship.countDocuments({ ...filter, status: 'Not Selected' });

    // Gender-based analytics with the scholarshipName and status filter
    const maleApplications = await Scholarship.countDocuments({ ...filter, gender: 'male' });
    const femaleApplications = await Scholarship.countDocuments({ ...filter, gender: 'female' });
    const otherGenderApplications = await Scholarship.countDocuments({ ...filter, gender: 'other' });

    // State-wise analytics with the scholarshipName and status filter
    const stateWiseAnalytics = await Scholarship.aggregate([
      { $match: filter },
      { $group: { _id: '$state', count: { $sum: 1 } } },
    ]);

    // Response payload
    const responsePayload = {
      totalScholarships: totalScholarshipCount,
      selectCount,
      notSelectCount,
      genderAnalytics: {
        maleApplications,
        femaleApplications,
        otherGenderApplications,
      },
      stateWiseAnalytics, // Example: [{ _id: 'Gujarat', count: 50 }, { _id: 'Delhi', count: 30 }]
    };

    // Return analytics
    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching scholarship analytics' });
  }
};

// Exporting the middleware wrapped around the user handler
export default authenticateToken(userHandler);
