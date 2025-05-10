import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ENV_KEYS = [
  'natural_light',
  'clutter',
  'ergonomics',
  'plants',
  'color_scheme',
  'personalization',
  'noise_potential',
  'air_quality',
];

function renderScoreBar(label, value, max = 100, color = 'primary') {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{label}</Typography>
      <LinearProgress
        variant="determinate"
        value={Math.max(0, Math.min((value / max) * 100, 100))}
        color={color}
        sx={{ height: 12, borderRadius: 6, background: '#e3f2fd' }}
      />
      <Typography variant="caption" sx={{ ml: 1 }}>{value}</Typography>
    </Box>
  );
}

function renderEnvRadarChart(env) {
  if (!env) return null;
  const data = ENV_KEYS.filter(key => env[key] !== undefined).map(key => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: env[key],
  }));
  if (data.length === 0) return null;
  return (
    <Box sx={{ width: '100%', height: 350, mb: 3 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e3f2fd" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 13 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar name="Skor" dataKey="value" stroke="#6bb6ff" fill="#6bb6ff" fillOpacity={0.5} />
          <Tooltip formatter={(v) => `${v}%`} />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
}

function beautifyKey(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function renderResult(result) {
  if (!result) return null;
  // Chart verileri (ENV_KEYS) her analizde gösterilsin
  const chartData = ENV_KEYS.filter(key => result[key] !== undefined).map(key => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: result[key],
    rawKey: key,
  }));
  // Tabloya sadece chartta olmayan anahtarlar gelsin
  const tableEntries = Object.entries(result).filter(([key]) => !ENV_KEYS.includes(key));

  return (
    <Box>
      {renderEnvRadarChart(result)}
      {tableEntries.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableBody>
              {tableEntries.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 700, fontSize: 18 }}>{beautifyKey(key)}</TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: 18 }}>{String(value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {result.wellbeing_score !== undefined && renderScoreBar('Wellbeing Skoru', result.wellbeing_score)}
    </Box>
  );
}

function AnalysisPage({ title, description, onAnalyze }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Lütfen bir görsel seçin');
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
      setError('Analiz sırasında bir hata oluştu: ' + err.message);
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
              Görsel Seç
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
              {loading ? <CircularProgress size={24} /> : 'Analizi Başlat'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Analiz Sonuçları
            </Typography>
            {renderResult(results)}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default AnalysisPage; 