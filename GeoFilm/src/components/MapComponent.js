import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, FeatureGroup } from 'react-leaflet';
import { Box, Typography, Chip, Paper, IconButton, Slider, ButtonGroup, Button, Tooltip } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icon
const createCustomIcon = (color = '#ff6b6b') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Özel zoom kontrolü bileşeni
const CustomZoomControl = () => {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn(1);
  };
  
  const handleZoomOut = () => {
    map.zoomOut(1);
  };
  
  const handleZoomChange = (event, newValue) => {
    map.setZoom(newValue);
  };
  
  const handleResetView = () => {
    // Haritayı varsayılan görünüme sıfırlayın
    map.setView(map.options.center, map.options.zoom);
  };
  
  return (
    <Box
      sx={{
        position: 'absolute',
        right: 20,
        bottom: 40,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '8px',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <IconButton 
        onClick={handleZoomIn} 
        sx={{ color: 'white', backgroundColor: 'rgba(255, 107, 107, 0.7)' }}
      >
        <span style={{ fontSize: '18px' }}>+</span>
      </IconButton>
      
      <Slider
        orientation="vertical"
        value={map.getZoom()}
        min={2}
        max={20}
        step={0.5}
        onChange={handleZoomChange}
        sx={{ 
          height: 120,
          color: '#ff6b6b',
          '& .MuiSlider-thumb': {
            backgroundColor: 'white',
            border: '2px solid #ff6b6b',
            width: 20,
            height: 20,
          },
          '& .MuiSlider-track': {
            backgroundColor: '#ff6b6b',
            border: 'none',
          },
          '& .MuiSlider-rail': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }
        }}
      />
      
      <IconButton 
        onClick={handleZoomOut}
        sx={{ color: 'white', backgroundColor: 'rgba(255, 107, 107, 0.7)' }}
      >
        <span style={{ fontSize: '18px' }}>-</span>
      </IconButton>
      
      <IconButton 
        onClick={handleResetView}
        sx={{ 
          color: 'white', 
          backgroundColor: 'rgba(78, 205, 196, 0.7)',
          mt: 1
        }}
      >
        <span style={{ fontSize: '14px' }}>⟲</span>
      </IconButton>
    </Box>
  );
};

// Harita stil kontrolü bileşeni
const MapStyleControl = () => {
  const map = useMap();
  const [mapStyle, setMapStyle] = useState('standard');
  
  const mapStyles = {
    standard: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    },
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      maxZoom: 19
    },
    hybrid: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      maxZoom: 19
    }
  };
  
  useEffect(() => {
    // Stil değiştiğinde tüm tile katmanları kaldırıp yenisini ekle
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    const styleConfig = mapStyles[mapStyle];
    const newLayer = L.tileLayer(styleConfig.url, {
      attribution: styleConfig.attribution,
      maxZoom: styleConfig.maxZoom,
      maxNativeZoom: styleConfig.maxZoom,
      tileSize: 256,
      zoomOffset: 0
    });
    
    newLayer.addTo(map);
    
    // Harita zoom limitlerini güncelle
    map.setMaxZoom(styleConfig.maxZoom);
  }, [map, mapStyle, mapStyles]);
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '8px',
        borderRadius: '8px',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <ButtonGroup size="small" aria-label="map style group">
        <Button 
          onClick={() => setMapStyle('standard')} 
          variant={mapStyle === 'standard' ? 'contained' : 'outlined'}
          sx={{
            color: 'white',
            backgroundColor: mapStyle === 'standard' ? 'rgba(255, 107, 107, 0.7)' : 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 107, 0.5)',
            }
          }}
        >
          Standart
        </Button>
        <Button 
          onClick={() => setMapStyle('dark')} 
          variant={mapStyle === 'dark' ? 'contained' : 'outlined'}
          sx={{
            color: 'white',
            backgroundColor: mapStyle === 'dark' ? 'rgba(78, 205, 196, 0.7)' : 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(78, 205, 196, 0.5)',
            }
          }}
        >
          Koyu
        </Button>
        <Button 
          onClick={() => setMapStyle('satellite')} 
          variant={mapStyle === 'satellite' ? 'contained' : 'outlined'}
          sx={{
            color: 'white',
            backgroundColor: mapStyle === 'satellite' ? 'rgba(78, 205, 196, 0.7)' : 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(78, 205, 196, 0.5)',
            }
          }}
        >
          Uydu
        </Button>
        <Button 
          onClick={() => setMapStyle('hybrid')} 
          variant={mapStyle === 'hybrid' ? 'contained' : 'outlined'}
          sx={{
            color: 'white',
            backgroundColor: mapStyle === 'hybrid' ? 'rgba(255, 193, 7, 0.7)' : 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: 'rgba(255, 193, 7, 0.5)',
            }
          }}
        >
          Hibrit
        </Button>
      </ButtonGroup>
    </Box>
  );
};

