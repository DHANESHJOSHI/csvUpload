import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  Box, 
  Button, 
  Typography, 
  Input, 
  Container, 
  Paper, 
  LinearProgress, 
  Snackbar, 
  Alert 
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState([]);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && selectedFile.type !== 'application/vnd.ms-excel') {
        setStatus('Invalid file type. Please upload a CSV file.');
        setOpen(true);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setStatus('File size exceeds the 10MB limit.');
        setOpen(true);
        return;
      }
      setFile(selectedFile);
      setStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file to upload.');
      setOpen(true);
      return;
    }

    const token = Cookies.get('authToken');
    const formData = new FormData();
    formData.append('files', file);

    try {
      setIsUploading(true);
      const response = await axios.post('/api/scholarships/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      setStatus('File uploaded successfully!');
      setErrors([]); // Clear errors on success
      setOpen(true);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error uploading file.';
      const errorDetails = error.response?.data?.data || [];
      setStatus(errorMessage);
      setErrors(Array.isArray(errorDetails) ? errorDetails : []);
      setOpen(true);
    } finally {
      setProgress(0);
      setIsUploading(false);
      setFile(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
          Upload CSV for Scholarships
        </Typography>
        <Box
          sx={{
            border: '2px dashed #1976d2',
            borderRadius: 2,
            p: 3,
            mb: 3,
            backgroundColor: '#f8f9fa',
          }}
        >
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            sx={{ mb: 2 }}
            fullWidth
            aria-label="File input"
          />
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUpload}
            disabled={!file || isUploading}
            sx={{
              backgroundColor: isUploading ? '#b0bec5' : '#1976d2',
              '&:hover': { backgroundColor: !isUploading ? '#115293' : undefined },
              px: 4,
              py: 1.5,
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload CSV'}
          </Button>
        </Box>
        {progress > 0 && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 2 }}
          />
        )}
      </Paper>
      {errors.length > 0 && (
        <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Validation Errors:
          </Typography>
          <Box sx={{ textAlign: 'left' }}>
          {errors.length > 0 && (
  <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
    <Typography variant="h6" color="error" gutterBottom>
      Validation Errors:
    </Typography>
    <Box sx={{ textAlign: 'left' }}>
      {errors.map((err, index) => (
        <Box key={index} sx={{ mt: 1, p: 2, bgcolor: '#fff3f3', borderRadius: 1 }}>
          <Typography color="error" fontWeight="bold">
            Row {err['S.No'] || 'N/A'}:
          </Typography>
          {/* Displaying all fields */}
          {Object.entries(err).map(([key, value], idx) => (
            <Typography key={idx}>
              <span className="font-medium">{key}:</span> {value || 'N/A'}
            </Typography>
          ))}
        </Box>
      ))}
    </Box>
  </Paper>
)}

          </Box>
        </Paper>
      )}
      <Snackbar open={open} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={status.includes('Error') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {status}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UploadCSV;
