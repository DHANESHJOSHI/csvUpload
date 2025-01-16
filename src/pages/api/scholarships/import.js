import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import Scholarship from '@/models/Scholarship';
import connectToDatabase from '@/lib/db';

// Helper function to clean and cast to number
const castToNumber = (value) => {
  if (value === null || value === '' || value === 'null') return null;
  const cleanedValue = value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except dots
  const number = parseFloat(cleanedValue);
  return isNaN(number) ? null : number; // Return null if the value is not a valid number
};

// Helper function to cast to boolean
const castToBoolean = (value) => {
  if (value === null || value === '' || value === 'null') return null;
  const cleanedValue = value.toString().toLowerCase();
  if (cleanedValue === 'true' || cleanedValue === 'yes' || cleanedValue === '1') return true;
  if (cleanedValue === 'false' || cleanedValue === 'no' || cleanedValue === '0') return false;
  return null; // Return null for invalid boolean values
};

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
    const invalidRecords = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        const {
          name,
          email,
          status,
          scholarshipName,
          gender,
          state,
          psychometricReport,
          coachingName,
          coachingState,
          natureOfCoaching,
          scholarshipID,
          cseAttempts,
          postGraduationCompleted,
          fieldOfStudy,
          graduationPercentage,
          twelfthGradePercentage,
          tenthGradePercentage,
          familyAnnualIncome,
          guardianOccupation,
          category,
          age,
          contactNumber,
        } = data;

        const record = {
          name,
          email,
          status: status || 'Not Selected',
          scholarshipName,
          gender: gender ? gender.toLowerCase() : '',
          state,
          psychometricReport,
          coachingName,
          coachingState,
          natureOfCoaching,
          scholarshipID,
          cseAttempts: castToNumber(cseAttempts),
          postGraduationCompleted: castToBoolean(postGraduationCompleted),
          fieldOfStudy,
          graduationPercentage: castToNumber(graduationPercentage),
          twelfthGradePercentage: castToNumber(twelfthGradePercentage),
          tenthGradePercentage: castToNumber(tenthGradePercentage),
          familyAnnualIncome: castToNumber(familyAnnualIncome),
          guardianOccupation,
          category,
          age: castToNumber(age),
          contactNumber,
        };

        // Validate record
        if (!record.name || !record.email) {
          invalidRecords.push({ record, error: 'Name and email are required fields' });
        } else {
          results.push(record);
        }
      })
      .on('end', async () => {
        try {
          await Scholarship.insertMany(results);
          fs.unlinkSync(req.file.path);
          res.status(200).json({ message: 'Upload processed successfully', results, invalidRecords });
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
    bodyParser: false,
  },
};
