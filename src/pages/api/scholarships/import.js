import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser'; // CSV parser
import Scholarship from '@/models/Scholarship';
import connectToDatabase from '../../../lib/db';

// Choose storage option: Disk or Memory
const useDiskStorage = true;

const storage = useDiskStorage
  ? multer.diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    })
  : multer.memoryStorage(); // In-memory storage for temporary files

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    // Optional: Restrict file types (e.g., CSV only)
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
    console.error('Error occurred:', error);
    res.status(500).json({ error: `There was an error! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// Middleware to handle file uploads
apiRoute.use(upload.array('files')); // Accept multiple files, 'files' matches the form's input name

apiRoute.post(async (req, res) => {
  try {
    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    await connectToDatabase();

    const uploadedFiles = req.files.map((file) => ({
      originalName: file.originalname,
      size: file.size,
      path: file.path || 'In-Memory', // In-memory files won't have a path
    }));

    // Parse the CSV and insert/update data in MongoDB
    const results = [];
    fs.createReadStream(uploadedFiles[0].path)
      .pipe(csv())
      .on('data', (data) => {
        // Check if email contains @ and . symbols
        if (!data.email || !data.email.includes('@') || !data.email.includes('.')) {
          // Return the error response if email format is invalid
          return res.status(400).json({
            error: 'Invalid email format. Email must contain @ and . symbols',
            field: 'email', // Optional: specify the field causing the error
            data: data // Optional: include the invalid data in the response
          });
        }

        // Handle missing description by providing a default value
        if (!data.description) {
          data.description = 'No description provided'; // Default value for missing descriptions
        }
        results.push(data);
      })
      .on('end', async () => {
        try {
          // Process each record to check for duplicate email and update status if necessary
          for (const record of results) {
            const existingRecord = await Scholarship.findOne({ email: record.email });

            if (existingRecord) {
              // If the status has changed, update the status
              if (existingRecord.status !== record.status) {
                existingRecord.status = record.status;
                await existingRecord.save();
              }
            } else {
              // Insert a new record if email doesn't exist
              await Scholarship.create(record);
            }
          }

          // Respond with success
          res.status(200).json({ message: 'Data processed successfully' });

          // Clean up the file after processing (optional)
          if (fs.existsSync(uploadedFiles[0].path)) {
            fs.unlinkSync(uploadedFiles[0].path);
          }
        } catch (error) {
          console.error('Database error:', error);
          res.status(500).json({ error: 'Error inserting/updating data in database', details: error.message });
        }
      });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'An error occurred during file processing' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disable body parsing for file uploads
  },
};
