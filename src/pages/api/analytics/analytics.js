import Scholarship from '@/models/Scholarship';
import connectToDatabase from '../../../lib/db';
import jwt from 'jsonwebtoken';

const Analyticshandler = async (req, res) => {
    const { method, headers, query } = req;

    try {
        // Authenticate token
        const token = headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        jwt.verify(token, process.env.JWT_SECRET);

        // Connect to database
        await connectToDatabase();

        if (method === 'GET') {
            // Fetch data and calculate counts
            const students = await Scholarship.find();

            const counts = students.reduce(
                (acc, student) => {
                    if (student.status === 'Selected') {
                        acc.selected += 1;
                    } else if (student.status === 'Not Selected') {
                        acc.notSelected += 1;
                    }
                    acc.total += 1;
                    return acc;
                },
                { selected: 0, notSelected: 0, total: 0 }
            );

            return res.status(200).json({ counts });
        } else {
            // Unsupported method
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

export default Analyticshandler;
