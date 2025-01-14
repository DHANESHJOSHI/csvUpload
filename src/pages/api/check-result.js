import Scholarship from '@/models/Scholarship';
import connectToDatabase from '../../lib/db';

const Studentshandler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            if (!req.query.email) {
                return res.status(400).json({ error: 'Email is required' });
            }

            await connectToDatabase();

            // Get user by email with specific fields only
            const student = await Scholarship.findOne(
                { email: req.query.email },
                { password: 0, __v: 0 } // Exclude sensitive fields
            );

            if (!student) {
                return res.status(404).json({ error: 'Student not found' });
            }

            // Add the logic to include the scholarship status
            
            const scholarshipStatus = student.status || 'Not Found';
            
            return res.status(200).json({
                data: {
                    ...student.toObject(),
                    isSelected: scholarshipStatus === 'Selected'  // Return a boolean indicating the status
                }
            });
            
        } catch (err) {
            res.status(500).json({ error: 'Error fetching student data' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};

export default Studentshandler;
