import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Chip,
  Rating,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MapComponent from '../components/MapComponent';
import { getMovieById } from '../data/moviesData';

const FilmDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id);

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Film bulunamadı
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Ana Sayfaya Dön
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Geri Dön
      </Button>

      <Grid container spacing={4}>
        {/* Film Info */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 0, backgroundColor: 'transparent' }}>
            <Box
              component="img"
              src={movie.poster}
              alt={movie.title}
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                mb: 3,
              }}
            />
            
            <Card sx={{ backgroundColor: 'background.paper' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {movie.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={movie.rating / 2} precision={0.1} readOnly />
                  <Typography variant="body1" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {movie.rating}/10
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {movie.year}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {movie.director}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Türler
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {movie.genre.map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {movie.description}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Map and Locations */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
            Çekim Lokasyonları
          </Typography>

          <MapComponent 
            locations={movie.locations} 
            zoom={4}
          />

          {/* Locations List */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Lokasyon Detayları ({movie.locations.length})
            </Typography>
            
            <Grid container spacing={2}>
              {movie.locations.map((location) => (
                <Grid item xs={12} sm={6} key={location.id}>
                  <Card 
                    sx={{ 
                      backgroundColor: 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.2)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {location.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: 'secondary.main' }} />
                        <Typography variant="body2" color="text.secondary">
                          {location.city}, {location.country}
                        </Typography>
                      </Box>

                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: 'primary.main',
                          mb: 1,
                        }}
                      >
                        Sahne: {location.scene}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {location.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FilmDetailPage;
