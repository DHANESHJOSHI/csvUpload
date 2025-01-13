import connectToDatabase from '../../../lib/db';
import bcrypt from 'bcryptjs';
import Admin from '../../../models/Admin';

const registerHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password, name, role } = req.body;

    try {
      await connectToDatabase(); // Establish connection to MongoDB

      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save a new admin
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
        role: role || 'admin',
      });

      await newAdmin.save();

      res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
      console.error('Error in registration:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default registerHandler;
