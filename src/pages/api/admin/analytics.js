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

    // Decode the token to get user info (to check for admin role)
    const decoded = jwt.decode(token);
    const isAdmin = decoded && decoded.role === 'admin';  // Assuming 'role' is part of your JWT payload

    // Connect to the database
    await connectToDatabase();

    // Extract parameters from the query
    const {
      type,
      status,
      category,
      gender,
      state,
      age,
      familyIncome,
      grade10,
      grade12,
      graduationPercentage,
      scholarshipID,
      coachingState,
      guardianOccupation,
      pwdPercentage,
      isMinority,
      postGraduationCompleted,
    } = req.query;

    // Create a filter object based on query parameters
    let filter = {};

    // Apply filter for scholarshipName if provided (allowing null or undefined)
    if (type && type !== 'all') {
      filter.scholarshipName = type;
    }

    // Apply filter for status if provided
    if (status && status !== 'all') {
      filter.status = status === 'selected' ? 'Selected' : 'Not Selected';
    }

    // Apply filter for category if provided
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Apply filter for gender if provided
    if (gender && gender !== 'all') {
      filter.gender = gender;
    }

    // Apply filter for state if provided
    if (state && state !== 'all') {
      filter.state = state;
    }

    // Apply filter for age range if provided (allowing null for age)
    if (age) {
      filter.age = { $gte: parseInt(age.split('-')[0]), $lte: parseInt(age.split('-')[1]) };
    }

    // Apply filter for family income range if provided (allowing null for familyIncome)
    if (familyIncome) {
      filter.familyAnnualIncome = { $gte: parseInt(familyIncome.split('-')[0]), $lte: parseInt(familyIncome.split('-')[1]) };
    }

    // Apply filter for academic performance (10th, 12th, graduation), allowing null for missing grades
    if (grade10) {
      filter.tenthGradePercentage = { $gte: parseInt(grade10) };
    }
    if (grade12) {
      filter.twelfthGradePercentage = { $gte: parseInt(grade12) };
    }
    if (graduationPercentage) {
      filter.graduationPercentage = { $gte: parseInt(graduationPercentage) };
    }

    // Apply filter for scholarship ID if provided (allowing null for scholarshipID)
    if (scholarshipID) {
      filter.scholarshipID = scholarshipID;
    }

    // Apply filter for coaching state if provided (allowing null for coachingState)
    if (coachingState) {
      filter.coachingState = coachingState;
    }

    // Apply filters for new fields
    if (guardianOccupation) {
      filter.guardianOccupation = guardianOccupation;
    }

    if (pwdPercentage) {
      filter.pwdPercentage = { $gte: parseInt(pwdPercentage) };
    }

    if (isMinority !== undefined) {
      filter.isMinority = isMinority;
    }

    if (postGraduationCompleted !== undefined) {
      filter.postGraduationCompleted = postGraduationCompleted;
    }

    // Handle `null` values for optional fields
    Object.keys(filter).forEach((key) => {
      if (filter[key] === '') {
        filter[key] = null;
      }
    });

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

    // Category-wise analytics with the filter
    const categoryWiseAnalytics = await Scholarship.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // State-wise analytics with the filter (Including totalAmount and amountDisbursed)
    const stateWiseAnalytics = await Scholarship.aggregate([
      { $match: filter },
      { 
        $group: {
          _id: '$state',
          totalAmount: { $sum: '$totalAmount' }, // Sum of totalAmount by state
          amountDisbursed: { $sum: '$amountDisbursed' }, // Sum of amountDisbursed by state
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }, // Sorting states by the total scholarship count
    ]);

    // Get total amount disbursed
    const totalAmountDisbursed = await Scholarship.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalDisbursed: { $sum: '$amountDisbursed' }
        }
      }
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

    // Financial and academic analytics with state-wise total amount
    const financialAnalytics = await Scholarship.aggregate([
      { $match: filter },
      { 
        $group: { 
          _id: '$state',
          totalIncome: { $sum: '$familyAnnualIncome' }, 
          avgGrade: { $avg: '$graduationPercentage' },
          totalAmount: { $sum: '$totalAmount' }
        } 
      },
    ]);

    // Analytics by state, including gender and selected/not-selected counts
    const stateTypeWiseAnalytics = await Scholarship.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { state: '$state', scholarshipName: '$scholarshipName' },
          total: { $sum: 1 },
          selected: {
            $sum: { $cond: [{ $eq: ['$status', 'Selected'] }, 1, 0] },
          },
          notSelected: {
            $sum: { $cond: [{ $eq: ['$status', 'Not Selected'] }, 1, 0] },
          },
          male: { $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } },
          female: { $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } },
          other: { $sum: { $cond: [{ $eq: ['$gender', 'other'] }, 1, 0] } },
          totalAmount: { $sum: '$totalAmount' },
          amountDisbursed: { $sum: '$amountDisbursed' }
        },
      },
      { $sort: { '_id.state': 1, '_id.scholarshipName': 1 } }, // Sort by state and scholarship type
    ]);

    // Response payload
    const responsePayload = {
      totalScholarships: totalScholarshipCount,
      selectCount,
      notSelectCount,
      allScholarshipNames,
      totalAmountDisbursed: totalAmountDisbursed[0]?.totalDisbursed || 0,
      genderAnalytics: {
        maleApplications,
        femaleApplications,
        otherGenderApplications,
      },
      categoryWiseAnalytics,
      stateWiseAnalytics,
      scholarshipAnalytics,
      financialAnalytics,
      stateTypeWiseAnalytics,
    };

    // If the user is not an admin, exclude the sensitive fields (name, email)
    if (!isAdmin) {
      responsePayload.allScholarshipNames = responsePayload.allScholarshipNames.map(scholarship => {
        // Exclude sensitive fields like name and email if needed
        return { ...scholarship, name: undefined, email: undefined };  // Example modification
      });
    }

    // Return analytics
    res.status(200).json(responsePayload);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching scholarship analytics' });
  }
};

export default authenticateToken(userHandler);