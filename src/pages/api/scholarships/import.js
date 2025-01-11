// pages/api/scholarships/import.js
import nextConnect from 'next-connect';
import multer from 'multer';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import Scholarship from '../../models/Scholarship';
import connectDB from '../../utils/connectDB';

// Setup multer to store uploaded files temporarily in the 'uploads' directory
const upload = multer({ dest: 'uploads/' });

const handler = nextConnect();

// Middleware to handle the file upload
handler.use(upload.single('file')); // 'file' is the name attribute from the form

handler.post(async (req, res) => {
  if (req.method === 'POST') {
    try {
      // Check if the file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Get the uploaded file path
      const filePath = path.join(process.cwd(), 'uploads', req.file.filename);

      // Read the file content
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Parse the CSV file
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            // Connect to the database
            await connectDB();

            // Get the parsed CSV data
            const scholarships = results.data;

            // Bulk insert the scholarships data into MongoDB
            await Scholarship.insertMany(scholarships);

            // Respond with success
            res.status(200).json({ message: 'Scholarships imported successfully' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error while inserting data into the database' });
          } finally {
            // Clean up the uploaded file from the server
            fs.unlinkSync(filePath); // Delete the temporary file after processing
          }
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
});

export default handler;
