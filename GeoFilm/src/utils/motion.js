// Animation utilities for GeoFilm
// CSS animation keyframes and helpers

const slideIn = (direction, type, delay, duration) => ({
  animation: `${direction}SlideIn ${duration}s ${type} ${delay}s forwards`,
  opacity: 0,
  position: 'relative',
  '@keyframes rightSlideIn': {
    '0%': {
      transform: 'translateX(100px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateX(0px)',
      opacity: 1,
    },
  },
  '@keyframes leftSlideIn': {
    '0%': {
      transform: 'translateX(-100px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateX(0px)',
      opacity: 1,
    },
  },
  '@keyframes upSlideIn': {
    '0%': {
      transform: 'translateY(100px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0px)',
      opacity: 1,
    },
  },
});

const fadeIn = (direction, type, delay, duration) => ({
  animation: `${direction}FadeIn ${duration}s ${type} ${delay}s forwards`,
  opacity: 0,
  '@keyframes upFadeIn': {
    '0%': {
      transform: 'translateY(30px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  '@keyframes downFadeIn': {
    '0%': {
      transform: 'translateY(-30px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  '@keyframes leftFadeIn': {
    '0%': {
      transform: 'translateX(-30px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
  '@keyframes rightFadeIn': {
    '0%': {
      transform: 'translateX(30px)',
      opacity: 0,
    },
    '100%': {
      transform: 'translateX(0)',
      opacity: 1,
    },
  },
});

const zoomIn = (delay, duration) => ({
  animation: `zoomIn ${duration}s ease ${delay}s forwards`,
  opacity: 0,
  '@keyframes zoomIn': {
    '0%': {
      transform: 'scale(0.8)',
      opacity: 0,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
});

const pulse = (delay, duration) => ({
  animation: `pulse ${duration}s ease ${delay}s infinite`,
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
});

const motion = {
  slideIn,
  fadeIn,
  zoomIn,
  pulse
};

export default motion;
