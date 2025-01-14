import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import Scholarship from '@/models/Scholarship';
import connectToDatabase from '@/lib/db';

// Multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  },
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error('Error:', error.message);
    console.log('Error:', error);
    res.status(500).json({ error: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('files')); // Single file upload

apiRoute.post(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    await connectToDatabase();

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        // Field validation
        const { name, email, status, scholarshipName, gender, state } = data;
        const errors = [];

        if (!name) errors.push('Name is required');
        if (!email || !email.includes('@') || !email.includes('.')) errors.push('Invalid email format');
        if (!scholarshipName) errors.push('Scholarship Name is required');
        if (!gender || !['male', 'female', 'other'].includes(gender.toLowerCase())) errors.push('Invalid gender');
        if (!state) errors.push('State is required');

        if (errors.length > 0) {
          results.push({ ...data, errors });
        } else {
          results.push({
            name,
            email,
            status: status || 'Not Selected',
            scholarshipName,
            gender: gender.toLowerCase(),
            state,
          });
        }
      })
      .on('end', async () => {
        try {
          for (const record of results) {
            if (record.errors) continue; // Skip invalid records

            const existing = await Scholarship.findOne({ email: record.email });
            if (existing) {
              // Update existing record if needed
              Object.assign(existing, record);
              await existing.save();
            } else {
              // Create new record
              await Scholarship.create(record);
            }
          }

          fs.unlinkSync(req.file.path); // Delete the uploaded file
          res.status(200).json({ message: 'Upload processed successfully', results });
        } catch (err) {
          console.error('Database Error:', err.message);
          res.status(500).json({ error: 'Error saving data to the database' });
        }
      });
  } catch (error) {
    console.error('File Processing Error:', error.message);
    res.status(500).json({ error: 'File processing failed' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disables body parsing, because we are handling file upload manually
  },
};
