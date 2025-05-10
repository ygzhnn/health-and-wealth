import { useState } from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  CircularProgress,
  Alert,
  Stack
} from '@mui/material'
import { styled } from '@mui/material/styles'

const Input = styled('input')({
  display: 'none',
})

const Label = styled('label')({
  display: 'block',
  marginBottom: '1rem',
})

function App() {
  const [file, setFile] = useState(null)
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setResponse(null)
      setError(null)
    }
  }

  const handleUpload = async (endpoint) => {
    if (!file) {
      setError("Lütfen bir dosya seçin")
      return
    }
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/analyze/${endpoint}/`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        throw new Error('Sunucu hatası')
      }
      const data = await res.json()
      setResponse(data)
    } catch (err) {
      setError(err.message || "Sunucu hatası veya bağlantı yok.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Görsel Analiz Arayüzü
        </Typography>

        <Box sx={{ my: 3 }}>
          <Label htmlFor="file-input">
            <Button
              variant="contained"
              component="span"
              fullWidth
            >
              Görsel Seç
            </Button>
          </Label>
          <Input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Seçilen dosya: {file.name}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpload("office")}
            disabled={!file || loading}
            fullWidth
          >
            Ofis Analizi
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleUpload("personal")}
            disabled={!file || loading}
            fullWidth
          >
            İç Mekan
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleUpload("outdoor")}
            disabled={!file || loading}
            fullWidth
          >
            Dış Mekan
          </Button>
        </Stack>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {response && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Analiz Sonucu:
            </Typography>
            <pre style={{ 
              margin: 0, 
              background: "#f5f5f5", 
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto"
            }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </Paper>
        )}
      </Paper>
    </Container>
  )
}

export default App
