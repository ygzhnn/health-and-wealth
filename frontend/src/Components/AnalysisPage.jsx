import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AnalysisResults from './AnalysisResults';

function AnalysisPage({ title, description, onAnalyze, isPersonalAnalysis = false, isChildSafetyAnalysis = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview and store in localStorage for reference image generation
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Store image in localStorage for reference image generation
      const reader = new FileReader();
      reader.onload = (e) => {
        localStorage.setItem('lastUploadedImage', e.target.result);
      };
      reader.readAsDataURL(file);
      
      setError(null);
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const result = await onAnalyze(formData);
      setResults(result);
    } catch (err) {
      setError('An error occurred during analysis: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {description}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Select Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>

            {preview && (
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 300,
                  objectFit: 'contain',
                }}
              />
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Start Analysis'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {results && <AnalysisResults results={results} isPersonalAnalysis={isPersonalAnalysis} isChildSafetyAnalysis={isChildSafetyAnalysis} />}
    </Box>
  );
}

export default AnalysisPage; 