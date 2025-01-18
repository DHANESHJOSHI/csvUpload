import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import Scholarship from '@/models/Scholarship';
import connectToDatabase from '@/lib/db';

// Helper function to clean and cast to number
const castToNumber = (value) => {
  if (value === null || value === '' || value === 'null') return null;
  const cleanedValue = value.replace(/[^0-9.-]/g, ''); // Remove non-numeric characters except dots and minus sign
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
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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
    const emailSet = new Set();
    const updateOperations = [];
    const newRecords = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        const record = {};
        console.log('Data:', data);

        // Import all fields from Excel dynamically
        Object.keys(data).forEach(key => {
          if (['cseAttempts', 'graduationPercentage', 'twelfthGradePercentage', 'tenthGradePercentage', 'totalAmount', 'familyAnnualIncome', 'age', 'amountDisbursed'].includes(key)) {
            record[key] = castToNumber(data[key]);
          } else if (key === 'postGraduationCompleted') {
            record[key] = castToBoolean(data[key]);
          } else if (key === 'gender' && data[key]) {
            record[key] = data[key].toLowerCase();
          } else if (key === 'status') {
            record[key] = data[key] || 'Not Selected';
          } else {
            record[key] = data[key];
          }
        });

        // Validate record
        if (!record.name || !record.email) {
          invalidRecords.push({ record, error: 'Name and email are required fields' });
        } else if (emailSet.has(record.email)) {
          invalidRecords.push({ record, error: 'Duplicate email found in CSV' });
        } else {
          emailSet.add(record.email);
          results.push(record);
        }
      })
      .on('end', async () => {
        try {
          // Check for existing emails and prepare update/insert operations
          for (const record of results) {
            const existingRecord = await Scholarship.findOne({ email: record.email });
            if (existingRecord) {
              updateOperations.push({
                updateOne: {
                  filter: { email: record.email },
                  update: { $set: record }
                }
              });
            } else {
              newRecords.push(record);
            }
          }

          // Perform bulk operations
          if (updateOperations.length > 0) {
            await Scholarship.bulkWrite(updateOperations);
          }
          if (newRecords.length > 0) {
            await Scholarship.insertMany(newRecords);
          }

          fs.unlinkSync(req.file.path);
          res.status(200).json({ 
            message: 'Upload processed successfully', 
            updated: updateOperations.length,
            inserted: newRecords.length,
            invalidRecords 
          });
        } catch (err) {
          console.error('Database Error:', err.message);
          fs.unlinkSync(req.file.path);
          res.status(500).json({ error: 'Error saving data to the database' });
        }
      });
  } catch (error) {
    console.error('File Processing Error:', error.message);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'File processing failed' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};