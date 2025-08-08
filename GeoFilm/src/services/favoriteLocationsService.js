// Favorite Locations Service - localStorage management
class FavoriteLocationsService {
  constructor() {
    this.storageKey = 'geofilm_favorite_locations';
  }

  // Get all favorite locations from localStorage
  getFavoriteLocations() {
    try {
      const favorites = localStorage.getItem(this.storageKey);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error loading favorite locations:', error);
      return [];
    }
  }

  // Add location to favorites
  addToFavorites(location) {
    try {
      const favorites = this.getFavoriteLocations();
      
      // Create a unique key for the location
      const locationKey = `${location.movieId}_${location.lat}_${location.lng}`;
      
      // Check if already exists
      const existingIndex = favorites.findIndex(fav => 
        fav.locationKey === locationKey
      );
      
      if (existingIndex === -1) {
        const favoriteLocation = {
          locationKey,
          movieId: location.movieId,
          name: location.name,
          city: location.city,
          country: location.country,
          lat: location.lat,
          lng: location.lng,
          scene: location.scene,
          description: location.description,
          movieTitle: location.movieTitle || 'Unknown Movie',
          movieYear: location.movieYear || 'Unknown',
          addedAt: new Date().toISOString(),
          // Basic movie info for display
          basicMovieInfo: location.basicMovieInfo || null
        };
        
        favorites.push(favoriteLocation);
        localStorage.setItem(this.storageKey, JSON.stringify(favorites));
        
        console.log(`✅ Added "${location.name}" to favorites`);
        return true;
      } else {
        console.log(`⚠️ "${location.name}" is already in favorites`);
        return false;
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  // Remove location from favorites
  removeFromFavorites(location) {
    try {
      const favorites = this.getFavoriteLocations();
      const locationKey = `${location.movieId}_${location.lat}_${location.lng}`;
      
      const filteredFavorites = favorites.filter(fav => 
        fav.locationKey !== locationKey
      );
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredFavorites));
      
      console.log(`✅ Removed "${location.name}" from favorites`);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  // Check if location is in favorites
  isLocationFavorite(location) {
    try {
      const favorites = this.getFavoriteLocations();
      const locationKey = `${location.movieId}_${location.lat}_${location.lng}`;
      
      return favorites.some(fav => fav.locationKey === locationKey);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  // Get favorites count
  getFavoritesCount() {
    return this.getFavoriteLocations().length;
  }

  // Clear all favorites
  clearAllFavorites() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('✅ All favorites cleared');
      return true;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return false;
    }
  }

  // Get favorites by movie
  getFavoritesByMovie(movieId) {
    const favorites = this.getFavoriteLocations();
    return favorites.filter(fav => fav.movieId === movieId);
  }

  // Get favorites by country
  getFavoritesByCountry(country) {
    const favorites = this.getFavoriteLocations();
    return favorites.filter(fav => 
      fav.country.toLowerCase() === country.toLowerCase()
    );
  }

  // Export favorites as JSON
  exportFavorites() {
    const favorites = this.getFavoriteLocations();
    const exportData = {
      exportedAt: new Date().toISOString(),
      count: favorites.length,
      favorites: favorites
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Import favorites from JSON
  importFavorites(jsonData) {
    try {
      const importData = JSON.parse(jsonData);
      if (importData.favorites && Array.isArray(importData.favorites)) {
        localStorage.setItem(this.storageKey, JSON.stringify(importData.favorites));
        console.log(`✅ Imported ${importData.favorites.length} favorites`);
        return true;
      } else {
        throw new Error('Invalid import format');
      }
    } catch (error) {
      console.error('Error importing favorites:', error);
      return false;
    }
  }
}

export default new FavoriteLocationsService();
