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
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'text/csv' && selectedFile.type !== 'application/vnd.ms-excel') {
        setStatus('Invalid file type. Please upload a CSV file.');
        setOpen(true);
        return;
      }
      // Validate file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setStatus('File size exceeds the 10MB limit.');
        setOpen(true);
        return;
      }
      setFile(selectedFile);
      setStatus('');
    }
  };

  // Handle file upload
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
      setIsUploading(true); // Disable upload button during the upload process
      const response = await axios.post('/api/scholarships/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      setStatus(response.data.message || 'File uploaded successfully!');
      setOpen(true);
    } catch (error) {
      console.log('File upload error:', error.response); 
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'Error uploading file.';
      setStatus(errorMessage);
      setOpen(true);
    } finally {
      setProgress(0);
      setIsUploading(false);
      setFile(null); // Reset the file input after upload
    }
  };

  // Handle Snackbar close
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
            inputProps={{ 'aria-label': 'Upload CSV file' }}
          />
          <Button
            variant="contained"
            startIcon={<CloudUpload />}
            onClick={handleUpload}
            disabled={!file || isUploading}
            sx={{
              backgroundColor: isUploading ? '#b0bec5' : '#1976d2',
              '&:hover': {
                backgroundColor: !isUploading ? '#115293' : undefined,
              },
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
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        )}
        <Snackbar open={open} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={status.includes('Failed') ? 'details' : 'success' || status.includes('Error') ? 'error' : 'success' || status.includes('path') ? 'details' : 'success'}
            sx={{ width: '100%' }}
          >
            {status}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default UploadCSV;
