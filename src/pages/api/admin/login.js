import connectToDatabase from '../../../lib/db'; // Your database connection logic
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../../models/Admin'; // Your Admin model

const loginHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Establish connection to MongoDB
    await connectToDatabase();

    // Check if admin exists in the database
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with user details and a short expiration time (1 hour)
    const token = jwt.sign(
      { id: existingAdmin._id, email: existingAdmin.email, role: existingAdmin.role },
      process.env.JWT_SECRET, // Ensure the secret key is set in your .env
      { expiresIn: '1h' }
    );

    // Set the token in an HTTP-only cookie with security attributes
    const isProd = process.env.NODE_ENV === 'production'; // Check if it's production environment
    res.setHeader(
      'Set-Cookie',
      `authToken=${token}; HttpOnly; Max-Age=604800; Path=/; ${isProd ? 'Secure;' : ''} SameSite=Strict`
    );

    // Respond with a success message and user details (excluding password)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: existingAdmin._id,
        email: existingAdmin.email,
        role: existingAdmin.role,
        token,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default loginHandler;
