const { db } = await connectToDatabase();
const Admin = require('../../../models/Admin');

 export default async function handler(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const adminData = await Admin.findOne({ token });

      if (!adminData) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      res.status(200).json(adminData);
    } catch (error) {
      console.error('Error in /api/admin/dashboard:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }