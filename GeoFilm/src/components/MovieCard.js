import React, { useState, useRef } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
  IconButton,
  Fade,
  Slide,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

const MovieCard = ({ movie }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowDetails(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTimeout(() => setShowDetails(false), 300);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality
  };

  return (
    <Card
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'linear-gradient(145deg, rgba(20, 20, 25, 0.9), rgba(15, 15, 20, 0.95))',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 107, 107, 0.2)',
        borderRadius: '20px',
        boxShadow: isHovered 
          ? '0 25px 50px rgba(255, 107, 107, 0.4), 0 0 30px rgba(78, 205, 196, 0.2)' 
          : '0 8px 32px rgba(0, 0, 0, 0.3)',
        transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isHovered 
            ? 'linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(78, 205, 196, 0.1))' 
            : 'transparent',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 1,
          pointerEvents: 'none',
        },
        '&:hover .movie-poster': {
          transform: 'scale(1.1)',
          filter: 'brightness(1.1) contrast(1.1)',
        },
        '&:hover .movie-title': {
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }
      }}
    >
      {/* Poster Image with Overlay */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="320"
          image={movie.poster}
          alt={movie.title}
          className="movie-poster"
          sx={{
            objectFit: 'cover',
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            filter: 'brightness(0.9)',
          }}
        />
        
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
            zIndex: 2,
          }}
        />

        {/* Action Buttons */}
        <Fade in={isHovered} timeout={300}>
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 1,
              zIndex: 3,
            }}
          >
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                color: isFavorite ? '#ff6b6b' : 'white',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 107, 0.8)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {isFavorite ? <FavoriteIcon sx={{ fontSize: 18 }} /> : <FavoriteBorderIcon sx={{ fontSize: 18 }} />}
            </IconButton>
            
            <IconButton
              onClick={handleShareClick}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: 'rgba(78, 205, 196, 0.8)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <ShareIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Fade>

        {/* Rating Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '4px 8px',
            borderRadius: '12px',
            zIndex: 3,
          }}
        >
          <StarIcon sx={{ color: '#ffd700', fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>
            {movie.rating}
          </Typography>
        </Box>

        {/* Year Badge */}
        <Chip
          icon={<CalendarTodayIcon sx={{ fontSize: 12 }} />}
          label={movie.year}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: 'rgba(78, 205, 196, 0.9)',
            color: 'white',
            fontWeight: 'bold',
            zIndex: 3,
          }}
        />
      </Box>
      
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 2.5, 
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Movie Title */}
        <Typography 
          variant="h5" 
          component="h2" 
          className="movie-title"
          sx={{ 
            fontWeight: 'bold', 
            mb: 1.5,
            color: 'white',
            fontSize: '1.3rem',
            lineHeight: 1.2,
            transition: 'all 0.3s ease',
          }}
        >
          {movie.title}
        </Typography>

        {/* Director Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'secondary.main' }}>
            <PersonIcon sx={{ fontSize: 14 }} />
          </Avatar>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '500' }}>
            {movie.director}
          </Typography>
        </Box>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating 
            value={movie.rating / 2} 
            precision={0.1} 
            size="small" 
            readOnly 
            sx={{
              '& .MuiRating-iconFilled': {
                color: '#ffd700',
              },
              '& .MuiRating-iconEmpty': {
                color: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          />
          <Typography variant="body2" sx={{ 
            ml: 1, 
            color: '#ffd700', 
            fontWeight: 'bold',
            fontSize: '0.9rem' 
          }}>
            {movie.rating}/10
          </Typography>
        </Box>

        {/* Description */}
        <Slide in={showDetails} direction="up" timeout={400}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              lineHeight: 1.5,
              color: 'rgba(255, 255, 255, 0.7)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.85rem'
            }}
          >
            {movie.description}
          </Typography>
        </Slide>

        {/* Genres */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {movie.genre.slice(0, 3).map((genre, index) => (
            <Chip
              key={genre}
              label={genre}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: index % 2 === 0 ? '#ff6b6b' : '#4ecdc4',
                color: index % 2 === 0 ? '#ff6b6b' : '#4ecdc4',
                fontSize: '0.7rem',
                height: 24,
                fontWeight: '500',
                backgroundColor: index % 2 === 0 
                  ? 'rgba(255, 107, 107, 0.1)' 
                  : 'rgba(78, 205, 196, 0.1)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: index % 2 === 0 
                    ? 'rgba(255, 107, 107, 0.2)' 
                    : 'rgba(78, 205, 196, 0.2)',
                  transform: 'scale(1.05)',
                },
              }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 1.5, backgroundColor: 'rgba(255, 107, 107, 0.3)' }} />

        {/* Location Info */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          p: 1.5,
          background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.15), rgba(78, 205, 196, 0.05))',
          borderRadius: '12px',
          border: '1px solid rgba(78, 205, 196, 0.3)',
        }}>
          <LocationOnIcon sx={{ 
            fontSize: 20, 
            mr: 1, 
            color: '#4ecdc4',
            filter: 'drop-shadow(0 0 4px rgba(78, 205, 196, 0.5))'
          }} />
          <Typography variant="body2" sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            {movie.locations?.length || 0} çekim lokasyonu
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          component={Link}
          to={`/film/${movie.id}`}
          variant="contained"
          fullWidth
          startIcon={<PlayArrowIcon />}
          sx={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            border: 'none',
            borderRadius: '12px',
            py: 1.2,
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              background: 'linear-gradient(45deg, #ff5252, #26a69a)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 30px rgba(255, 107, 107, 0.6)',
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }}
        >
          <MovieIcon sx={{ mr: 1, fontSize: 18 }} />
          Haritada Keşfet
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
