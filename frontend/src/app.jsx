import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container } from '@mui/material';
import Navbar from './Components/Navbar';
import HomePage from './Pages/HomePage';
import IndoorAnalysisPage from './Pages/IndoorAnalysisPage';
import OutdoorAnalysisPage from './Pages/OutdoorAnalysisPage';
import PersonalAnalysisPage from './Pages/PersonalAnalysisPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6bb6ff',
      light: '#e3f2fd',
      dark: '#1976d2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#b3c6e6',
      contrastText: '#222',
    },
    background: {
      default: '#f6fbff',
      paper: '#fafdff',
    },
    text: {
      primary: '#23395d',
      secondary: '#5c7fa3',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#23395d',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#23395d',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#fafdff',
          boxShadow: '0 4px 24px 0 rgba(107,182,255,0.08)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/indoor" element={<IndoorAnalysisPage />} />
              <Route path="/outdoor" element={<OutdoorAnalysisPage />} />
              <Route path="/personal" element={<PersonalAnalysisPage />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
