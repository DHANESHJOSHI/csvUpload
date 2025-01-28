import connectToDatabase from '../../../lib/db';
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
    await connectToDatabase();

    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: existingAdmin._id, email: existingAdmin.email, role: existingAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.setHeader(
      'Set-Cookie',
      `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=86400; Path=/;`
    );

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