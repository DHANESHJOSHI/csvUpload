import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    const token = req.cookies.authToken; // Read cookie from request

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    // If token is valid, respond with success
    res.status(200).json({ message: 'Authenticated' });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Not authenticated' });
  }
}
