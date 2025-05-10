import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import ParkIcon from '@mui/icons-material/Park';
import PersonIcon from '@mui/icons-material/Person';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <HomeIcon /> Urban Aura
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/indoor"
            color="inherit"
            startIcon={<BusinessIcon />}
          >
            İç Alan
          </Button>
          <Button
            component={RouterLink}
            to="/outdoor"
            color="inherit"
            startIcon={<ParkIcon />}
          >
            Dış Alan
          </Button>
          <Button
            component={RouterLink}
            to="/personal"
            color="inherit"
            startIcon={<PersonIcon />}
          >
            Kişisel
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 