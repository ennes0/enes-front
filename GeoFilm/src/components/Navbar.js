import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import MapIcon from '@mui/icons-material/Map';
import HomeIcon from '@mui/icons-material/Home';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Ana Sayfa', path: '/', icon: <HomeIcon /> },
    { label: 'Lokasyonlar', path: '/locations', icon: <MapIcon /> },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(10px)' }}>
      <Container maxWidth="lg">
        <Toolbar>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <MovieIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'white',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GeoFilm
            </Typography>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'white',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
