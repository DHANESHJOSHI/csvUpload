import Scholarship from '@/pages/models/Scholarship';
import connectToDatabase from '../../lib/db';
import jwt from 'jsonwebtoken';

const Studentshandler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            // Verify JWT token from the Authorization header
            const token = req.headers.authorization?.split(' ')[1]; // Extract the token from 'Bearer <token>'

            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }

            // Verify the token using your JWT secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key

            // If the token is valid, proceed with fetching the data
            await connectToDatabase();

            // Fetch students from the database
            const students = await Scholarship.find();

            res.status(200).json(students);
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
            res.status(500).json({ error: 'Error fetching students' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

export default Studentshandler;
