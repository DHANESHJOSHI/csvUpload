import Scholarship from '@/models/Scholarship';
import connectToDatabase from '../../../lib/db';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const StudentsHandler = async (req, res) => {
    const { method, query, body } = req;

    try {
        const token = req.cookies.authToken;
        if (!token) return res.status(401).json({ error: 'No token provided' });

        jwt.verify(token, process.env.JWT_SECRET);

        await connectToDatabase();

        if (method === 'GET') {
            const { page = 1, limit = 5, search = "" } = query;
      const skip = (page - 1) * limit;

      const filter = search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { state: { $regex: search, $options: "i" } },
            ],
          }
        : {};

      const students = await Scholarship.find(filter)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Scholarship.countDocuments(filter);

      res.status(200).json({
        students,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      });
        } else if (method === 'PUT') {
            if (!query.email) return res.status(400).json({ error: 'Email is required' });

            const updatedStudent = await Scholarship.findOneAndUpdate(
                { email: query.email },
                body,
                { new: true }
            );
            if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });

            return res.status(200).json(updatedStudent);
        } else if (method === 'DELETE') {
            if (!query.email) return res.status(400).json({ error: 'Email is required' });

            const deletedStudent = await Scholarship.findOneAndDelete({ email: query.email });
            if (!deletedStudent) return res.status(404).json({ error: 'Student not found' });

            return res.status(200).json({ message: 'Student deleted successfully' });
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (err) {
        const errorMessage = err.name === 'JsonWebTokenError' ? 'Invalid or expired token' : err.message;
        res.status(500).json({ error: 'Server error', details: errorMessage });
    }
};

export default StudentsHandler;