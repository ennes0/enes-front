// Favoriler Yönetim Sistemi
class FavoritesManager {
  constructor() {
    this.storageKey = 'weatherAppFavorites';
    this.init();
  }

 
  init() {
    this.updateFavoritesDisplay();
    this.setupEventListeners();
  }

  loadFavorites() {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  saveFavorites(favorites) {
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  addToFavorites(cityData) {
    const favorites = this.loadFavorites();
    
    if (!favorites.find(fav => fav.id === cityData.id)) {
      const favoriteCity = {
        id: cityData.id,
        name: cityData.name,
        country: cityData.country || 'TR',
        temp: cityData.temp,
        description: cityData.description,
        icon: cityData.icon,
        addedDate: new Date().toISOString()
      };
      
      favorites.push(favoriteCity);
      this.saveFavorites(favorites);
      this.updateFavoritesDisplay();
      this.updateAddButton(true);
      
      console.log(`${cityData.name} favorilere eklendi!`);
      return true;
    }
    
    console.log(`${cityData.name} zaten favorilerde!`);
    return false;
  }

  removeFromFavorites(cityId) {
    let favorites = this.loadFavorites();
    const removedCity = favorites.find(fav => fav.id === cityId);
    
    favorites = favorites.filter(fav => fav.id !== cityId);
    this.saveFavorites(favorites);
    this.updateFavoritesDisplay();
    
    const currentCityId = this.getCurrentDisplayedCityId();
    if (currentCityId === cityId) {
      this.updateAddButton(false);
    }
    
    if (removedCity) {
      console.log(`${removedCity.name} favorilerden çıkarıldı!`);
    }
  }

  updateFavoritesDisplay() {
    const favorites = this.loadFavorites();
    const favoritesList = document.getElementById('favorites-list');
    
    if (!favoritesList) return;
    
    if (favorites.length === 0) {
      favoritesList.innerHTML = `
        <div class="no-favorites" style="
          min-width: 300px;
          max-width: 300px;
          height: 120px;
          flex-shrink: 0;
          text-align: center; 
          color: #7f8c8d; 
          font-style: italic; 
          padding: 15px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 10px;
          border: 2px dashed #bdc3c7;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        ">
          <i class="fas fa-star" style="font-size: 20px; margin-bottom: 8px; opacity: 0.5;"></i>
          <p style="margin: 0; font-size: 13px;">Henüz favori şehir eklenmemiş</p>
          <p style="font-size: 10px; margin: 5px 0 0 0; opacity: 0.8;">⭐ butonuna tıklayarak ekleyebilirsiniz</p>
        </div>
      `;
      return;
    }
    
    favoritesList.innerHTML = favorites.map(fav => `
      <div class="favorite-card" data-city="${fav.name}" data-id="${fav.id}">
        <button class="remove-favorite" title="Favorilerden Çıkar">
          <i class="fas fa-times"></i>
        </button>
        <div class="card-weather-icon">
          <img src="https://openweathermap.org/img/wn/${fav.icon}@2x.png" 
               alt="${fav.description}" 
               style="width: 40px; height: 40px;">
        </div>
        <div class="card-city-name">${fav.name}</div>
        <div class="card-temperature">${fav.temp}°C</div>
        <div class="card-description">${fav.description}</div>
      </div>
    `).join('');
    
    this.addCardEventListeners();
  }

  updateAddButton(isAdded) {
    const addBtn = document.getElementById('add-to-favorites-btn');
    if (!addBtn) return;
    
    if (isAdded) {
      addBtn.classList.add('added');
      addBtn.title = 'Favorilerden Çıkar';
      addBtn.innerHTML = '<i class="fas fa-star"></i>'; // Dolu yıldız
    } else {
      addBtn.classList.remove('added');
      addBtn.title = 'Favorilere Ekle';
      addBtn.innerHTML = '<i class="far fa-star"></i>'; // Boş yıldız
    }
  }

  getCurrentCityData() {
    const cityElement = document.getElementById('city');
    const tempElement = document.getElementById('temp');
    const descElement = document.getElementById('weather-desc');
    const iconElement = document.getElementById('weather-icon');
    
    if (!cityElement || !cityElement.dataset.cityId) return null;
    
    let iconCode = '01d';
    if (iconElement && iconElement.src) {
      const iconMatch = iconElement.src.match(/\/([^\/]+)@[0-9]x\.png/);
      if (iconMatch) {
        iconCode = iconMatch[1];
      }
    }
    
    return {
      id: cityElement.dataset.cityId,
      name: cityElement.textContent,
      country: cityElement.dataset.country || 'TR',
      temp: tempElement ? tempElement.textContent.replace('°C', '') : '0',
      description: descElement ? descElement.textContent : 'Bilinmiyor',
      icon: iconCode
    };
  }

  getCurrentDisplayedCityId() {
    const cityElement = document.getElementById('city');
    return cityElement ? cityElement.dataset.cityId : null;
  }

  checkIfCurrentCityIsFavorite() {
    const currentCityId = this.getCurrentDisplayedCityId();
    if (!currentCityId) {
      this.updateAddButton(false);
      return;
    }
    
    const favorites = this.loadFavorites();
    const isFavorite = favorites.find(fav => fav.id === currentCityId);
    this.updateAddButton(!!isFavorite);
  }

  loadFavoriteCity(cityName, cityId) {
    if (typeof searchWeatherForCity === 'function') {
      searchWeatherForCity(cityName, cityId);
    } else {
      console.warn('searchWeatherForCity fonksiyonu bulunamadı!');
    }
  }

  setupEventListeners() {
    const addBtn = document.getElementById('add-to-favorites-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const currentCity = this.getCurrentCityData();
        if (!currentCity) {
          console.warn('Şu anda görüntülenen şehir verisi bulunamadı!');
          return;
        }
        
        const favorites = this.loadFavorites();
        const isAlreadyFavorite = favorites.find(fav => fav.id === currentCity.id);
        
        if (isAlreadyFavorite) {
          // Favorilerden çıkar
          this.removeFromFavorites(currentCity.id);
        } else {
          // Favorilere ekle
          this.addToFavorites(currentCity);
        }
      });
    }
  }

  addCardEventListeners() {
    document.querySelectorAll('.favorite-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.remove-favorite')) return;
        
        const cityName = card.dataset.city;
        const cityId = card.dataset.id;
        this.loadFavoriteCity(cityName, cityId);
      });
      
      const removeBtn = card.querySelector('.remove-favorite');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation(); 
          const cityId = card.dataset.id;
          this.removeFromFavorites(cityId);
        });
      }
    });
  }

  onCityDataUpdated(cityData) {
    const cityElement = document.getElementById('city');
    if (cityElement && cityData) {
      cityElement.dataset.cityId = cityData.id || '';
      cityElement.dataset.country = cityData.country || 'TR';
      cityElement.textContent = cityData.name || 'Bilinmiyor';
    }
    
    this.checkIfCurrentCityIsFavorite();
  }
}

const favoritesManager = new FavoritesManager();

document.addEventListener('DOMContentLoaded', () => {
  favoritesManager.updateFavoritesDisplay();
});
