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
    await connectToDatabase();

    // Extract parameters from the query (type, status)
    const { type, status } = req.query;

    // Create a filter object for scholarshipName and status
    let filter = {};

    // Map 'type' to 'scholarshipName'
    if (type && type !== 'all') {
      filter.scholarshipName = type;
    }

    // Map 'status' values to database values
    if (status && status !== 'all') {
      if (status === 'selected') {
        filter.status = 'Selected';
      } else if (status === 'notSelected') {
        filter.status = 'Not Selected';
      }
    }

    // Get all unique scholarship names
    const allScholarshipNames = await Scholarship.distinct('scholarshipName');

    // Fetch scholarship counts based on the filter
    const totalScholarshipCount = await Scholarship.countDocuments(filter);
    const selectCount = await Scholarship.countDocuments({ ...filter, status: 'Selected' });
    const notSelectCount = await Scholarship.countDocuments({ ...filter, status: 'Not Selected' });

    // Gender-based analytics with the filter
    const maleApplications = await Scholarship.countDocuments({ ...filter, gender: 'male' });
    const femaleApplications = await Scholarship.countDocuments({ ...filter, gender: 'female' });
    const otherGenderApplications = await Scholarship.countDocuments({ ...filter, gender: 'other' });

    // State-wise analytics with the filter
    const stateWiseAnalytics = await Scholarship.aggregate([
      { $match: filter },
      { $group: { _id: '$state', count: { $sum: 1 } } },
    ]);

    // Scholarship-specific analytics
    const scholarshipAnalytics = await Scholarship.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$scholarshipName',
          total: { $sum: 1 },
          selected: {
            $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] },
          },
          notSelected: {
            $sum: { $cond: [{ $eq: ['$status', 'Not Selected'] }, 1, 0] },
          },
        },
      },
    ]);

    // Response payload
    const responsePayload = {
      totalScholarships: totalScholarshipCount,
      selectCount,
      notSelectCount,
      allScholarshipNames,
      genderAnalytics: {
        maleApplications,
        femaleApplications,
        otherGenderApplications,
      },
      stateWiseAnalytics,
      scholarshipAnalytics, // Added scholarship-specific analytics
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
