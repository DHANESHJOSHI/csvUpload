import Scholarship from '@/models/Scholarship';
import connectToDatabase from '../../../lib/db';
import jwt from 'jsonwebtoken';

const Studentshandler = async (req, res) => {
    const { method, headers, query, body } = req;

    try {
        // Authenticate token
        // const token = headers.authorization?.split('')[1];
        const token = req.headers.cookie?.split('authToken=')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        jwt.verify(token, process.env.JWT_SECRET);

        // Connect to database
        await connectToDatabase();

        if (method === 'GET') {
            // Fetch data
            if (query.email) {
                // Get student by email
                const student = await Scholarship.findOne({ email: query.email });
                if (!student) {
                    return res.status(404).json({ error: 'Student not found' });
                }
                return res.status(200).json(student);
            } else {
                // Get all students
                const students = await Scholarship.find();
                
                return res.status(200).json(students);
            }
        } else if (method === 'PUT') {
            // Update student
            if (!query.email) {
                return res.status(400).json({ error: 'Email query parameter is required for updating a student' });
            }
            const updatedStudent = await Scholarship.findOneAndUpdate(
                { email: query.email },
                body, // Fields to update
                { new: true } // Return the updated document
            );
            if (!updatedStudent) {
                return res.status(404).json({ error: 'Student not found' });
            }
            return res.status(200).json(updatedStudent);
        } else if (method === 'DELETE') {
            // Delete student
            if (!query.email) {
                return res.status(400).json({ error: 'Email query parameter is required for deleting a student' });
            }
            const deletedStudent = await Scholarship.findOneAndDelete({ email: query.email });
            if (!deletedStudent) {
                return res.status(404).json({ error: 'Student not found' });
            }
            return res.status(200).json({ message: 'Student deleted successfully' });
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

export default Studentshandler;
