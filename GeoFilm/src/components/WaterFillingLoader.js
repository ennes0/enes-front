import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

// Enhanced water filling animation keyframes
const waveAnimation = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 0.6;
  }
`;

const fillAnimation = keyframes`
  0% {
    transform: translateY(100%);
    filter: brightness(0.8);
  }
  50% {
    filter: brightness(1.2);
  }
  100% {
    transform: translateY(0%);
    filter: brightness(1);
  }
`;

const bubbleAnimation = keyframes`
  0% {
    transform: translateY(0) scale(0.3);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
    transform: translateY(-20px) scale(0.8);
  }
  50% {
    transform: translateY(-100px) scale(1.1);
    opacity: 1;
  }
  80% {
    transform: translateY(-180px) scale(0.9);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-250px) scale(0.2);
    opacity: 0;
  }
`;

const shimmerAnimation = keyframes`
  0% {
    left: -100%;
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
`;

// Text glow animation for magical effect
const textGlowAnimation = keyframes`
  0%, 100% {
    text-shadow: 0 0 5px rgba(78, 205, 196, 0.3);
  }
  50% {
    text-shadow: 0 0 20px rgba(78, 205, 196, 0.8), 0 0 30px rgba(78, 205, 196, 0.4);
  }
`;

// Floating animation for smooth movement
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled components
const LoaderContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `
    linear-gradient(135deg, 
      rgba(0, 0, 0, 0.9) 0%, 
      rgba(15, 15, 20, 0.95) 50%, 
      rgba(0, 0, 0, 0.9) 100%
    )
  `,
  backdropFilter: 'blur(10px)',
}));

const WaterContainer = styled(Box)(() => ({
  position: 'relative',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  border: '4px solid rgba(78, 205, 196, 0.3)',
  overflow: 'hidden',
  background: 'rgba(15, 15, 20, 0.8)',
  boxShadow: `
    0 0 30px rgba(78, 205, 196, 0.4),
    inset 0 0 30px rgba(78, 205, 196, 0.1),
    0 0 60px rgba(78, 205, 196, 0.2)
  `,
  animation: `${floatAnimation} 4s ease-in-out infinite`,
}));

const WaterFill = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `
    linear-gradient(180deg,
      rgba(78, 205, 196, 0.8) 0%,
      rgba(78, 205, 196, 0.9) 50%,
      rgba(64, 224, 208, 1) 100%
    )
  `,
  animation: `${fillAnimation} 3s ease-in-out infinite alternate`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `
      radial-gradient(circle,
        rgba(255, 255, 255, 0.3) 0%,
        transparent 50%
      )
    `,
    animation: `${waveAnimation} 4s ease-in-out infinite`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.6) 50%,
        transparent 100%
      )
    `,
    animation: `${shimmerAnimation} 3s ease-in-out infinite`,
  },
}));

const Bubble = styled(Box)(({ delay, size, left }) => ({
  position: 'absolute',
  bottom: '10%',
  left: left || '50%',
  width: size || '8px',
  height: size || '8px',
  borderRadius: '50%',
  background: `
    radial-gradient(circle,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.4) 70%,
      transparent 100%
    )
  `,
  boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
  animation: `${bubbleAnimation} 3s ease-in-out infinite`,
  animationDelay: delay || '0s',
}));

const LoadingText = styled(Typography)(() => ({
  position: 'absolute',
  bottom: '-80px',
  left: '50%',
  transform: 'translateX(-50%)',
  color: '#4ecdc4',
  fontWeight: 'bold',
  fontSize: '1.2rem',
  textAlign: 'center',
  width: '100%',
  animation: `${textGlowAnimation} 2s ease-in-out infinite`,
  '&::after': {
    content: '"..."',
    animation: `${floatAnimation} 1.5s ease-in-out infinite`,
    display: 'inline-block',
  },
}));

const FilmTitle = styled(Typography)(() => ({
  position: 'absolute',
  top: '-60px',
  left: '50%',
  transform: 'translateX(-50%)',
  color: '#ff6b6b',
  fontWeight: 'bold',
  fontSize: '1.4rem',
  textAlign: 'center',
  width: '300px',
  background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${textGlowAnimation} 3s ease-in-out infinite`,
}));

const WaterFillingLoader = ({ 
  isVisible = true, 
  title = "Sihirli Sinema Dünyası",
  subtitle = "Filmlerin büyülü haritasına yolculuk başlıyor" 
}) => {
  if (!isVisible) return null;

  return (
    <LoaderContainer>
      <Box sx={{ position: 'relative' }}>
        <FilmTitle variant="h5">
          {title}
        </FilmTitle>
        
        <WaterContainer>
          <WaterFill>
            {/* Bubbles */}
            <Bubble delay="0s" size="6px" left="20%" />
            <Bubble delay="0.5s" size="8px" left="40%" />
            <Bubble delay="1s" size="5px" left="60%" />
            <Bubble delay="1.5s" size="7px" left="80%" />
            <Bubble delay="0.3s" size="4px" left="30%" />
            <Bubble delay="0.8s" size="9px" left="70%" />
          </WaterFill>
        </WaterContainer>
        
        <LoadingText variant="h6">
          {subtitle}
        </LoadingText>
      </Box>
    </LoaderContainer>
  );
};

export default WaterFillingLoader;
