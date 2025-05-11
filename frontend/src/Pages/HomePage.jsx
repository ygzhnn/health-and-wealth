import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import BusinessIcon from '@mui/icons-material/Business';
import ParkIcon from '@mui/icons-material/Park';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';

function HomePage() {
  const analysisOptions = [
    {
      title: 'İç Alan Analizi',
      description: 'Kapalı ortamlarda ruhsal etkileri değerlendirin.',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      path: '/indoor',
    },
    {
      title: 'Dış Alan Analizi',
      description: 'Açık alanların duygu durumuna etkisini analiz edin.',
      icon: <ParkIcon sx={{ fontSize: 40 }} />,
      path: '/outdoor',
    },
    {
      title: 'Kişisel Analiz',
      description: 'Kişisel alanınızın ruh halinize etkisini ölçün.',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
      path: '/personal',
    },
    {
      title: 'Çocuk Güvenliği Analizi',
      description: 'Odanızın çocuklar için güvenliğini değerlendirin.',
      icon: <ChildCareIcon sx={{ fontSize: 40 }} />,
      path: '/child-safety',
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h1" component="h1" gutterBottom align="center">
        Çevresel Ruh Hali Analizi Platformu
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary" sx={{ mb: 6 }}>
        Hangi Analizi Başlatmak İstersiniz?
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {analysisOptions.map((option) => (
          <Grid item xs={12} sm={6} md={4} key={option.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{option.icon}</Box>
                <Typography gutterBottom variant="h5" component="h3">
                  {option.title}
                </Typography>
                <Typography color="text.secondary">
                  {option.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to={option.path}
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Analizi Başlat
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🌳 Çevresel Etki Takibi
            </Typography>
            <Typography color="text.secondary">
              Konum tabanlı analizlerle ruh halinize etkileri ölçün.
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              😊 Yüz İfadesi Uyumu
            </Typography>
            <Typography color="text.secondary">
              Yüz ifadelerinize göre içerik önerileri alın.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default HomePage; 