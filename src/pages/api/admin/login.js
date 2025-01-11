import connectToDatabase from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Make sure to install this package
import Admin from '../../models/Admin';

const loginHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      await connectToDatabase(); // Establish connection to MongoDB

      // Check if admin exists
      const existingAdmin = await Admin.findOne({ email });
      if (!existingAdmin) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check if password is correct
      const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token (use your own secret key)
      const token = jwt.sign(
        { id: existingAdmin._id, email: existingAdmin.email, role: existingAdmin.role },
        process.env.JWT_SECRET, // Make sure to set this in your .env file
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Set token in HTTP-only cookie
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`);

      // Send response with redirect
      res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};

export default loginHandler;