// Tam ekran düğmesi
const FullscreenControl = ({ mapContainerRef }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch(err => {
        console.log(`Tam ekran hatası: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Fullscreen API değişikliklerini dinle
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  return (
    <Tooltip title={isFullscreen ? "Tam ekrandan çık" : "Tam ekran"} placement="left">
      <IconButton
        onClick={toggleFullscreen}
        sx={{
          position: 'absolute',
          left: 15,
          top: 15,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(78, 205, 196, 0.7)',
          }
        }}
      >
        <span style={{ fontSize: '14px' }}>{isFullscreen ? '⤓' : '⤢'}</span>
      </IconButton>
    </Tooltip>
  );
};

const MapComponent = ({ locations, center, zoom = 6 }) => {
  const mapContainerRef = useRef(null);
  const [enableClustering, setEnableClustering] = useState(true);
  
  if (!locations || locations.length === 0) {
    return (
      <Box sx={{ 
        height: 400, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'background.paper',
        borderRadius: 2,
      }}>
        <Typography color="text.secondary">
          Lokasyon bilgisi bulunamadı
        </Typography>
      </Box>
    );
  }

  // Calculate center if not provided
  const mapCenter = center || [
    locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length,
    locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length,
  ];

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }} ref={mapContainerRef}>
      <Box 
        sx={{
          position: 'absolute',
          bottom: 15,
          left: 15,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '8px',
          padding: '5px',
          display: 'flex',
          alignItems: 'center',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Typography variant="body2" sx={{ color: 'white', mx: 1, fontSize: '0.8rem' }}>
          Lokasyonları Grupla
        </Typography>
        <IconButton 
          size="small" 
          onClick={() => setEnableClustering(!enableClustering)}
          sx={{
            color: 'white',
            backgroundColor: enableClustering ? 'rgba(78, 205, 196, 0.7)' : 'rgba(255, 107, 107, 0.7)',
          }}
        >
          {enableClustering ? '✓' : '✗'}
        </IconButton>
      </Box>
      
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        maxZoom={20}  // Önce daha düşük bir değerle test edelim
        minZoom={2}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
        preferCanvas={true}
        zoomSnap={0.5}
        zoomDelta={0.5}
      >
        {/* İlk başlangıçta bir katman olmalı, sonrasında MapStyleControl tarafından yönetilecek */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          key="default-layer"
        />
        
        {/* Harita stilleri kontrol paneli */}
        <MapStyleControl />
        
        {/* Özel zoom kontrolü */}
        <CustomZoomControl />
        
        {/* Tam ekran kontrolü */}
        <FullscreenControl mapContainerRef={mapContainerRef} />
        
        {enableClustering ? (
          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            maxClusterRadius={40}
            disableClusteringAtZoom={16}
            iconCreateFunction={(cluster) => {
              const childCount = cluster.getChildCount();
              let size = 40;
              if (childCount > 10) size = 50;
              if (childCount > 20) size = 60;
              
              return L.divIcon({
                html: `<div style="
                  width: ${size}px;
                  height: ${size}px;
                  background: linear-gradient(135deg, rgba(255, 107, 107, 0.9), rgba(78, 205, 196, 0.9));
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  border: 2px solid white;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                ">${childCount}</div>`,
                className: 'marker-cluster',
                iconSize: L.point(size, size)
              });
            }}
          >
            {locations.map((location, index) => (
              <Marker
                key={location.id || index}
                position={[location.lat, location.lng]}
                icon={createCustomIcon('#ff6b6b')}
              >
                <Popup
                  maxWidth={300}
                  className="custom-popup"
                >
                  <Box sx={{ p: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                      {location.name}
                    </Typography>
                    
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={`${location.city}, ${location.country}`}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 1 }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff6b6b', mb: 1 }}>
                      Sahne: {location.scene}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.4 }}>
                      {location.description}
                    </Typography>

                    {location.movieTitle && (
                      <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: '#4ecdc4' }}>
                        Film: {location.movieTitle}
                      </Typography>
                    )}
                  </Box>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        ) : (
          // Gruplandırma olmadan doğrudan haritaya işaretçileri ekle
          locations.map((location, index) => (
            <Marker
              key={location.id || index}
              position={[location.lat, location.lng]}
              icon={createCustomIcon('#ff6b6b')}
            >
              <Popup
                maxWidth={300}
                className="custom-popup"
              >
                <Box sx={{ p: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                    {location.name}
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Chip
                      label={`${location.city}, ${location.country}`}
                      size="small"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff6b6b', mb: 1 }}>
                    Sahne: {location.scene}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.4 }}>
                    {location.description}
                  </Typography>

                  {location.movieTitle && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: '#4ecdc4' }}>
                      Film: {location.movieTitle}
                    </Typography>
                  )}
                </Box>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </Paper>
  );
};

export default MapComponent;
