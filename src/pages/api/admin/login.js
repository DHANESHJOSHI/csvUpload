import connectToDatabase from '../../lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../../models/Admin';

const loginHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    await connectToDatabase(); // Establish connection to MongoDB

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: existingAdmin._id, email: existingAdmin.email, role: existingAdmin.role },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is set in the .env file
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Set the token in an HTTP-only cookie with security options
    res.setHeader(
      'Set-Cookie',
      `authToken=${token}; HttpOnly; Max-Age=3600; Path=/; Secure; SameSite=Strict`
    );

    // Send response with additional user details
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: existingAdmin.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default loginHandler;
