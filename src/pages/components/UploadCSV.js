// components/UploadCSV.js
import { useState } from 'react';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/scholarships/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setStatus(result.message || 'File uploaded successfully');
    } catch (error) {
      setStatus('Error uploading file');
      console.error(error);
    }
  };

  return (
    <div>
      <h3>Upload CSV for Scholarships</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default UploadCSV;
