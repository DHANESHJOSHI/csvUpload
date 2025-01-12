import Scholarship from '@/pages/models/Scholarship';
import connectToDatabase from '../../lib/db';
import jwt from 'jsonwebtoken';

const Studentshandler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await connectToDatabase();

            if (req.query.email) {
                // Get user by email
                const student = await Scholarship.findOne({ email: req.query.email });
                if (!student) {
                    return res.status(404).json({ error: 'Student not found' });
                }
                return res.status(200).json(student);
            } else {
                // Get all users
                const students = await Scholarship.find();
                return res.status(200).json(students);
            }
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