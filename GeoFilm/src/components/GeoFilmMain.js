import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import gsap from 'gsap';
import {
  Box,
  Typography,
  Fade,
  CircularProgress,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Autocomplete,
  Paper,
  Button,
  IconButton,
  Badge,
} from '@mui/material';
import enhancedMovieService from '../services/enhancedMovieService';
import favoriteLocationsService from '../services/favoriteLocationsService';
import LocationCard from './LocationCard';
import WaterFillingLoader from './WaterFillingLoader';
import FavoritesPanel from './FavoritesPanel';

// 🔍 MOVIE SEARCH COMPONENT
function MovieSearchBox({ allLocations, onMovieSelect, onClearSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMovies = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('🔍 Starting TMDb search for:', query);
      console.log('🏠 Available movie IDs in allLocations:', [...new Set(allLocations.map(loc => loc.movieId))].sort((a,b) => a-b));
      
      const tmdbSearchResults = await enhancedMovieService.searchMovies(query);
      console.log('🎬 TMDb search returned:', tmdbSearchResults.length, 'results');
      console.log('🎬 TMDb search results:', tmdbSearchResults.map(m => ({ id: m.id, title: m.title, year: m.year })));
      
      const matchedMovies = [];
      
      tmdbSearchResults.forEach(tmdbMovie => {
        const movieLocations = allLocations.filter(location => 
          location.movieId === tmdbMovie.id
        );
        
        console.log(`🔍 Checking TMDb movie: ${tmdbMovie.title} (ID: ${tmdbMovie.id}) - Found ${movieLocations.length} locations`);
        
        if (movieLocations.length > 0) {
          console.log(`✅ Adding ${tmdbMovie.title} to search results with ${movieLocations.length} locations`);
          matchedMovies.push({
            id: tmdbMovie.id,
            title: tmdbMovie.title,
            year: tmdbMovie.year,
            locations: movieLocations,
            tmdbData: {
              title: tmdbMovie.title,
              year: tmdbMovie.year,
              poster: tmdbMovie.poster_path 
                ? `https://image.tmdb.org/t/p/w200${tmdbMovie.poster_path}`
                : null,
              rating: tmdbMovie.vote_average || 0,
              overview: tmdbMovie.overview || '',
              director: 'TMDb\'den yükleniyor...', // Yönetmen bilgisi için ayrı çağrı gerekir
              genres: tmdbMovie.genre_ids || []
            }
          });
        }
      });
      
      // Eğer TMDb'den sonuç yoksa yerel aramaya geri dön
      if (matchedMovies.length === 0) {
        console.log('🔍 No TMDb matches found, falling back to local search');
        
        // Tüm lokasyonlardan film verilerini çıkar ve benzersiz filmler oluştur
        const uniqueMovies = {};
        
        allLocations.forEach(location => {
          const movieKey = location.movieId;
          if (!uniqueMovies[movieKey]) {
            const basicInfo = enhancedMovieService.getBasicMovieInfo(location.movieId);
            uniqueMovies[movieKey] = {
              id: location.movieId,
              title: basicInfo.title,
              year: basicInfo.year,
              locations: [location]
            };
          } else {
            uniqueMovies[movieKey].locations.push(location);
          }
        });

        // Yerel arama query'sine göre filtrele
        const localFiltered = Object.values(uniqueMovies).filter(movie =>
          movie.title.toLowerCase().includes(query.toLowerCase()) ||
          movie.year.toString().includes(query) ||
          movie.locations.some(loc => 
            loc.city.toLowerCase().includes(query.toLowerCase()) ||
            loc.country.toLowerCase().includes(query.toLowerCase()) ||
            loc.name.toLowerCase().includes(query.toLowerCase())
          )
        ).slice(0, 8);

        // Yerel sonuçları TMDb detayları ile zenginleştir
        const enrichedLocal = await Promise.all(
          localFiltered.map(async (movie) => {
            try {
              const tmdbDetails = await enhancedMovieService.getMovieDetails(movie.id);
              return {
                ...movie,
                tmdbData: {
                  title: tmdbDetails.title,
                  year: tmdbDetails.year,
                  poster: tmdbDetails.poster,
                  rating: tmdbDetails.rating,
                  overview: tmdbDetails.overview,
                  director: tmdbDetails.director,
                  genres: tmdbDetails.genres || []
                }
              };
            } catch (error) {
              console.error(`❌ Failed to fetch TMDb data for ${movie.title}:`, error);
              return {
                ...movie,
                tmdbData: {
                  title: movie.title,
                  year: movie.year,
                  poster: null,
                  rating: 0,
                  overview: 'Film detayları yüklenemedi.',
                  director: 'Bilinmiyor',
                  genres: []
                }
              };
            }
          })
        );
        
        setSearchResults(enrichedLocal);
      } else {
        // TMDb sonuçları için detaylı bilgileri çek
        console.log('🎬 Enriching TMDb results with detailed data...');
        const enrichedTmdb = await Promise.all(
          matchedMovies.slice(0, 8).map(async (movie) => {
            try {
              const detailedInfo = await enhancedMovieService.getMovieDetails(movie.id);
              return {
                ...movie,
                tmdbData: {
                  ...movie.tmdbData,
                  director: detailedInfo.director || 'Bilinmiyor',
                  genres: detailedInfo.genres || [],
                  overview: detailedInfo.overview || movie.tmdbData.overview
                }
              };
            } catch (error) {
              console.error(`❌ Failed to enrich TMDb data for ${movie.title}:`, error);
              return movie; // Hata durumunda mevcut veriyi kullan
            }
          })
        );
        
        setSearchResults(enrichedTmdb);
      }
      
      console.log(`✅ Search completed with ${matchedMovies.length > 0 ? matchedMovies.length : 'local fallback'} results`);
      
    } catch (error) {
      console.error('❌ Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search - async function için güncellendi
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchMovies(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500); // Biraz daha uzun bekleme süresi API çağrıları için

    return () => clearTimeout(timer);
  }, [searchQuery, allLocations]);

  const handleMovieSelect = (movie, selectedLocation) => {
    console.log('🎬 Movie selected from search:', movie.title);
    console.log('📍 Selected location:', selectedLocation.name);
    
    setSearchQuery('');
    setSearchResults([]);
    onMovieSelect(selectedLocation);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    onClearSearch();
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: { xs: 100, md: 120 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        width: { xs: '90%', md: '500px' },
        maxWidth: '500px',
      }}
    >
      {/* Search Input */}
      <Paper
        elevation={8}
        sx={{
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <TextField
          fullWidth
          placeholder="Film ara... (TMDb gerçek zamanlı arama - örn: Inception, Matrix, Avatar)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'primary.main' }} />
              </InputAdornment>
            ),
            sx: {
              color: 'white',
              '& fieldset': {
                border: 'none',
              },
              '& input': {
                padding: '12px 8px',
              },
              '& input::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
            },
          }}
        />

        {/* Search Results - TMDb verileri ile zenginleştirilmiş */}
        {searchResults.length > 0 && (
          <List sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {searchResults.map((movie) => (
              <Box key={movie.id}>
                <ListItem 
                  sx={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&:hover': {
                      background: 'rgba(255, 107, 107, 0.1)',
                    },
                    py: 2
                  }}
                >
                  {/* Film başlığı ve yıl */}
                  <Box sx={{ display: 'flex', width: '100%', mb: 1, alignItems: 'flex-start', gap: 2 }}>
                    {/* Poster */}
                    {movie.tmdbData?.poster && (
                      <Avatar
                        src={movie.tmdbData.poster}
                        variant="rounded"
                        sx={{ 
                          width: 60, 
                          height: 90, 
                          flexShrink: 0,
                          border: '2px solid rgba(255, 107, 107, 0.3)'
                        }}
                      />
                    )}
                    
                    {/* Film bilgileri */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle1" 
                        color="primary.main" 
                        sx={{ fontWeight: 'bold', mb: 0.5 }}
                      >
                        🎬 {movie.tmdbData?.title || movie.title} ({movie.tmdbData?.year || movie.year})
                      </Typography>
                      
                      {/* Rating */}
                      {movie.tmdbData?.rating > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, gap: 1 }}>
                          <Typography variant="caption" color="#ffc107" sx={{ fontWeight: 'bold' }}>
                            ⭐ {movie.tmdbData.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Yönetmen */}
                      {movie.tmdbData?.director && movie.tmdbData.director !== 'Bilinmiyor' && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          🎭 Yönetmen: {movie.tmdbData.director}
                        </Typography>
                      )}
                      
                      {/* Türler */}
                      {movie.tmdbData?.genres && movie.tmdbData.genres.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {movie.tmdbData.genres.slice(0, 3).map((genre, index) => (
                            <Chip
                              key={index}
                              label={genre}
                              size="small"
                              sx={{
                                background: 'rgba(255, 193, 7, 0.2)',
                                color: '#ffc107',
                                border: '1px solid rgba(255, 193, 7, 0.3)',
                                fontSize: '0.7rem',
                                height: '24px'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      
                      {/* Kısa açıklama */}
                      {movie.tmdbData?.overview && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            display: 'block', 
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {movie.tmdbData.overview}
                        </Typography>
                      )}
                      
                      <Typography variant="caption" color="text.secondary">
                        📍 {movie.locations.length} lokasyon bulundu
                      </Typography>
                    </Box>
                  </Box>

                  {/* Location Options */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: '100%' }}>
                    {movie.locations.map((location, index) => (
                      <Chip
                        key={`${location.id}-${index}`}
                        label={`📍 ${location.city}, ${location.country}`}
                        size="small"
                        clickable
                        onClick={() => handleMovieSelect(movie, location)}
                        sx={{
                          background: 'rgba(76, 205, 196, 0.2)',
                          color: '#4ecdc4',
                          border: '1px solid rgba(76, 205, 196, 0.3)',
                          '&:hover': {
                            background: 'rgba(76, 205, 196, 0.3)',
                            transform: 'scale(1.05)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      />
                    ))}
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        )}

        {/* No Results */}
        {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
          <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="body2" color="text.secondary">
              🔍 "{searchQuery}" için sonuç bulunamadı
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Film adı, şehir veya ülke adı ile arayın
            </Typography>
          </Box>
        )}

        {/* Loading - TMDb gerçek zamanlı arama */}
        {isSearching && (
          <Box sx={{ p: 3, textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <CircularProgress size={20} sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="caption" color="text.secondary">
                TMDb veritabanında aranıyor...
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
              🔍 Gerçek zamanlı film arama ve lokasyon eşleştirme
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

// 🎬 CINEMATIC CAMERA FOR SEARCH
function CinematicSearchCamera({ targetLocation, onComplete }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (targetLocation && controlsRef.current) {
      console.log('🎬 Starting cinematic search transition to:', targetLocation.name);
      
      controlsRef.current.enabled = false;
      
      const [x, y, z] = latLngTo3D(targetLocation.lat, targetLocation.lng, 2);
      
      const targetPosition = {
        x: x * 3.5,
        y: y * 3.5 + 1,
        z: z * 3.5
      };      
      const timeline = gsap.timeline();
      
      timeline.to(camera.position, {
        duration: 3.0,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        ease: "power2.inOut",
        onUpdate: () => {
          controlsRef.current?.update();
        },
        onComplete: () => { 
          controlsRef.current.enabled = true;
          
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
        }
      });
      return () => {
        timeline.kill();
      };
    }
  }, [targetLocation, camera, onComplete]);
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
      minDistance={4}
      maxDistance={15}
      autoRotate={false}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}

// Helper function for coordinate conversion
const latLngTo3D = (lat, lng, radius = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return [x, y, z];
};


// 3D Earth Component
function Earth({ onLocationClick, cardOpen, allLocations }) {
  const meshRef = useRef();
  const [cameraDistance, setCameraDistance] = useState(8);
  const [cameraPosition, setCameraPosition] = useState(new THREE.Vector3(0, 0, 8));
  
  // Load real Earth texture from a public URL
  const earthTexture = useLoader(
    TextureLoader, 
    'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg'
  );
  
  useFrame(({ camera }) => {
    // Remove automatic rotation
    
    // Update camera distance and position for zoom-based markers
    const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
    setCameraDistance(distance);
    setCameraPosition(camera.position.clone());
  });

  // Convert lat/lng to 3D coordinates for Three.js sphere geometry
  const latLngTo3D = (lat, lng, radius = 2) => {
    // Three.js sphere geometry standard mapping
    // Convert degrees to radians and adjust for sphere UV mapping
    const phi = (90 - lat) * (Math.PI / 180);  // polar angle (0 to π)
    const theta = (lng + 180) * (Math.PI / 180); // azimuthal angle (0 to 2π)
    
    // Standard spherical to cartesian conversion for Three.js
    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return [x, y, z];
  };

  // Calculate distance between two locations on sphere
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Check if a point is on the visible hemisphere
  const isPointVisible = (lat, lng, cameraPosition) => {
    const [x, y, z] = latLngTo3D(lat, lng, 2);
    const pointVector = new THREE.Vector3(x, y, z);
    const cameraVector = cameraPosition.clone().normalize();
    const dot = pointVector.normalize().dot(cameraVector);
    return dot > -0.1; // Small threshold for edge visibility
  };

  // Get all locations from movies with zoom-based filtering
  // allLocations is now passed as a parameter from parent component

  const getVisibleLocations = (cameraPosition) => {
    // Filter only visible locations first
    const visibleLocations = allLocations.filter(location => 
      isPointVisible(location.lat, location.lng, cameraPosition)
    );

    if (cameraDistance > 12) {
      const countryGroups = {};
      const minDistance = 800; // Minimum distance in km between country markers
      
      visibleLocations.forEach(location => {
        if (!countryGroups[location.country]) {
          const tooClose = Object.values(countryGroups).some(existing => 
            calculateDistance(location.lat, location.lng, existing.lat, existing.lng) < minDistance
          );
          
          if (!tooClose) {
            countryGroups[location.country] = location;
          }
        }
      });
      return Object.values(countryGroups);
      
    } else if (cameraDistance > 8) {
      const cityGroups = {};
      const minDistance = 200; // Minimum distance in km between city markers
      
      visibleLocations.forEach(location => {
        const key = `${location.city}-${location.country}`;
        if (!cityGroups[key]) {
          const tooClose = Object.values(cityGroups).some(existing => 
            calculateDistance(location.lat, location.lng, existing.lat, existing.lng) < minDistance
          );
          
          if (!tooClose) {
            cityGroups[key] = location;
          }
        }
      });
      return Object.values(cityGroups);
      
    } else {
      // Close zoom: Show all visible markers with minimal spacing
      const result = [];
      const minDistance = 50; // Minimum distance in km between detailed markers
      
      visibleLocations.forEach(location => {
        const tooClose = result.some(existing => 
          calculateDistance(location.lat, location.lng, existing.lat, existing.lng) < minDistance
        );
        
        if (!tooClose) {
          result.push(location);
        }
      });
      return result;
    }
  };

  const visibleLocations = getVisibleLocations(cameraPosition);

  return (
    <group>
      {/* Earth Sphere with real world map texture and markers as children */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
        />
        
        {/* Location Markers - now children of Earth mesh */}
        {visibleLocations.map((location, index) => {
          const [x, y, z] = latLngTo3D(location.lat, location.lng, 2.01);
          
          // Smaller marker sizes
          const markerSize = cameraDistance > 12 ? 0.008 : cameraDistance > 8 ? 0.006 : 0.005;
          
          return (
            <group key={`${location.movieId}-${location.id}-${cameraDistance > 12 ? location.country : cameraDistance > 8 ? location.city : location.id}`}>
              {/* Pin marker - cylinder shape */}
              <mesh
                position={[x, y, z]}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Marker clicked!', location);
                  onLocationClick(location);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'auto';
                }}
              >
                <cylinderGeometry args={[markerSize * 2, markerSize, markerSize * 4, 8]} />
                <meshStandardMaterial 
                  color="#ff4757" 
                  emissive="#ff4757"
                  emissiveIntensity={0.5}
                />
              </mesh>
              
              {/* Clickable invisible sphere for better click detection */}
              <mesh
                position={[x, y, z]}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Invisible sphere clicked!', location);
                  onLocationClick(location);
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'auto';
                }}
              >
                <sphereGeometry args={[markerSize * 8, 8, 8]} />
                <meshBasicMaterial 
                  transparent={true}
                  opacity={0}
                />
              </mesh>
            </group>
          );
        })}
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh scale={[2.08, 2.08, 2.08]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#4ecdc4"
          transparent={true}
          opacity={0.1}
          side={2}
        />
      </mesh>
    </group>
  );
}

// Loading Component
function LoadingScreen() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 10, 10, 0.9)',
        zIndex: 1000,
      }}
    >
      <CircularProgress size={60} sx={{ color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
        Sihirli Sinema Dünyası
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Büyülü film dünyası hazırlanıyor
      </Typography>
    </Box>
  );
}

// Main Component
const GeoFilmMain = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔍 SEARCH STATE
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchTarget, setSearchTarget] = useState(null);

  // ❤️ FAVORITES STATE
  const [showFavoritesPanel, setShowFavoritesPanel] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Toggle search box visibility
  const toggleSearchBox = () => {
    setShowSearchBox(!showSearchBox);
    if (showSearchBox) {
      setIsSearchMode(false);
    }
  };

  // Handle movie selection from search
  const handleSearchMovieSelect = (location) => {
    console.log('🔍 Search movie selected, flying to location:', location.name);
    
    // Set cinematic target for smooth camera transition
    setSearchTarget(location);
    setIsSearchMode(true);
    setShowSearchBox(false);
    
    // Auto-trigger location click after camera movement
    setTimeout(() => {
      handleLocationClick(location);
    }, 3200); // Wait for camera animation to complete
  };

  const handleSearchComplete = () => {
    setSearchTarget(null);
    setIsSearchMode(false);
  };

  // ❤️ FAVORITES HANDLERS
  const toggleFavoritesPanel = () => {
    setShowFavoritesPanel(!showFavoritesPanel);
  };

  const updateFavoritesCount = () => {
    const count = favoriteLocationsService.getFavoritesCount();
    setFavoritesCount(count);
  };

  const handleFavoriteLocationSelect = (location) => {
    console.log('❤️ Favorite location selected, flying to location:', location.name);
    
    // Set cinematic target for smooth camera transition
    setSearchTarget(location);
    setIsSearchMode(true);
    
    // Auto-trigger location click after camera movement
    setTimeout(() => {
      handleLocationClick(location);
    }, 3200);
  };

  // TMDb verilerini yükle
  useEffect(() => {
    const loadBasicData = () => {
      try {
        setLoading(true);
        console.log('Loading basic locations data (no API calls)...');
        
        // Sadece temel lokasyon verilerini getir (API çağrısı yok)
        const locations = enhancedMovieService.getBasicLocationsData();
        setAllLocations(locations);
        
        console.log(`✅ Loaded ${locations.length} locations instantly`);
        
      } catch (err) {
        console.error('Error loading basic data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadBasicData();
    
    // Load favorites count
    updateFavoritesCount();
  }, []);

  const handleLocationClick = async (location) => {
    console.log('🎯 Location Click Event Triggered!');
    console.log('📍 Clicked Location Details:');
    console.log('  - Location Name:', location.name);
    console.log('  - City:', location.city);
    console.log('  - Country:', location.country);
    console.log('  - Coordinates:', [location.lat, location.lng]);
    console.log('  - Scene:', location.scene);
    console.log('  - Movie ID:', location.movieId);
    
    // Loading state'ini başlat
    setCardLoading(true);
    setCardOpen(true);
    
    try {
      // Aynı lokasyondaki tüm filmleri bul
      const sameLocationFilms = allLocations.filter(loc => 
        loc.name === location.name && 
        loc.city === location.city && 
        loc.country === location.country
      );
      
      console.log(`🎬 Found ${sameLocationFilms.length} films at this location`);
      
      // Her film için detaylı bilgileri çek
      const moviesWithDetails = await Promise.all(
        sameLocationFilms.map(async (loc) => {
          try {
            console.log(`🎬 Fetching movie details for ID: ${loc.movieId}`);
            const movieDetails = await enhancedMovieService.getMovieDetails(loc.movieId);
            
            return {
              ...movieDetails,
              scene: loc.scene,
              description: loc.description
            };
          } catch (error) {
            console.error(`❌ Error loading movie details for ${loc.movieId}:`, error);
            
            // Hata durumunda temel bilgilerle devam et
            const basicMovie = enhancedMovieService.getBasicMovieInfo(loc.movieId);
            return {
              id: loc.movieId,
              title: basicMovie.title,
              year: basicMovie.year,
              director: 'Bilinmiyor',
              rating: 0,
              description: loc.description || 'Film detayları yüklenemedi.',
              scene: loc.scene
            };
          }
        })
      );
      
      console.log(`🎬 Successfully loaded details for ${moviesWithDetails.length} movies:`);
      moviesWithDetails.forEach((movie, index) => {
        console.log(`  ${index + 1}. ${movie.title} (${movie.year})`);
      });
      
      // Lokasyon verilerine film detaylarını ekle
      const enrichedLocation = {
        ...location,
        movies: moviesWithDetails
      };
      
      console.log('🔍 Enriched Location with multiple movies:', enrichedLocation);
      console.log('─'.repeat(60));
      
      setSelectedLocation(enrichedLocation);
      setCardLoading(false);
      
    } catch (error) {
      console.error('❌ Error loading movie details:', error);
      
      // Hata durumunda temel bilgilerle devam et
      const basicMovie = enhancedMovieService.getBasicMovieInfo(location.movieId);
      setSelectedLocation({
        ...location,
        movies: [{
          id: location.movieId,
          title: basicMovie.title,
          year: basicMovie.year,
          director: 'Bilinmiyor',
          rating: 0,
          description: location.description || 'Film detayları yüklenemedi.',
          scene: location.scene
        }]
      });
      setCardLoading(false);
    }
  };

  const closeCard = () => {
    console.log('Closing card');
    setCardOpen(false);
    setCardLoading(false);
    setTimeout(() => setSelectedLocation(null), 300);
  };

  const selectedMovie = selectedLocation 
    ? selectedLocation.movie
    : null;

  console.log('Render state:', { 
    cardOpen, 
    hasLocation: !!selectedLocation, 
    hasMovie: !!selectedMovie,
    locationName: selectedLocation?.name,
    movieTitle: selectedMovie?.title
  });

  // Loading state
  if (loading) {
    return (
      <Box sx={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
            🎬 Sihirli Sinema Dünyası
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Film hikayeleri canlanıyor
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ 
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
      }}>
        <Box sx={{ textAlign: 'center', maxWidth: 400, p: 3 }}>
          <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold', mb: 2 }}>
            ⚠️ Yükleme Hatası
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lütfen .env dosyasında TMDb API key'inizi kontrol edin.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.7) 50%, transparent 100%)',
          p: { xs: 2, md: 4 },
          textAlign: 'center',
        }}
      >
        <Fade in timeout={1000}>
          <Typography
            variant={{ xs: 'h4', md: 'h3' }}
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(255, 107, 107, 0.3)',
              mb: 1,
              letterSpacing: '2px',
            }}
          >
            🎬 GeoFilm
          </Typography>
        </Fade>
        
        <Fade in timeout={1500}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 0.5 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Filmlerin çekildiği gerçek lokasyonları keşfedin
            </Typography>
            
            {/* 🔍 SEARCH TOGGLE BUTTON */}
            <IconButton
              onClick={toggleSearchBox}
              sx={{
                color: showSearchBox ? 'primary.main' : 'text.secondary',
                background: showSearchBox ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
                border: showSearchBox ? '1px solid rgba(255, 107, 107, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  background: 'rgba(255, 107, 107, 0.1)',
                  color: 'primary.main',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <SearchIcon />
            </IconButton>

            {/* ❤️ FAVORITES TOGGLE BUTTON */}
            <Badge 
              badgeContent={favoritesCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  background: '#ff6b6b',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: '18px',
                  minWidth: '18px',
                }
              }}
            >
              <IconButton
                onClick={toggleFavoritesPanel}
                sx={{
                  color: showFavoritesPanel ? 'error.main' : 'text.secondary',
                  background: showFavoritesPanel ? 'rgba(255, 107, 107, 0.1)' : 'transparent',
                  border: showFavoritesPanel ? '1px solid rgba(255, 107, 107, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 107, 107, 0.1)',
                    color: 'error.main',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <FavoriteIcon />
              </IconButton>
            </Badge>
          </Box>
        </Fade>

        <Fade in timeout={2000}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 1,
            flexWrap: 'wrap',
          }}>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
              🌍 {allLocations.length} Lokasyon
            </Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
            <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 'bold' }}>
              🎬 58 Film
            </Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
            <Typography variant="body2" color="text.secondary">
              📍 Kırmızı noktaları tıklayın
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ 
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ecdc4" />
          <pointLight position={[5, 5, 5]} intensity={0.3} color="#ff6b6b" />
          
          {/* Stars background */}
          <mesh>
            <sphereGeometry args={[50, 32, 32]} />
            <meshBasicMaterial 
              color="#000011"
              transparent={true}
              opacity={0.8}
              side={1}
            />
          </mesh>
          
          {/* Earth */}
          <Earth 
            onLocationClick={handleLocationClick} 
            cardOpen={cardOpen} 
            allLocations={allLocations}
          />
          
          {/* 🔍 CINEMATIC SEARCH CAMERA - Only active during search */}
          {isSearchMode && searchTarget ? (
            <CinematicSearchCamera 
              targetLocation={searchTarget}
              onComplete={handleSearchComplete}
            />
          ) : (
            /* Normal Controls - Only when not in search mode */
            <OrbitControls 
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              minDistance={4}
              maxDistance={15}
              autoRotate={false}
              enableDamping={true}
              dampingFactor={0.05}
            />
          )}
        </Suspense>
      </Canvas>

      {/* Loading Screen */}
      <Suspense fallback={<LoadingScreen />}>
        <div />
      </Suspense>

      {/* Water Filling Loader for Card Loading */}
      <WaterFillingLoader 
        isVisible={cardLoading}
        title="Sihirli Sinema Dünyası"
        subtitle="Filmlerin büyülü hikayesine hazırlanıyor..."
      />

      {/* Location Card - Only show when not loading */}
      {!cardLoading && (
        <LocationCard
          location={selectedLocation}
          movies={selectedLocation?.movies || []}
          open={cardOpen}
          onClose={closeCard}
          onFavoritesChange={updateFavoritesCount}
        />
      )}

      {/* 🔍 MOVIE SEARCH BOX */}
      {showSearchBox && (
        <Fade in timeout={500}>
          <div>
            <MovieSearchBox 
              allLocations={allLocations}
              onMovieSelect={handleSearchMovieSelect}
              onClearSearch={() => setShowSearchBox(false)}
            />
          </div>
        </Fade>
      )}

      {/* ❤️ FAVORITES PANEL */}
      <FavoritesPanel
        open={showFavoritesPanel}
        onClose={() => setShowFavoritesPanel(false)}
        onLocationSelect={handleFavoriteLocationSelect}
        allLocations={allLocations}
        onFavoritesChange={updateFavoritesCount}
      />

      {/* Instructions */}
      <Fade in timeout={3000}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          <Box sx={{ 
            background: 'rgba(0,0,0,0.8)', 
            p: 2, 
            borderRadius: 3,
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              🖱️ <strong>Döndür:</strong> Sürükle • 🔍 <strong>Yakınlaştır:</strong> Scroll • 📍 <strong>Detay:</strong> Kırmızı noktaları tıkla
            </Typography>
            <Typography variant="caption" color="text.secondary">
              🌍 Manuel kontrol ile dünyayı keşfedin
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default GeoFilmMain;
