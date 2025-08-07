import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MovieIcon from '@mui/icons-material/Movie';
import { Link } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import { moviesData, getAllLocations } from '../data/moviesData';

const LocationExplorerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);

  useEffect(() => {
    const locations = getAllLocations();
    setAllLocations(locations);
    setFilteredLocations(locations);
  }, []);

  useEffect(() => {
    let filtered = allLocations;

    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.scene.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(location => location.country === selectedCountry);
    }

    if (selectedCity) {
      filtered = filtered.filter(location => location.city === selectedCity);
    }

    setFilteredLocations(filtered);
  }, [searchTerm, selectedCountry, selectedCity, allLocations]);

  // Get unique countries and cities
  const countries = [...new Set(allLocations.map(loc => loc.country))].sort();
  const cities = [...new Set(
    allLocations
      .filter(loc => !selectedCountry || loc.country === selectedCountry)
      .map(loc => loc.city)
  )].sort();

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedCity('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4,
        }}
      >
        Lokasyon Keşfi
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
        Filmlerin çekildiği gerçek lokasyonları keşfedin ve harita üzerinde görüntüleyin
      </Typography>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'background.paper' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Lokasyon, film veya sahne ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Ülke</InputLabel>
              <Select
                value={selectedCountry}
                label="Ülke"
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity(''); // Reset city when country changes
                }}
              >
                <MenuItem value="">Tüm Ülkeler</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Şehir</InputLabel>
              <Select
                value={selectedCity}
                label="Şehir"
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedCountry}
              >
                <MenuItem value="">Tüm Şehirler</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              fullWidth
              onClick={clearFilters}
              sx={{ height: '56px' }}
            >
              Temizle
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Sonuçlar ({filteredLocations.length} lokasyon)
        </Typography>
        {(searchTerm || selectedCountry || selectedCity) && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {searchTerm && (
              <Chip
                label={`Arama: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                color="primary"
                variant="outlined"
              />
            )}
            {selectedCountry && (
              <Chip
                label={`Ülke: ${selectedCountry}`}
                onDelete={() => setSelectedCountry('')}
                color="secondary"
                variant="outlined"
              />
            )}
            {selectedCity && (
              <Chip
                label={`Şehir: ${selectedCity}`}
                onDelete={() => setSelectedCity('')}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Map */}
        <Grid item xs={12} lg={7}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Harita Görünümü
          </Typography>
          <MapComponent 
            locations={filteredLocations} 
            zoom={2}
          />
        </Grid>

        {/* Locations List */}
        <Grid item xs={12} lg={5}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Lokasyon Listesi
          </Typography>
          
          <Box sx={{ maxHeight: '500px', overflowY: 'auto', pr: 1 }}>
            {filteredLocations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Kriterlere uygun lokasyon bulunamadı.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {filteredLocations.map((location) => (
                  <Grid item xs={12} key={`${location.movieId}-${location.id}`}>
                    <Card 
                      sx={{ 
                        backgroundColor: 'background.paper',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          boxShadow: '0 4px 20px rgba(255, 107, 107, 0.2)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {location.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: 'secondary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {location.city}, {location.country}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <MovieIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                          <Typography 
                            variant="body2" 
                            component={Link}
                            to={`/film/${location.movieId}`}
                            sx={{ 
                              color: 'primary.main',
                              textDecoration: 'none',
                              fontWeight: 'bold',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            {location.movieTitle}
                          </Typography>
                        </Box>

                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            color: 'secondary.main',
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
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LocationExplorerPage;
