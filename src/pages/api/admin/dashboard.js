const { db } = await connectToDatabase();
const Admin = require('../../../models/Admin');
const jwt = require('jsonwebtoken');

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the token (replace 'your-secret-key' with your actual secret key)
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if the admin exists
    const adminData = await Admin.findOne({ _id: decoded.id });

    if (!adminData) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.status(200).json(adminData);
  } catch (error) {
    console.error('Error in /api/admin/dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
