// Extension icon generator - Base64 weather icons
class IconGenerator {
  // Simple weather icon as base64 PNG (16x16)
  static getBase64Icon16() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJYSURBVDiNpZM9SwNBEIafgwQLwcJCG1sLwcJCG1sLwUKwsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQsLBQ";
  }
  
  // Weather emoji to base64 converter
  static createWeatherIcon(size = 16) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Blue gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#4682B4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Weather emoji
    ctx.font = `${size-4}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('🌤️', size/2, size-2);
    
    return canvas.toDataURL();
  }
}

// Export for use
if (typeof module !== 'undefined') {
  module.exports = IconGenerator;
}
