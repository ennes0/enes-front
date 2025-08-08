import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
  Divider,
  Avatar,
  Badge,
  Tooltip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  Fab,
  Slide,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListItemIcon,
  Checkbox,
  FormControlLabel,
  Switch,
  Paper,
  Collapse,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  Movie as MovieIcon,
  Delete as DeleteIcon,
  Clear as ClearAllIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  DragIndicator as DragIndicatorIcon,
  DateRange as DateRangeIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import favoriteLocationsService from '../services/favoriteLocationsService';

const FavoritesPanel = ({ open, onClose, onLocationSelect, allLocations, onFavoritesChange }) => {
  const [favorites, setFavorites] = useState([]);
  const [groupedFavorites, setGroupedFavorites] = useState({});
  const [compactView, setCompactView] = useState(false);
  
  // Advanced Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, alphabetical, country, movie
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  
  // Drag & Drop States
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [customOrder, setCustomOrder] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      loadFavorites();
    }
  }, [open]);

  // Advanced filtering and sorting effect
  useEffect(() => {
    applyFiltersAndSort();
  }, [favorites, searchQuery, sortBy, sortOrder, selectedCountries, selectedMovies, dateRange, customOrder]);

  const loadFavorites = () => {
    const favs = favoriteLocationsService.getFavoriteLocations();
    setFavorites(favs);
    
    // Initialize custom order if not exists
    const savedOrder = localStorage.getItem('geofilm-favorites-order');
    if (savedOrder) {
      setCustomOrder(JSON.parse(savedOrder));
    } else {
      setCustomOrder(favs.map(fav => fav.locationKey));
    }
    
    // Group by country
    const grouped = favs.reduce((acc, fav) => {
      const country = fav.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(fav);
      return acc;
    }, {});
    
    setGroupedFavorites(grouped);
  };

  // Advanced Search and Filter Logic
  const applyFiltersAndSort = () => {
    let filtered = [...favorites];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fav => 
        fav.name.toLowerCase().includes(query) ||
        fav.movieTitle.toLowerCase().includes(query) ||
        fav.city.toLowerCase().includes(query) ||
        fav.country.toLowerCase().includes(query) ||
        (fav.scene && fav.scene.toLowerCase().includes(query))
      );
    }

    // Country filter
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(fav => selectedCountries.includes(fav.country));
    }

    // Movie filter
    if (selectedMovies.length > 0) {
      filtered = filtered.filter(fav => selectedMovies.includes(fav.movieTitle));
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(fav => {
        const favDate = new Date(fav.addedAt);
        const start = dateRange.start ? new Date(dateRange.start) : new Date('1900-01-01');
        const end = dateRange.end ? new Date(dateRange.end) : new Date();
        return favDate >= start && favDate <= end;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'dateAdded':
          comparison = new Date(a.addedAt) - new Date(b.addedAt);
          break;
        case 'alphabetical':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'country':
          comparison = a.country.localeCompare(b.country);
          break;
        case 'movie':
          comparison = a.movieTitle.localeCompare(b.movieTitle);
          break;
        case 'custom':
          const aIndex = customOrder.indexOf(a.locationKey);
          const bIndex = customOrder.indexOf(b.locationKey);
          comparison = aIndex - bIndex;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredFavorites(filtered);

    // Update grouped favorites with filtered data
    const grouped = filtered.reduce((acc, fav) => {
      const country = fav.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(fav);
      return acc;
    }, {});
    
    setGroupedFavorites(grouped);
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, favorite) => {
    setIsDragging(true);
    setDraggedItem(favorite);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetFavorite) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.locationKey === targetFavorite.locationKey) {
      setIsDragging(false);
      setDraggedItem(null);
      return;
    }

    const newOrder = [...customOrder];
    const draggedIndex = newOrder.indexOf(draggedItem.locationKey);
    const targetIndex = newOrder.indexOf(targetFavorite.locationKey);

    // Remove dragged item and insert at target position
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem.locationKey);

    setCustomOrder(newOrder);
    localStorage.setItem('geofilm-favorites-order', JSON.stringify(newOrder));
    
    // Switch to custom sort
    setSortBy('custom');
    
    setIsDragging(false);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  // Filter helpers
  const getUniqueCountries = () => {
    return [...new Set(favorites.map(fav => fav.country))].sort();
  };

  const getUniqueMovies = () => {
    return [...new Set(favorites.map(fav => fav.movieTitle))].sort();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCountries([]);
    setSelectedMovies([]);
    setDateRange({ start: null, end: null });
    setSortBy('dateAdded');
    setSortOrder('desc');
  };

  const handleRemoveFromFavorites = (favorite) => {
    favoriteLocationsService.removeFromFavorites(favorite);
    loadFavorites(); // Refresh the list
    if (onFavoritesChange) {
      onFavoritesChange();
    }
  };

  const handleLocationClick = (favorite) => {
    // Find the full location data from allLocations
    const fullLocation = allLocations.find(loc => 
      loc.movieId === favorite.movieId && 
      loc.lat === favorite.lat && 
      loc.lng === favorite.lng
    );
    
    if (fullLocation) {
      onLocationSelect(fullLocation);
      onClose();
    } else {
      // Create a basic location object if not found
      const basicLocation = {
        ...favorite,
        id: favorite.locationKey,
      };
      onLocationSelect(basicLocation);
      onClose();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Tüm favorileri silmek istediğinizden emin misiniz?')) {
      favoriteLocationsService.clearAllFavorites();
      loadFavorites();
      
      // Notify parent to update count
      if (onFavoritesChange) {
        onFavoritesChange();
      }
    }
  };

  const handleExportFavorites = () => {
    const data = favoriteLocationsService.exportFavorites();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geofilm-favorites-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFavorites = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const success = favoriteLocationsService.importFavorites(e.target.result);
        if (success) {
          loadFavorites();
          alert('Favoriler başarıyla içe aktarıldı!');
          
          // Notify parent to update count
          if (onFavoritesChange) {
            onFavoritesChange();
          }
        } else {
          alert('Favoriler içe aktarılırken hata oluştu!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Mobile Quick Access Fab */}
      {isMobile && !open && favorites.length > 0 && (
        <Fab
          size="medium"
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 16,
            background: 'rgba(255, 107, 107, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            zIndex: 1300,
            '&:hover': {
              background: 'rgba(255, 107, 107, 1)',
              transform: 'scale(1.1)',
            },
            transition: 'all 0.3s ease',
          }}
          onClick={() => onClose()} // This will trigger opening since onClose handles toggle
        >
          <Badge badgeContent={favorites.length} color="error">
            <FavoriteIcon />
          </Badge>
        </Fab>
      )}

      {/* Main Drawer */}
      {isMobile ? (
        <SwipeableDrawer
          anchor="right"
          open={open}
          onClose={onClose}
          onOpen={() => {}} // Required for SwipeableDrawer
          disableSwipeToOpen={false}
          PaperProps={{
            sx: {
              width: '100%',
              background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(30, 30, 30, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              color: 'white',
            },
          }}
          SlideProps={{
            direction: 'left'
          }}
        >
          {renderContent()}
        </SwipeableDrawer>
      ) : (
        <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 400 },
              background: 'rgba(10, 10, 10, 0.95)',
              backdropFilter: 'blur(20px)',
              color: 'white',
              borderLeft: '1px solid rgba(255, 107, 107, 0.3)',
            },
          }}
        >
          {renderContent()}
        </Drawer>
      )}
    </>
  );

  function renderContent() {
    return (
      <Box sx={{ 
        p: isMobile ? 2 : 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Mobile Header with Swipe Indicator */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mb: 1,
            mt: -1,
          }}>
            <Box sx={{
              width: 40,
              height: 4,
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 2,
            }} />
          </Box>
        )}
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 2,
          flexShrink: 0,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FavoriteIcon color="error" />
            <Typography 
              variant={isMobile ? "h6" : "h6"} 
              sx={{ 
                fontWeight: 'bold',
                fontSize: isMobile ? '1.1rem' : '1.25rem',
              }}
            >
              {isMobile ? "Favoriler" : "Favori Lokasyonlar"}
            </Typography>
            <Chip
              label={favorites.length}
              size="small"
              sx={{
                background: 'rgba(255, 107, 107, 0.2)',
                color: '#ff6b6b',
                border: '1px solid rgba(255, 107, 107, 0.3)',
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Compact View Toggle for Mobile */}
            {isMobile && (
              <Tooltip title={compactView ? "Detaylı Görünüm" : "Kompakt Görünüm"}>
                <IconButton 
                  size="small"
                  onClick={() => setCompactView(!compactView)}
                  sx={{ color: 'white' }}
                >
                  {compactView ? "📋" : "📱"}
                </IconButton>
              </Tooltip>
            )}
            
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          mb: 2, 
          flexWrap: 'wrap',
          flexShrink: 0,
        }}>
          <Tooltip title="Favorileri Dışa Aktar">
            <Button
              size={isMobile ? "small" : "small"}
              variant="outlined"
              startIcon={!isSmallMobile && <DownloadIcon />}
              onClick={handleExportFavorites}
              disabled={favorites.length === 0}
              sx={{ 
                borderColor: 'rgba(76, 205, 196, 0.3)',
                color: '#4ecdc4',
                '&:hover': { borderColor: '#4ecdc4' },
                minWidth: isMobile ? 'auto' : undefined,
                px: isSmallMobile ? 1.5 : undefined,
              }}
            >
              {isSmallMobile ? "📤" : "Dışa Aktar"}
            </Button>
          </Tooltip>

          <Tooltip title="Favorileri İçe Aktar">
            <Button
              size={isMobile ? "small" : "small"}
              variant="outlined"
              component="label"
              startIcon={!isSmallMobile && <UploadIcon />}
              sx={{ 
                borderColor: 'rgba(255, 193, 7, 0.3)',
                color: '#ffc107',
                '&:hover': { borderColor: '#ffc107' },
                minWidth: isMobile ? 'auto' : undefined,
                px: isSmallMobile ? 1.5 : undefined,
              }}
            >
              {isSmallMobile ? "📥" : "İçe Aktar"}
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleImportFavorites}
              />
            </Button>
          </Tooltip>

          <Tooltip title="Tüm Favorileri Temizle">
            <Button
              size={isMobile ? "small" : "small"}
              variant="outlined"
              startIcon={!isSmallMobile && <ClearAllIcon />}
              onClick={handleClearAll}
              disabled={favorites.length === 0}
              sx={{ 
                borderColor: 'rgba(255, 107, 107, 0.3)',
                color: '#ff6b6b',
                '&:hover': { borderColor: '#ff6b6b' },
                minWidth: isMobile ? 'auto' : undefined,
                px: isSmallMobile ? 1.5 : undefined,
              }}
            >
              {isSmallMobile ? "🗑️" : "Temizle"}
            </Button>
          </Tooltip>
        </Box>

        {/* Advanced Search & Filter Section */}
        <Box sx={{ mb: 2, flexShrink: 0 }}>
          {/* Search Bar */}
          <TextField
            fullWidth
            size="small"
            placeholder="Favori ara... (lokasyon, film, şehir, ülke)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,107,107,0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff6b6b',
                },
              },
              '& .MuiOutlinedInput-input': {
                color: 'white',
                fontSize: isMobile ? '0.9rem' : '1rem',
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: 'rgba(255,255,255,0.5)',
                opacity: 1,
              },
            }}
          />

          {/* Filter & Sort Controls */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Filter Button */}
            <Tooltip title="Gelişmiş Filtreler">
              <IconButton
                size="small"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                sx={{
                  color: showAdvancedFilters ? '#ff6b6b' : 'rgba(255,255,255,0.7)',
                  background: showAdvancedFilters ? 'rgba(255,107,107,0.1)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${showAdvancedFilters ? 'rgba(255,107,107,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 2,
                }}
              >
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Sort Dropdown */}
            <FormControl size="small" sx={{ minWidth: isMobile ? 80 : 120 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
                sx={{
                  color: 'white',
                  fontSize: isMobile ? '0.8rem' : '0.875rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,255,255,0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255,107,107,0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ff6b6b',
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                  background: 'rgba(255,255,255,0.05)',
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: 'rgba(20,20,20,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,107,107,0.3)',
                      color: 'white',
                    },
                  },
                }}
              >
                <MenuItem value="dateAdded">📅 Tarih</MenuItem>
                <MenuItem value="alphabetical">🔤 A-Z</MenuItem>
                <MenuItem value="country">🌍 Ülke</MenuItem>
                <MenuItem value="movie">🎬 Film</MenuItem>
                <MenuItem value="custom">🎯 Özel</MenuItem>
              </Select>
            </FormControl>

            {/* Sort Order */}
            <Tooltip title={sortOrder === 'asc' ? 'Artan → Azalan' : 'Azalan → Artan'}>
              <IconButton
                size="small"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                }}
              >
                <SortIcon 
                  fontSize="small" 
                  sx={{ 
                    transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }} 
                />
              </IconButton>
            </Tooltip>

            {/* Filter Count Badge */}
            {(selectedCountries.length > 0 || selectedMovies.length > 0 || dateRange.start || dateRange.end) && (
              <Chip
                size="small"
                label={`${selectedCountries.length + selectedMovies.length + (dateRange.start ? 1 : 0) + (dateRange.end ? 1 : 0)} filtre`}
                onDelete={resetFilters}
                sx={{
                  background: 'rgba(255,107,107,0.2)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(255,107,107,0.3)',
                  fontSize: '0.7rem',
                }}
              />
            )}

            {/* Results Count */}
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', ml: 'auto' }}>
              {filteredFavorites.length}/{favorites.length} sonuç
            </Typography>
          </Box>

          {/* Advanced Filters Panel */}
          <Collapse in={showAdvancedFilters}>
            <Paper
              sx={{
                mt: 1,
                p: 2,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: 'white', mb: 1.5, fontWeight: 'bold' }}>
                🎯 Gelişmiş Filtreler
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Country Filter */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5, display: 'block' }}>
                    🌍 Ülkeler
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {getUniqueCountries().map(country => (
                      <Chip
                        key={country}
                        label={country}
                        size="small"
                        clickable
                        onClick={() => {
                          setSelectedCountries(prev => 
                            prev.includes(country) 
                              ? prev.filter(c => c !== country)
                              : [...prev, country]
                          );
                        }}
                        sx={{
                          background: selectedCountries.includes(country) 
                            ? 'rgba(76,205,196,0.3)' 
                            : 'rgba(255,255,255,0.05)',
                          color: selectedCountries.includes(country) ? '#4ecdc4' : 'rgba(255,255,255,0.7)',
                          border: `1px solid ${selectedCountries.includes(country) ? 'rgba(76,205,196,0.5)' : 'rgba(255,255,255,0.1)'}`,
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Movie Filter */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5, display: 'block' }}>
                    🎬 Filmler
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxHeight: 100, overflow: 'auto' }}>
                    {getUniqueMovies().slice(0, 20).map(movie => (
                      <Chip
                        key={movie}
                        label={movie}
                        size="small"
                        clickable
                        onClick={() => {
                          setSelectedMovies(prev => 
                            prev.includes(movie) 
                              ? prev.filter(m => m !== movie)
                              : [...prev, movie]
                          );
                        }}
                        sx={{
                          background: selectedMovies.includes(movie) 
                            ? 'rgba(255,193,7,0.3)' 
                            : 'rgba(255,255,255,0.05)',
                          color: selectedMovies.includes(movie) ? '#ffc107' : 'rgba(255,255,255,0.7)',
                          border: `1px solid ${selectedMovies.includes(movie) ? 'rgba(255,193,7,0.5)' : 'rgba(255,255,255,0.1)'}`,
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Reset Button */}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={resetFilters}
                  startIcon={<ClearAllIcon />}
                  sx={{
                    alignSelf: 'flex-start',
                    borderColor: 'rgba(255,107,107,0.3)',
                    color: '#ff6b6b',
                    '&:hover': { borderColor: '#ff6b6b' },
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </Box>
            </Paper>
          </Collapse>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2, flexShrink: 0 }} />

        {/* Favorites List - Scrollable Area */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {favorites.length === 0 ? (
            <Alert 
              severity="info" 
              sx={{ 
                background: 'rgba(76, 205, 196, 0.1)',
                color: '#4ecdc4',
                border: '1px solid rgba(76, 205, 196, 0.3)',
              }}
            >
              <Typography variant="body2">
                Henüz favori lokasyon eklenmemiş. 
                <br />
                Haritadaki lokasyonlarda ❤️ butonuna tıklayarak favorilerinize ekleyebilirsiniz!
              </Typography>
            </Alert>
          ) : (
            <Box>
              {/* Statistics - Collapsible on Mobile */}
              <Box sx={{ 
                mb: 2, 
                p: isMobile ? 1.5 : 2, 
                background: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: 2,
                display: compactView && isMobile ? 'none' : 'block',
              }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  📊 İstatistikler
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: isMobile ? 1 : 2, 
                  flexWrap: 'wrap',
                  justifyContent: isMobile ? 'space-between' : 'flex-start',
                }}>
                  <Chip
                    icon={<LocationOnIcon />}
                    label={`${filteredFavorites.length} Lokasyon`}
                    size="small"
                    sx={{ 
                      background: 'rgba(76, 205, 196, 0.2)', 
                      color: '#4ecdc4',
                      fontSize: isMobile ? '0.75rem' : '0.8125rem',
                    }}
                  />
                  <Chip
                    icon={<MovieIcon />}
                    label={`${new Set(filteredFavorites.map(f => f.movieId)).size} Film`}
                    size="small"
                    sx={{ 
                      background: 'rgba(255, 193, 7, 0.2)', 
                      color: '#ffc107',
                      fontSize: isMobile ? '0.75rem' : '0.8125rem',
                    }}
                  />
                  <Chip
                    label={`${Object.keys(groupedFavorites).length} Ülke`}
                    size="small"
                    sx={{ 
                      background: 'rgba(255, 107, 107, 0.2)', 
                      color: '#ff6b6b',
                      fontSize: isMobile ? '0.75rem' : '0.8125rem',
                    }}
                  />
                  {sortBy === 'custom' && (
                    <Chip
                      icon={<DragIndicatorIcon />}
                      label="Sürükle"
                      size="small"
                      sx={{ 
                        background: 'rgba(156, 39, 176, 0.2)', 
                        color: '#9c27b0',
                        fontSize: isMobile ? '0.75rem' : '0.8125rem',
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Grouped Favorites by Country */}
              {Object.entries(groupedFavorites).map(([country, countryFavorites]) => (
                <Accordion
                  key={country}
                  defaultExpanded={isMobile ? false : true}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    mb: 1,
                    '&:before': { display: 'none' },
                    borderRadius: '8px !important',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      minHeight: isMobile ? 48 : 56,
                      '&.Mui-expanded': {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        minHeight: isMobile ? 48 : 56,
                      },
                      '& .MuiAccordionSummary-content': {
                        margin: isMobile ? '8px 0' : '12px 0',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Typography 
                        variant={isMobile ? "body2" : "subtitle2"} 
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: isMobile ? '0.9rem' : undefined,
                        }}
                      >
                        🌍 {country}
                      </Typography>
                      <Chip
                        label={countryFavorites.length}
                        size="small"
                        sx={{
                          background: 'rgba(76, 205, 196, 0.2)',
                          color: '#4ecdc4',
                          ml: 'auto',
                          fontSize: isMobile ? '0.7rem' : undefined,
                          height: isMobile ? 20 : 24,
                        }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List disablePadding>
                      {countryFavorites.map((favorite, index) => (
                        <ListItem
                          key={favorite.locationKey}
                          button
                          draggable={sortBy === 'custom'}
                          onDragStart={(e) => handleDragStart(e, favorite)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, favorite)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleLocationClick(favorite)}
                          sx={{
                            borderTop: index === 0 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                            '&:hover': {
                              background: 'rgba(255, 107, 107, 0.1)',
                            },
                            py: isMobile ? (compactView ? 1 : 1.5) : 2,
                            px: isMobile ? 1.5 : 2,
                            cursor: sortBy === 'custom' ? 'grab' : 'pointer',
                            opacity: draggedItem?.locationKey === favorite.locationKey ? 0.5 : 1,
                            transform: draggedItem?.locationKey === favorite.locationKey ? 'scale(0.95)' : 'scale(1)',
                            transition: 'all 0.2s ease',
                            '&:active': {
                              cursor: sortBy === 'custom' ? 'grabbing' : 'pointer',
                            },
                          }}
                        >
                          {renderFavoriteItem(favorite, compactView && isMobile)}
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  function renderFavoriteItem(favorite, compact = false) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: compact ? 1.5 : 2, width: '100%' }}>
        {/* Drag Handle - Only show in custom sort mode */}
        {sortBy === 'custom' && !compact && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'grab',
              color: 'rgba(255,255,255,0.3)',
              '&:hover': { color: 'rgba(255,255,255,0.6)' },
              '&:active': { cursor: 'grabbing' },
              pt: 0.5,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <DragIndicatorIcon fontSize="small" />
          </Box>
        )}

        <Avatar
          sx={{ 
            width: compact ? 32 : 40, 
            height: compact ? 32 : 40, 
            background: 'rgba(255, 107, 107, 0.2)',
            border: '2px solid rgba(255, 107, 107, 0.3)',
          }}
        >
          <LocationOnIcon sx={{ 
            color: '#ff6b6b',
            fontSize: compact ? '1rem' : '1.2rem',
          }} />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant={compact ? "body2" : "subtitle2"} 
            sx={{ 
              fontWeight: 'bold', 
              mb: compact ? 0.25 : 0.5,
              fontSize: compact ? '0.85rem' : undefined,
            }}
          >
            📍 {favorite.name}
          </Typography>
          
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              display: 'block',
              fontSize: compact ? '0.7rem' : undefined,
            }}
          >
            📍 {favorite.city}, {favorite.country}
          </Typography>
          
          <Typography 
            variant="caption" 
            color="primary.main" 
            sx={{ 
              display: 'block', 
              mb: compact ? 0.25 : 0.5,
              fontSize: compact ? '0.7rem' : undefined,
            }}
          >
            🎬 {favorite.movieTitle} ({favorite.movieYear})
          </Typography>
          
          {favorite.scene && !compact && (
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: compact ? '0.65rem' : undefined,
            }}>
              🎭 {favorite.scene}
            </Typography>
          )}

          {!compact && (
            <Typography variant="caption" color="text.secondary" sx={{ 
              display: 'block',
              mt: 0.5,
              opacity: 0.7,
              fontSize: '0.65rem',
            }}>
              💾 {new Date(favorite.addedAt).toLocaleDateString('tr-TR')} tarihinde eklendi
            </Typography>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFromFavorites(favorite);
          }}
          sx={{ 
            color: '#ff6b6b',
            '&:hover': {
              background: 'rgba(255, 107, 107, 0.1)',
            },
            width: compact ? 32 : 40,
            height: compact ? 32 : 40,
          }}
        >
          <DeleteIcon fontSize={compact ? "small" : "small"} />
        </IconButton>
      </Box>
    );
  }
};

export default FavoritesPanel;
