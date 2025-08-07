import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Rating,
  Fade,
  Grid,
  Avatar,
  Divider,
  useMediaQuery,
  Paper,
  Button,
  Tooltip,
  Stack,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MovieIcon from '@mui/icons-material/Movie';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PublicIcon from '@mui/icons-material/Public';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import ImageIcon from '@mui/icons-material/Image';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import motion from '../utils/motion';

// Yardımcı fonksiyonlar
const formatCurrency = (amount) => {
  if (!amount || amount === 0) return 'Bilinmiyor';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatProfit = (revenue, budget) => {
  if (!revenue || !budget || revenue === 0 || budget === 0) return null;
  const profit = revenue - budget;
  const profitPercentage = ((profit / budget) * 100).toFixed(1);
  return {
    amount: profit,
    percentage: profitPercentage,
    isProfit: profit > 0
  };
};

const LocationCard = ({ location, movies, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [slideDirection, setSlideDirection] = useState("right");
  const [cardPosition, setCardPosition] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  
  // Mevcut film
  const movie = movies && movies.length > 0 ? movies[currentMovieIndex] : null;
  const hasMultipleMovies = movies && movies.length > 1;
  
  // Accordion states - İlk kart (sahne bilgileri) açık başlasın
  const [expandedPanels, setExpandedPanels] = useState({
    scene: true,     // Sahne bilgileri (varsayılan açık)
    movie: false,    // Film bilgileri
    director: false, // Yönetmen & Cast
    budget: false,   // Bütçe & Box Office  
    gallery: false   // Film görselleri
  });

  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpandedPanels(prev => ({
      ...prev,
      [panel]: isExpanded
    }));
  };

  // Film değiştirme fonksiyonları
  const handleNextMovie = () => {
    if (hasMultipleMovies) {
      setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
    }
  };

  const handlePrevMovie = () => {
    if (hasMultipleMovies) {
      setCurrentMovieIndex((prev) => (prev - 1 + movies.length) % movies.length);
    }
  };

  // Movie index değiştiğinde accordion'ları resetle
  useEffect(() => {
    setExpandedPanels({
      scene: true,
      movie: false,
      director: false,
      budget: false,
      gallery: false
    });
  }, [currentMovieIndex]);
  
  useEffect(() => {
    if (!location) return;
    
    console.log('🎭 LocationCard opened with data:');
    console.log('📍 Location:', {
      name: location.name,
      city: location.city,
      country: location.country,
      scene: location.scene,
      coordinates: [location.lat, location.lng]
    });
    console.log('🎬 Movie:', {
      title: movie?.title,
      year: movie?.year,
      director: movie?.director,
      directorPhoto: movie?.directorPhoto ? 'Has director photo' : 'No director photo',
      rating: movie?.rating,
      poster: movie?.poster,
      genre: movie?.genre,
      runtime: movie?.runtime,
      budget: movie?.budget,
      revenue: movie?.revenue,
      popularity: movie?.popularity,
      voteCount: movie?.voteCount,
      productionCompanies: movie?.productionCompanies,
      productionCountries: movie?.productionCountries,
      images: {
        backdrops: movie?.images?.length || 0,
        posters: 0
      }
    });
    console.log('🖼️ Image Details:');
    if (movie?.images?.length > 0) {
      console.log('  Movie Images:', movie.images.map(img => img.url));
    }
    console.log('💰 Budget & Revenue Debug:', {
      budget: movie?.budget,
      revenue: movie?.revenue,
      budgetFormatted: formatCurrency(movie?.budget),
      revenueFormatted: formatCurrency(movie?.revenue),
      shouldShowBudgetSection: (movie?.budget > 0 || movie?.revenue > 0)
    });
    console.log('🔍 Full Props:', { location, movie, open });
    console.log('─'.repeat(50));
    
    const fromDirection = location.lng > 0 ? "left" : "right";
    setSlideDirection(fromDirection);
    
    // Perfect positioning to center the card properly
    const basePosition = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
    };
    
    if (isMobile) {
      setCardPosition({
        ...basePosition,
        width: 'calc(100vw - 20px)',
        height: 'calc(100vh - 40px)',
        maxWidth: '450px',
        maxHeight: 'calc(100vh - 40px)',
        minWidth: '320px',
        minHeight: '500px',
      });
    } else {
      setCardPosition({
        ...basePosition,
        width: 'calc(100vw - 60px)',
        height: 'calc(100vh - 80px)',
        maxWidth: '1200px',
        maxHeight: 'calc(100vh - 80px)',
        minWidth: '800px',
        minHeight: '600px',
      });
    }
  }, [location, isMobile]);
  
  // Don't render if missing data
  if (!location || !movie) {
    return null;
  }

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      {/* Enhanced Backdrop */}
      <Fade in={open} timeout={400}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: open ? 9998 : -1,
            pointerEvents: open ? 'auto' : 'none',
            background: 'radial-gradient(circle at center, rgba(255, 107, 107, 0.15), rgba(0, 0, 0, 0.90))',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={onClose}
        />
      </Fade>

      {/* Enhanced Modal Card */}
      <Fade in={open} timeout={500}>
        <Card
          sx={{
            ...cardPosition,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '420px 1fr',
            gridTemplateRows: isMobile ? '320px 1fr' : '1fr',
            background: `
              linear-gradient(135deg, 
                rgba(20, 20, 25, 0.98) 0%, 
                rgba(15, 15, 20, 0.95) 50%, 
                rgba(25, 25, 30, 0.98) 100%
              )
            `,
            backdropFilter: 'blur(20px)',
            border: `2px solid ${alpha('#ff6b6b', 0.3)}`,
            borderRadius: '20px',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.7),
              0 0 30px rgba(255, 107, 107, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            overflow: 'hidden',
            transform: open ? 'scale(1) translate(-50%, -50%)' : 'scale(0.9) translate(-50%, -50%)',
            transformOrigin: 'center center',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.8), transparent)',
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Panel - Movie Poster & Info */}
          <Box sx={{ 
            position: 'relative', 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: isMobile ? '320px' : '100%',
            height: '100%',
            overflow: 'hidden',
          }}>
            {/* Loading Progress */}
            {!imageLoaded && (
              <LinearProgress 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  zIndex: 1,
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  }
                }} 
              />
            )}

            <CardMedia
              component="img"
              image={movie?.poster || 'https://via.placeholder.com/400x600?text=No+Poster'}
              alt={movie?.title || 'Film posteri'}
              onLoad={handleImageLoad}
              sx={{
                height: isMobile ? '320px' : '100%',
                width: '100%',
                objectFit: 'cover',
                filter: imageLoaded ? 'brightness(0.7) contrast(1.1)' : 'brightness(0.3)',
                transition: 'all 0.6s ease',
                position: 'relative',
              }}
            />
            
            {/* Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  linear-gradient(
                    45deg,
                    rgba(255, 107, 107, 0.2) 0%,
                    transparent 30%,
                    transparent 70%,
                    rgba(78, 205, 196, 0.2) 100%
                  ),
                  linear-gradient(
                    to bottom,
                    rgba(0, 0, 0, 0.1) 0%,
                    rgba(0, 0, 0, 0.3) 50%,
                    rgba(0, 0, 0, 0.8) 100%
                  )
                `,
              }}
            />

            {/* Movie Info Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 3,
                color: 'white',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
              }}
            >
              {/* Film Navigation Header - Sadece birden fazla film varsa */}
              {hasMultipleMovies && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 1,
                  px: 1,
                }}>
                  <IconButton
                    onClick={handlePrevMovie}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: '#4ecdc4',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: 'rgba(78, 205, 196, 0.2)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ArrowBackIosIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 0.5,
                    alignItems: 'center'
                  }}>
                    {movies.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: index === currentMovieIndex ? '#4ecdc4' : 'rgba(255,255,255,0.3)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: index === currentMovieIndex ? '#4ecdc4' : 'rgba(255,255,255,0.6)',
                          }
                        }}
                        onClick={() => setCurrentMovieIndex(index)}
                      />
                    ))}
                  </Box>
                  
                  <IconButton
                    onClick={handleNextMovie}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      color: '#4ecdc4',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: 'rgba(78, 205, 196, 0.2)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              )}

              {/* Film Counter - Birden fazla film varsa */}
              {hasMultipleMovies && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  mb: 1
                }}>
                  <Chip
                    label={`${currentMovieIndex + 1} / ${movies.length} Film`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(78, 205, 196, 0.2)',
                      color: '#4ecdc4',
                      fontWeight: 'bold',
                      border: '1px solid rgba(78, 205, 196, 0.4)',
                    }}
                  />
                </Box>
              )}

              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                mb: 1,
                fontSize: isMobile ? '1.3rem' : '1.8rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                background: 'linear-gradient(45deg, #fff, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
                textAlign: 'center',
              }}>
                {movie?.title || 'Film Bilgisi Yükleniyor...'}
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
                  label={movie?.year || 'N/A'}
                  size="small"
                  sx={{ 
                    background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />
                
                <Chip
                  icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
                  label={`${movie?.runtime || '120'} min`}
                  size="small"
                  sx={{ 
                    background: 'linear-gradient(45deg, #4ecdc4, #6ee7e7)',
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />

                <Chip
                  icon={<LanguageIcon sx={{ fontSize: 14 }} />}
                  label={movie?.language || 'English'}
                  size="small"
                  sx={{ 
                    background: 'linear-gradient(45deg, #a855f7, #c084fc)',
                    color: 'white',
                    fontWeight: 'bold',
                    '& .MuiChip-icon': { color: 'white' },
                  }}
                />
              </Stack>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating 
                    value={(movie?.rating || 0) / 2} 
                    precision={0.1} 
                    size="small" 
                    readOnly 
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#ffd700',
                        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
                      }
                    }}
                  />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#ffd700',
                    textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
                  }}>
                    {movie?.rating || 0}/10
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
            }}>
              <Tooltip title="Beğen">
                <IconButton
                  onClick={() => setLiked(!liked)}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: liked ? '#ff6b6b' : 'white',
                    width: 42,
                    height: 42,
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 107, 0.8)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <FavoriteIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Paylaş">
                <IconButton
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    width: 42,
                    height: 42,
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(78, 205, 196, 0.8)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ShareIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Kapat">
                <IconButton
                  onClick={onClose}
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    width: 42,
                    height: 42,
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.8)',
                      transform: 'scale(1.1) rotate(90deg)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Right Panel - Details */}
          <CardContent sx={{ 
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'rgba(255, 255, 255, 0.05)' },
            '&::-webkit-scrollbar-thumb': { 
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              borderRadius: '3px' 
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'linear-gradient(45deg, #ff8e8e, #6ee7e7)',
            },
          }}>
            {/* Header Section */}
            <Box sx={{ p: 3, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: movie.directorPhoto ? 'transparent' : 'transparent',
                  background: movie.directorPhoto ? 'none' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                  mr: 2,
                  width: 48,
                  height: 48,
                }}>
                  {movie.directorPhoto ? (
                    <img 
                      src={movie.directorPhoto} 
                      alt={movie.director}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                      onLoad={() => console.log('✅ Director photo loaded:', movie.directorPhoto)}
                      onError={(e) => {
                        console.log('❌ Director photo failed to load:', movie.directorPhoto);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <PersonIcon sx={{ 
                      fontSize: 24
                    }} />
                  )}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                    Yönetmen
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4ecdc4', fontWeight: 600 }}>
                    {movie.director}
                  </Typography>
                  {movie.directorPhoto && (
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      📸 TMDb API
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Enhanced Genres */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                  Türler
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {movie.genre && movie.genre.slice(0, 6).map((genre, index) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      sx={{
                        background: `linear-gradient(45deg, ${
                          index % 3 === 0 ? '#ff6b6b, #ff8e8e' :
                          index % 3 === 1 ? '#4ecdc4, #6ee7e7' :
                          '#a855f7, #c084fc'
                        })`,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        height: 28,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Budget and Revenue Section */}
            <Box sx={{ px: 3, py: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <AttachMoneyIcon sx={{ mr: 1, color: '#4ecdc4' }} />
                💰 Box Office Bilgileri
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ 
                    p: 2, 
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05))',
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    borderRadius: 2,
                  }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      Bütçe
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                      {formatCurrency(movie?.budget)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ 
                    p: 2, 
                    background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(78, 205, 196, 0.05))',
                    border: '1px solid rgba(78, 205, 196, 0.3)',
                    borderRadius: 2,
                  }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      Hasılat
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                      {formatCurrency(movie?.revenue)}
                    </Typography>
                  </Paper>
                </Grid>
                {movie?.budget > 0 && movie?.revenue > 0 && formatProfit(movie.revenue, movie.budget) && (
                  <Grid item xs={12}>
                    <Paper sx={{ 
                      p: 2, 
                      background: `linear-gradient(135deg, rgba(${formatProfit(movie.revenue, movie.budget).isProfit ? '76, 175, 80' : '244, 67, 54'}, 0.1), rgba(${formatProfit(movie.revenue, movie.budget).isProfit ? '76, 175, 80' : '244, 67, 54'}, 0.05))`,
                      border: `1px solid rgba(${formatProfit(movie.revenue, movie.budget).isProfit ? '76, 175, 80' : '244, 67, 54'}, 0.3)`,
                      borderRadius: 2,
                    }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                        {formatProfit(movie.revenue, movie.budget).isProfit ? 'Net Kar' : 'Net Zarar'}
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        color: formatProfit(movie.revenue, movie.budget).isProfit ? '#4caf50' : '#f44336', 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        {formatProfit(movie.revenue, movie.budget).isProfit ? '📈' : '📉'}
                        {formatCurrency(formatProfit(movie.revenue, movie.budget).amount)}
                        <Chip 
                          label={`%${formatProfit(movie.revenue, movie.budget).percentage}`}
                          size="small"
                          sx={{ 
                            bgcolor: formatProfit(movie.revenue, movie.budget).isProfit ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                            color: formatProfit(movie.revenue, movie.budget).isProfit ? '#4caf50' : '#f44336',
                            fontWeight: 'bold'
                          }}
                        />
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {/* Popularity and Vote Count */}
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ 
                    p: 2, 
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))',
                    border: '1px solid rgba(156, 39, 176, 0.3)',
                    borderRadius: 2,
                  }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      Popülerlik Skoru
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                      {movie?.popularity ? Math.round(movie.popularity) : 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ 
                    p: 2, 
                    background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05))',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    borderRadius: 2,
                  }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      Toplam Oy
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                      {movie?.voteCount?.toLocaleString() || 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Technical Info Section */}
            <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ mr: 1, color: '#ff9800' }} />
                📊 Teknik Bilgiler
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      Süre
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                      {movie?.runtime || 'N/A'} dk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      Yıl
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                      {movie?.year || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      Dil
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                      {movie?.language || 'English'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
                      IMDB
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#ffeb3b', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      {movie?.rating || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                {movie?.productionCountries?.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Yapım Ülkeleri
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                        {movie.productionCountries.map((country, index) => (
                          <Chip
                            key={index}
                            label={country}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(103, 58, 183, 0.2)',
                              color: '#673ab7',
                              fontWeight: 'bold',
                              border: '1px solid rgba(103, 58, 183, 0.3)'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                )}
                {movie?.productionCompanies?.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
                        Yapım Şirketleri
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                        {movie.productionCompanies.slice(0, 3).map((company, index) => (
                          <Chip
                            key={index}
                            label={company}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255, 87, 34, 0.2)',
                              color: '#ff5722',
                              fontWeight: 'bold',
                              border: '1px solid rgba(255, 87, 34, 0.3)'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Divider sx={{ 
              background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.5), transparent)',
              height: 2,
            }} />

            {/* Movie Description */}
            <Box sx={{ p: 3, py: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                📖 Hikaye
              </Typography>
              <Typography variant="body2" sx={{ 
                lineHeight: 1.6, 
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.95rem',
                textAlign: 'justify',
              }}>
                {movie.description}
              </Typography>
            </Box>

            <Divider sx={{ 
              background: 'linear-gradient(90deg, transparent, rgba(78, 205, 196, 0.5), transparent)',
              height: 2,
            }} />

            {/* Location Section - Enhanced */}
            <Box sx={{ p: 3, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  background: 'linear-gradient(45deg, #4ecdc4, #6ee7e7)',
                  mr: 2,
                  width: 48,
                  height: 48,
                  boxShadow: '0 0 20px rgba(78, 205, 196, 0.4)',
                }}>
                  <LocationOnIcon sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 'bold', 
                    color: '#4ecdc4',
                    textShadow: '0 0 10px rgba(78, 205, 196, 0.3)',
                  }}>
                    {location.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    📍 {location.city}, {location.country}
                  </Typography>
                </Box>
              </Box>

              {/* Scene Details - Premium Look */}
              <Paper sx={{ 
                background: `
                  linear-gradient(135deg, 
                    rgba(78, 205, 196, 0.15) 0%,
                    rgba(78, 205, 196, 0.05) 50%,
                    rgba(255, 107, 107, 0.05) 100%
                  )
                `,
                p: 3, 
                borderRadius: 3,
                border: '1px solid rgba(78, 205, 196, 0.3)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #4ecdc4, #6ee7e7, #4ecdc4)',
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CameraAltIcon sx={{ mr: 1, color: '#4ecdc4', fontSize: 20 }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    color: '#4ecdc4',
                    fontSize: '1.1rem',
                  }}>
                    🎬 Çekim Sahnesi
                  </Typography>
                </Box>
                
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2, 
                  color: 'white',
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  '&::before': { content: '"' },
                  '&::after': { content: '"' },
                }}>
                  {location.scene}
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  lineHeight: 1.6, 
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.95rem',
                  textAlign: 'justify',
                }}>
                  {location.description}
                </Typography>

                {/* Location Stats */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                        {movie.year}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Çekim Yılı
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={6}>
                    <Box sx={{ textAlign: 'center', p: 1 }}>
                      <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                        {location.coordinates ? `${location.coordinates[0].toFixed(3)}, ${location.coordinates[1].toFixed(3)}` : 'N/A'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        Koordinatlar
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            {/* Film Images Gallery */}
            {movie.images && (movie.images.backdrops?.length > 0 || movie.images.posters?.length > 0) && (
              <Box sx={{ p: 3, pt: 0 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2, 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  🎭 Film Görselleri
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    TMDb API
                  </Typography>
                </Typography>

                {/* Backdrop Images */}
                {movie.images.backdrops?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: '#4ecdc4', mb: 1 }}>
                      Sahne Görselleri
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      overflowX: 'auto',
                      pb: 1,
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.1)' },
                      '&::-webkit-scrollbar-thumb': { 
                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                        borderRadius: 3
                      }
                    }}>
                      {movie.images.backdrops.slice(0, 6).map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            minWidth: 120,
                            height: 68,
                            borderRadius: 2,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        >
                          <img
                            src={image.url}
                            alt={`${movie.title} sahne ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Poster Images */}
                {movie.images.posters?.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: '#4ecdc4', mb: 1 }}>
                      Posterler
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      overflowX: 'auto',
                      pb: 1,
                      '&::-webkit-scrollbar': { height: 6 },
                      '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.1)' },
                      '&::-webkit-scrollbar-thumb': { 
                        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                        borderRadius: 3
                      }
                    }}>
                      {movie.images.posters.slice(0, 4).map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            minWidth: 60,
                            height: 90,
                            borderRadius: 2,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': { transform: 'scale(1.05)' }
                          }}
                        >
                          <img
                            src={image.url}
                            alt={`${movie.title} poster ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Director and Movie Images Section */}
            <Box sx={{ p: 3, borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.2)}` }}>
              {/* Director Section */}
              {movie?.directorPhoto && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, color: '#ff6b6b' }} />
                    🎭 Yönetmen
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={movie.directorPhoto} 
                      alt={movie.director}
                      sx={{ 
                        width: 80, 
                        height: 80,
                        border: `3px solid ${alpha('#ff6b6b', 0.6)}`,
                        boxShadow: '0 0 20px rgba(255, 107, 107, 0.4)'
                      }}
                    />
                    <Box sx={{ ml: 3 }}>
                      <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                        {movie.director}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Yönetmen
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Movie Images Gallery */}
              {movie?.images?.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <ImageIcon sx={{ mr: 1, color: '#4ecdc4' }} /> 
                    🎬 Film Görselleri ({movie.images.length})
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 2,
                      maxHeight: '400px',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: 8,
                        backgroundColor: alpha(theme.palette.background.paper, 0.1),
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.3),
                        borderRadius: 4,
                      },
                    }}
                  >
                    {movie.images.slice(0, 5).map((image, index) => (
                      <Paper
                        key={index}
                        elevation={4}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: `2px solid transparent`,
                          '&:hover': {
                            transform: 'translateY(-8px) scale(1.02)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                            border: `2px solid ${alpha('#4ecdc4', 0.8)}`,
                          }
                        }}
                      >
                        <img
                          src={image.url}
                          alt={`${movie.title} - Scene ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                            p: 1,
                          }}
                        >
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                            Sahne {index + 1}
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Enhanced Footer */}
            <Box sx={{ 
              p: 3,
              background: `
                linear-gradient(135deg, 
                  rgba(255, 107, 107, 0.1) 0%,
                  rgba(78, 205, 196, 0.1) 100%
                )
              `,
              borderTop: '1px solid rgba(255, 107, 107, 0.2)',
              textAlign: 'center',
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                🎬 GeoFilm Experience
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.85rem',
                mt: 0.5,
              }}>
                Sinema dünyasının büyülü mekanlarını keşfedin
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </>
  );
};

export default LocationCard;
