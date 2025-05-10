import { Box, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import BusinessIcon from '@mui/icons-material/Business';
import ParkIcon from '@mui/icons-material/Park';
import PersonIcon from '@mui/icons-material/Person';

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
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h1" component="h1" gutterBottom align="center">
        Çevresel Ruh Hali Analizi Platformu
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        align="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Hangi Analizi Başlatmak İstersiniz?
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          flexWrap: 'nowrap',
          overflowX: 'auto',
        }}
      >
        {analysisOptions.map((option) => (
          <Card
            key={option.title}
            sx={{
              width: 300,
              display: 'flex',
              flexDirection: 'column',
              flexShrink: 0,
            }}
          >
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
        ))}
      </Box>
      {/* Açıklama kutusu */}
      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
        <Card
          sx={{
            maxWidth: 700,
            width: '100%',
            p: 2,
            boxShadow: 6,
            borderRadius: 4,
            position: 'relative',
            overflow: 'visible',
            background: 'linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)',
          }}
        >
          {/* Renkli üst çubuk */}
          <Box sx={{
            position: 'absolute',
            top: -16,
            left: 32,
            right: 32,
            height: 8,
            borderRadius: 8,
            background: 'linear-gradient(90deg, #2196f3 0%, #f50057 100%)',
            zIndex: 1,
          }} />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <InfoIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>
                Uygulama Fonksiyonları
              </Typography>
            </Box>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <BusinessIcon sx={{ color: '#2196f3', mr: 1 }} />
                <span>
                  <strong>İç Alan Analizi:</strong> Yüklediğiniz kapalı alan (ofis, oda vb.) fotoğrafındaki ortamın ruh halinize etkisini analiz eder.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <ParkIcon sx={{ color: '#43a047', mr: 1 }} />
                <span>
                  <strong>Dış Alan Analizi:</strong> Açık alan ve doğa fotoğraflarının psikolojik etkilerini değerlendirir.
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ color: '#f50057', mr: 1 }} />
                <span>
                  <strong>Kişisel Analiz:</strong> Kişisel yaşam alanınızın ruh halinize etkisini ölçer.
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default HomePage;
 