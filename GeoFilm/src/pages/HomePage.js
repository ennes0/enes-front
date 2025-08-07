import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  InputAdornment,
  Fade,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MovieCard from '../components/MovieCard';
import { moviesData } from '../data/moviesData';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    setMovies(moviesData);
    setFilteredMovies(moviesData);
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredMovies(movies);
    } else {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        movie.locations.some(location => 
          location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.country.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredMovies(filtered);
    }
  }, [searchTerm, movies]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Fade in timeout={1000}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            Film Dünyasını Keşfedin
          </Typography>
        </Fade>
        
        <Fade in timeout={1500}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Sevdiğiniz filmlerin çekildiği gerçek lokasyonları keşfedin ve harita üzerinde görüntüleyin
          </Typography>
        </Fade>

        <Fade in timeout={2000}>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Film, yönetmen veya lokasyon ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: 'transparent',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.light',
                  },
                },
              }}
            />
          </Paper>
        </Fade>
      </Box>

      {/* Movies Grid */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Popüler Filmler
          {searchTerm && (
            <Typography component="span" variant="h6" color="text.secondary" sx={{ ml: 2 }}>
              ({filteredMovies.length} sonuç)
            </Typography>
          )}
        </Typography>

        <Grid container spacing={3}>
          {filteredMovies.map((movie, index) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Fade in timeout={500 + index * 100}>
                <div>
                  <MovieCard movie={movie} />
                </div>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {filteredMovies.length === 0 && searchTerm && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Aradığınız kriterlere uygun film bulunamadı.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Farklı anahtar kelimeler deneyin.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Stats Section */}
      <Fade in timeout={2500}>
        <Paper elevation={0} sx={{ p: 4, mt: 6, backgroundColor: 'background.paper', borderRadius: 2 }}>
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {moviesData.length}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Film
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                {moviesData.reduce((total, movie) => total + movie.locations.length, 0)}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Çekim Lokasyonu
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {new Set(moviesData.flatMap(movie => movie.locations.map(loc => loc.country))).size}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Ülke
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
    </Container>
  );
};

export default HomePage;
