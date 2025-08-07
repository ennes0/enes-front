// Weather Widget Extension - Content Script

console.log('🟢 Weather Widget Content Script yüklendi!');

// CSS'i inject et
function injectCSS() {
  // CSS'in zaten yüklenmiş olup olmadığını kontrol et
  if (document.getElementById('weather-widget-css')) {
    return;
  }

  const link = document.createElement('link');
  link.id = 'weather-widget-css';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = chrome.runtime.getURL('widget.css');
  
  (document.head || document.documentElement).appendChild(link);
  console.log('Weather Widget CSS enjekte edildi');
}

// CSS'i hemen yükle
injectCSS();

class WeatherWidget {
  constructor() {
    try {
      this.widget = null;
      this.isVisible = true;
      this.isMinimized = false;
      this.position = { x: 20, y: 20 };
      this.currentLocationData = null;
      this.favorites = [];
      this.settings = {};
      this.API_KEY = "1ab5083c1ad45e73e3a6fecc3f343f32"; // OpenWeatherMap API Key
      
      // Widget'ın zaten var olup olmadığını kontrol et
      if (document.getElementById('weather-widget-extension')) {
        console.log('Weather widget zaten var, tekrar oluşturulmayacak');
        return;
      }
      
      console.log('Weather Widget başlatılıyor...');
      this.init();
    } catch (error) {
      console.error('WeatherWidget constructor hatası:', error);
    }
  }

  async init() {
    try {
      console.log('Weather Widget init başladı...');
      
      // Storage'dan ayarları al
      const result = await chrome.storage.local.get(['widgetSettings', 'favorites', 'currentLocation']);
      this.settings = result.widgetSettings || this.getDefaultSettings();
      this.favorites = result.favorites || this.getDefaultFavorites();
      this.currentLocationData = result.currentLocation || null;
      
      console.log('Settings yüklendi:', this.settings);
      console.log('Widget enabled durumu:', this.settings.enabled);
      
      // Widget'ı her durumda oluştur (test için)
      console.log('Widget ZORLA oluşturuluyor...');
      this.createWidget();
      this.loadWeatherData();
      this.startAutoUpdate();
      
      // Storage değişikliklerini dinle
      chrome.storage.onChanged.addListener((changes) => {
        this.handleStorageChange(changes);
      });
      
    } catch (error) {
      console.error('Weather Widget init hatası:', error);
      // Fallback olarak minimal widget oluştur
      this.createMinimalWidget();
    }
  }

  getDefaultSettings() {
    return {
      enabled: true,
      position: 'top-right',
      size: 'medium',
      transparency: 0.9,
      autoHide: true,
      showOnHover: false,
      updateInterval: 300000, // 5 dakika
      theme: 'light',
      showFavorites: true,
      showDetails: true,
      animationsEnabled: true
    };
  }

  getDefaultFavorites() {
    return [
      { name: 'İstanbul', id: '745044', temp: null, icon: null },
      { name: 'Ankara', id: '323786', temp: null, icon: null },
      { name: 'İzmir', id: '311044', temp: null, icon: null }
    ];
  }

  createWidget() {
    console.log('createWidget çalışıyor...');
    
    // Widget container
    this.widget = document.createElement('div');
    this.widget.id = 'weather-widget-extension';
    this.widget.className = `weather-widget ${this.settings.size} ${this.settings.theme} sunny`;
    
    console.log('Widget element oluşturuldu:', this.widget);
    
    if (this.settings.animationsEnabled) {
      this.widget.classList.add('animated');
    }

    this.widget.innerHTML = `
      <div class="weather-card-horizontal">
        <div class="weather-left-section">
          <div class="weather-condition" id="weather-condition">Partly Cloudy</div>
          <div class="weather-temperature" id="temperature">30°</div>
          <div class="weather-details">
            <div class="weather-date" id="weather-date">Monday, 02 May 2045</div>
            <div class="weather-location" id="location-name">📍 New Delhi</div>
          </div>
        </div>
        <div class="weather-right-section">
          <div class="weather-icon-large" id="main-weather-icon">☀️</div>
        </div>
        <div class="widget-controls">
          <button class="control-btn refresh-btn" id="refresh-btn" title="Yenile">🔄</button>
          <button class="control-btn close-btn" id="close-btn" title="Kapat">×</button>
        </div>
      </div>
    `;

    // Widget'ı sayfaya ekle
    console.log('Widget DOM\'a ekleniyor...');
    document.body.appendChild(this.widget);
    console.log('Widget DOM\'a eklendi, element:', document.getElementById('weather-widget-extension'));
    
    // Pozisyon ve stil ayarla
    this.setPosition();
    this.setTransparency();
    
    console.log('Widget pozisyon ve şeffaflık ayarlandı');
    
    // Event listener'ları ekle
    this.addEventListeners();
    
    // Draggable yap
    this.makeDraggable();
    
    // Auto-hide özelliği
    if (this.settings.autoHide) {
      this.setupAutoHide();
    }
    
    console.log('Widget başarıyla oluşturuldu ve sayfaya eklendi');
  }

  setPosition() {
    const positions = {
      'top-left': { top: '20px', left: '20px', right: 'auto', bottom: 'auto' },
      'top-right': { top: '20px', right: '20px', left: 'auto', bottom: 'auto' },
      'bottom-left': { bottom: '20px', left: '20px', right: 'auto', top: 'auto' },
      'bottom-right': { bottom: '20px', right: '20px', left: 'auto', top: 'auto' }
    };
    
    const pos = positions[this.settings.position] || positions['top-right'];
    Object.assign(this.widget.style, pos);
    this.widget.style.position = 'fixed';
    this.widget.style.zIndex = '2147483647';
    
    // CSS yüklenmediği durumda temel stilleri ekle
    this.widget.style.minWidth = '300px';
    this.widget.style.minHeight = '200px';
    this.widget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    this.widget.style.borderRadius = '15px';
    this.widget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
    this.widget.style.padding = '16px';
    this.widget.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    this.widget.style.fontSize = '14px';
    this.widget.style.color = '#1f2937';
    this.widget.style.border = '1px solid rgba(255, 255, 255, 0.18)';
    
    console.log('Widget pozisyon ve temel stiller ayarlandı:', this.widget.style.cssText);
  }

  setTransparency() {
    this.widget.style.opacity = this.settings.transparency;
  }

  makeDraggable() {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let initialPosition = { x: 0, y: 0 };
    
    // Header yerine tüm widget'ı drag yapılabilir yap ama kontrolleri hariç tut
    const widget = this.widget;
    if (!widget) return;
    
    // Widget üzerinde mouse down - drag başlat
    widget.addEventListener('mousedown', (e) => {
      // Kontrol düğmelerine tıklandığında drag başlatma
      if (e.target.closest('.widget-controls') || 
          e.target.closest('button') || 
          e.target.closest('input') ||
          e.target.closest('select')) return;
      
      e.preventDefault();
      isDragging = true;
      
      const rect = widget.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      initialPosition.x = rect.left;
      initialPosition.y = rect.top;
      
      // Drag sırasında widget stilini değiştir
      widget.classList.add('dragging');
      widget.style.cursor = 'grabbing';
      widget.style.transition = 'none'; // Drag sırasında transition kaldır
      widget.style.userSelect = 'none';
      
      // Global event listener'ları ekle
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
      
      // Text seçimini engelle
      document.body.style.userSelect = 'none';
    });
    
    // Touch events (mobil cihazlar için)
    widget.addEventListener('touchstart', (e) => {
      if (e.target.closest('.widget-controls') || 
          e.target.closest('button') || 
          e.target.closest('input') ||
          e.target.closest('select')) return;
      
      e.preventDefault();
      isDragging = true;
      
      const touch = e.touches[0];
      const rect = widget.getBoundingClientRect();
      dragOffset.x = touch.clientX - rect.left;
      dragOffset.y = touch.clientY - rect.top;
      initialPosition.x = rect.left;
      initialPosition.y = rect.top;
      
      widget.classList.add('dragging');
      widget.style.cursor = 'grabbing';
      widget.style.transition = 'none';
      
      document.addEventListener('touchmove', handleTouchDrag, { passive: false });
      document.addEventListener('touchend', stopTouchDrag);
    });
    
    const handleDrag = (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      // Ekran sınırları içinde kalmasını sağla
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      const x = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x));
      const y = Math.max(0, Math.min(maxY, e.clientY - dragOffset.y));
      
      // Smooth hareket için transform kullan
      widget.style.transform = `translate(${x - initialPosition.x}px, ${y - initialPosition.y}px)`;
    };
    
    const handleTouchDrag = (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      const touch = e.touches[0];
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      const x = Math.max(0, Math.min(maxX, touch.clientX - dragOffset.x));
      const y = Math.max(0, Math.min(maxY, touch.clientY - dragOffset.y));
      
      widget.style.transform = `translate(${x - initialPosition.x}px, ${y - initialPosition.y}px)`;
    };
    
    const stopDrag = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      
      // Event listener'ları kaldır
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
      
      // Final pozisyonu hesapla ve uygula
      const transform = widget.style.transform;
      if (transform && transform.includes('translate')) {
        const matches = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (matches) {
          const deltaX = parseFloat(matches[1]);
          const deltaY = parseFloat(matches[2]);
          
          const finalX = initialPosition.x + deltaX;
          const finalY = initialPosition.y + deltaY;
          
          // Transform'u temizle ve position kullan
          widget.style.transform = 'none';
          widget.style.left = finalX + 'px';
          widget.style.top = finalY + 'px';
          widget.style.right = 'auto';
          widget.style.bottom = 'auto';
        }
      }
      
      // Drag stillerini temizle
      widget.classList.remove('dragging');
      widget.style.cursor = 'default';
      widget.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // Transition'ı geri getir
      widget.style.userSelect = 'none';
      
      // Body'deki user-select'i geri getir
      document.body.style.userSelect = '';
      
      // Pozisyonu kaydet
      this.savePosition();
    };
    
    const stopTouchDrag = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      
      document.removeEventListener('touchmove', handleTouchDrag);
      document.removeEventListener('touchend', stopTouchDrag);
      
      // Final pozisyonu hesapla ve uygula (mouse ile aynı logic)
      const transform = widget.style.transform;
      if (transform && transform.includes('translate')) {
        const matches = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (matches) {
          const deltaX = parseFloat(matches[1]);
          const deltaY = parseFloat(matches[2]);
          
          const finalX = initialPosition.x + deltaX;
          const finalY = initialPosition.y + deltaY;
          
          widget.style.transform = 'none';
          widget.style.left = finalX + 'px';
          widget.style.top = finalY + 'px';
          widget.style.right = 'auto';
          widget.style.bottom = 'auto';
        }
      }
      
      widget.classList.remove('dragging');
      widget.style.cursor = 'default';
      widget.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      this.savePosition();
    };
    
    // Widget'a grab cursor ekle
    widget.style.cursor = 'grab';
    widget.addEventListener('mouseenter', () => {
      if (!isDragging) widget.style.cursor = 'grab';
    });
  }

  setupAutoHide() {
    let hideTimeout;
    const baseOpacity = this.settings.transparency;
    
    // Eski event listener'ları temizle
    this.removeAutoHide();
    
    this.autoHideEnter = () => {
      clearTimeout(hideTimeout);
      this.widget.style.opacity = baseOpacity;
    };
    
    this.autoHideLeave = () => {
      hideTimeout = setTimeout(() => {
        this.widget.style.opacity = Math.max(0.2, baseOpacity - 0.5);
      }, 3000);
    };
    
    this.widget.addEventListener('mouseenter', this.autoHideEnter);
    this.widget.addEventListener('mouseleave', this.autoHideLeave);
  }

  removeAutoHide() {
    if (this.widget && this.autoHideEnter && this.autoHideLeave) {
      this.widget.removeEventListener('mouseenter', this.autoHideEnter);
      this.widget.removeEventListener('mouseleave', this.autoHideLeave);
      this.widget.style.opacity = this.settings.transparency;
    }
  }

  addEventListeners() {
    // Minimize/maximize
    if (this.widget.querySelector('#minimize-btn')) {
      this.widget.querySelector('#minimize-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMinimize();
      });
    }
    
    // Refresh
    if (this.widget.querySelector('#refresh-btn')) {
      this.widget.querySelector('#refresh-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadWeatherData();
      });
    }
    
    // Close
    if (this.widget.querySelector('#close-btn')) {
      this.widget.querySelector('#close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideWidget();
      });
    }
    
    // Widget'a çift tıklayınca popup açılsın
    this.widget.addEventListener('dblclick', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });
  }

  async loadWeatherData() {
    try {
      this.showLoading(true);
      this.hideError();
      
      let weatherData;
      
      // Önce basit API çağrısı dene
      if (this.currentLocationData && this.currentLocationData.lat && this.currentLocationData.lon) {
        console.log('Koordinat ile hava durumu alınıyor...');
        weatherData = await this.fetchWeatherByCoordinates(
          this.currentLocationData.lat, 
          this.currentLocationData.lon
        );
      } else {
        console.log('İstanbul için varsayılan hava durumu alınıyor...');
        weatherData = await this.fetchWeatherByCity('Istanbul');
      }
      
      if (weatherData) {
        console.log('Hava durumu başarıyla alındı:', weatherData);
        this.updateWidget(weatherData);
        this.updateFavorites();
      } else {
        throw new Error('Hava durumu verisi boş');
      }
      
    } catch (error) {
      console.error('Weather data yüklenemedi:', error);
      this.showError('Hava durumu yüklenemedi: ' + error.message);
      
      // Fallback - basit widget göster
      this.showFallbackWidget();
    } finally {
      this.showLoading(false);
    }
  }

  showFallbackWidget() {
    try {
      // Basit fallback widget göster
      this.widget.querySelector('#location-name').textContent = 'İstanbul';
      this.widget.querySelector('#temperature').textContent = '--°';
      this.widget.querySelector('#temperature-mini').textContent = '--°';
      this.widget.querySelector('#description').textContent = 'Bağlantı hatası';
      this.widget.querySelector('#feels-like').textContent = 'Tekrar deneyin';
      this.widget.querySelector('#main-weather-icon').textContent = '🌤️';
    } catch (error) {
      console.error('Fallback widget gösterilemedi:', error);
    }
  }

  async fetchWeatherByCoordinates(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric&lang=tr`;
    
    try {
      console.log('API çağrısı:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 saniye timeout
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API yanıtı alındı:', data.name);
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Bağlantı zaman aşımı');
      }
      console.error('Koordinat API hatası:', error);
      throw error;
    }
  }

  async fetchWeatherByCity(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${this.API_KEY}&units=metric&lang=tr`;
    
    try {
      console.log('Şehir API çağrısı:', cityName);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Şehir bulunamadı');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Şehir API yanıtı:', data.name);
      
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Bağlantı zaman aşımı');
      }
      console.error('Şehir API hatası:', error);
      throw error;
    }
  }

  updateWidget(weatherData) {
    if (!weatherData || !this.widget) return;
    
    try {
      console.log('Widget güncelleniyor:', weatherData);
      
      // Ana bilgileri güncelle - yeni HTML yapısına uygun
      const locationElement = this.widget.querySelector('#location-name');
      if (locationElement) {
        locationElement.textContent = `📍 ${weatherData.name || 'Bilinmeyen'}`;
      }
      
      const tempElement = this.widget.querySelector('#temperature');
      if (tempElement) {
        tempElement.textContent = `${Math.round(weatherData.main.temp)}°`;
      }
      
      const conditionElement = this.widget.querySelector('#weather-condition');
      if (conditionElement) {
        conditionElement.textContent = weatherData.weather[0].description || '';
      }
      
      // Tarih güncelle
      const dateElement = this.widget.querySelector('#weather-date');
      if (dateElement) {
        const now = new Date();
        const options = { 
          weekday: 'long', 
          day: '2-digit', 
          month: 'long', 
          year: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
      }
      
      // Weather icon - API'den alınan icon kullan
      const weatherIconCode = weatherData.weather[0].icon;
      const weatherEmoji = this.getWeatherEmoji(weatherIconCode);
      
      // Main icon olarak emoji kullan
      const iconElement = this.widget.querySelector('#main-weather-icon');
      if (iconElement) {
        iconElement.textContent = weatherEmoji;
      }
      
      // Widget temasını hava durumuna göre ayarla
      this.updateWidgetTheme(weatherIconCode);
      
      console.log('✅ Widget başarıyla güncellendi');
      
    } catch (error) {
      console.error('❌ Widget güncellenemedi:', error);
    }
  }

  updateWidgetTheme(weatherIconCode) {
    if (!this.widget) return;
    
    // Mevcut tema sınıflarını temizle
    this.widget.classList.remove('sunny', 'partly-cloudy', 'cloudy', 'rainy', 'night', 'stormy');
    
    // Hava durumu koduna göre tema uygula
    if (weatherIconCode.includes('01')) {
      // Clear sky
      this.widget.classList.add('sunny');
    } else if (weatherIconCode.includes('02') || weatherIconCode.includes('03')) {
      // Few clouds / Scattered clouds
      this.widget.classList.add('partly-cloudy');
    } else if (weatherIconCode.includes('04')) {
      // Broken clouds
      this.widget.classList.add('cloudy');
    } else if (weatherIconCode.includes('09') || weatherIconCode.includes('10')) {
      // Rain
      this.widget.classList.add('rainy');
    } else if (weatherIconCode.includes('11')) {
      // Thunderstorm
      this.widget.classList.add('stormy');
    } else if (weatherIconCode.includes('n')) {
      // Night
      this.widget.classList.add('night');
    } else {
      // Default
      this.widget.classList.add('sunny');
    }
  }

  async updateFavorites() {
    const favoritesList = this.widget.querySelector('#favorites-list');
    if (!favoritesList) return;
    
    favoritesList.innerHTML = '';
    
    for (const favorite of this.favorites.slice(0, 3)) {
      try {
        // Her favori için hava durumu al
        const weatherData = await this.fetchWeatherByCity(favorite.name);
        
        const item = document.createElement('div');
        item.className = 'favorite-item';
        item.innerHTML = `
          <div class="fav-info">
            <span class="fav-icon">${weatherData ? this.getWeatherEmoji(weatherData.weather[0].icon) : '🌤️'}</span>
            <span class="fav-name">${favorite.name}</span>
          </div>
          <span class="fav-temp">${weatherData ? Math.round(weatherData.main.temp) : '--'}°</span>
        `;
        
        item.addEventListener('click', () => {
          this.switchToLocation(favorite);
        });
        
        favoritesList.appendChild(item);
        
      } catch (error) {
        console.error(`${favorite.name} için hava durumu alınamadı:`, error);
      }
    }
  }

  async switchToLocation(location) {
    try {
      this.showLoading(true);
      const weatherData = await this.fetchWeatherByCity(location.name);
      
      if (weatherData) {
        this.updateWidget(weatherData);
        
        // Şehir bilgisini kaydet
        await chrome.storage.local.set({
          currentLocation: {
            lat: weatherData.coord.lat,
            lon: weatherData.coord.lon,
            name: weatherData.name
          }
        });
      }
    } catch (error) {
      console.error('Şehir değiştirilemedi:', error);
    } finally {
      this.showLoading(false);
    }
  }

  async getCurrentLocation() {
    if (!navigator.geolocation) {
      this.showError('Konum servisi desteklenmiyor');
      return;
    }
    
    this.showLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await this.fetchWeatherByCoordinates(latitude, longitude);
          
          if (weatherData) {
            this.updateWidget(weatherData);
            
            // Konum bilgisini kaydet
            await chrome.storage.local.set({
              currentLocation: {
                lat: latitude,
                lon: longitude,
                name: weatherData.name
              }
            });
          }
        } catch (error) {
          this.showError('Konum hava durumu alınamadı');
        } finally {
          this.showLoading(false);
        }
      },
      (error) => {
        this.showLoading(false);
        this.showError('Konum izni gerekli');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  getWeatherIcon(iconCode) {
    // OpenWeatherMap API'den icon URL'i al
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  getWeatherEmoji(iconCode) {
    // Fallback emoji'ler
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '🌨️', '13n': '🌨️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const content = this.widget.querySelector('#widget-content');
    const minimizeIcon = this.widget.querySelector('.minimize-icon');
    
    if (this.isMinimized) {
      content.style.display = 'none';
      minimizeIcon.textContent = '+';
      this.widget.classList.add('minimized');
    } else {
      content.style.display = 'block';
      minimizeIcon.textContent = '−';
      this.widget.classList.remove('minimized');
    }
  }

  showLoading(show) {
    const loading = this.widget.querySelector('#widget-loading');
    const currentWeather = this.widget.querySelector('#current-weather');
    
    if (show) {
      loading.style.display = 'flex';
      currentWeather.style.opacity = '0.5';
    } else {
      loading.style.display = 'none';
      currentWeather.style.opacity = '1';
    }
  }

  showError(message) {
    const errorElement = this.widget.querySelector('#error-message');
    const errorText = this.widget.querySelector('.error-text');
    
    errorText.textContent = message;
    errorElement.style.display = 'flex';
    
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }

  hideError() {
    const errorElement = this.widget.querySelector('#error-message');
    errorElement.style.display = 'none';
  }

  hideWidget() {
    console.log('❌ Widget gizleniyor...');
    if (this.widget) {
      this.widget.style.display = 'none';
      this.isVisible = false;
    }
  }

  showWidget() {
    console.log('✅ Widget gösteriliyor...');
    if (this.widget) {
      this.widget.style.display = 'block';
      this.isVisible = true;
    } else {
      console.log('Widget mevcut değil, yeniden oluşturuluyor...');
      this.createWidget();
      this.loadWeatherData();
      this.isVisible = true;
    }
  }

  handleStorageChange(changes) {
    console.log('🔄 Storage değişikliği algılandı:', changes);
    
    if (changes.widgetSettings) {
      const newSettings = changes.widgetSettings.newValue;
      const oldSettings = this.settings;
      
      console.log('Eski ayarlar:', oldSettings);
      console.log('Yeni ayarlar:', newSettings);
      
      if (newSettings.enabled && !oldSettings.enabled) {
        // Widget etkinleştirildi
        console.log('✅ Widget etkinleştiriliyor...');
        this.settings = newSettings;
        this.showWidget();
      } else if (!newSettings.enabled && oldSettings.enabled) {
        // Widget devre dışı bırakıldı
        console.log('❌ Widget devre dışı bırakılıyor...');
        this.settings = newSettings;
        this.hideWidget();
      } else if (newSettings.enabled) {
        // Ayarlar güncellendi
        console.log('🔧 Widget ayarları güncelleniyor...');
        this.settings = newSettings;
        this.updateWidgetSettings();
      }
      
      this.settings = newSettings; // Her durumda ayarları güncelle
    }
    
    if (changes.favorites) {
      console.log('⭐ Favoriler güncelleniyor...');
      this.favorites = changes.favorites.newValue || [];
      this.updateFavorites();
    }
  }

  updateWidgetSettings() {
    if (!this.widget) {
      console.log('❌ Widget mevcut değil, ayarlar uygulanamıyor');
      return;
    }
    
    console.log('🔧 Widget ayarları uygulanıyor...', this.settings);
    
    // Pozisyon ayarla
    this.setPosition();
    
    // Şeffaflık ayarla
    this.setTransparency();
    
    // Boyut ayarla
    this.setSizeStyle();
    
    // Tema ayarla  
    this.setThemeStyle();
    
    // Animasyonları ayarla
    if (this.settings.animationsEnabled) {
      this.widget.classList.add('animated');
    } else {
      this.widget.classList.remove('animated');
    }
    
    console.log('✅ Widget ayarları başarıyla uygulandı');
  }
  
  setSizeStyle() {
    // Boyut ayarlarını uygula
    this.widget.classList.remove('small', 'medium', 'large');
    this.widget.classList.add(this.settings.size);
    
    // CSS boyut değerleri
    const sizeStyles = {
      'small': {
        minWidth: '260px',
        height: '100px',
        fontSize: '12px'
      },
      'medium': {
        minWidth: '320px', 
        height: '120px',
        fontSize: '14px'
      },
      'large': {
        minWidth: '380px',
        height: '140px', 
        fontSize: '16px'
      }
    };
    
    const style = sizeStyles[this.settings.size] || sizeStyles['medium']; 
    Object.assign(this.widget.style, style);
  }
  
  setThemeStyle() {
    // Tema sınıflarını temizle
    this.widget.classList.remove('light', 'dark', 'blue', 'green');
    this.widget.classList.add(this.settings.theme);
    
    // Tema renklerini uygula
    const themeStyles = {
      'light': {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        color: '#212529'
      },
      'dark': {
        background: 'linear-gradient(135deg, #343a40 0%, #495057 100%)', 
        color: '#f8f9fa'
      },
      'blue': {
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        color: '#ffffff'
      },
      'green': {
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        color: '#ffffff'
      }
    };
    
    const themeStyle = themeStyles[this.settings.theme] || themeStyles['blue'];
    Object.assign(this.widget.style, themeStyle);
  }

  setupAutoHide() {
    if (!this.settings.autoHide) return;
    
    let hideTimeout;
    
    const showWidget = () => {
      this.widget.style.opacity = this.settings.transparency;
      clearTimeout(hideTimeout);
    };
    
    const hideWidgetPartially = () => {
      hideTimeout = setTimeout(() => {
        this.widget.style.opacity = '0.3';
      }, 3000);
    };
    
    this.widget.addEventListener('mouseenter', showWidget);
    this.widget.addEventListener('mouseleave', hideWidgetPartially);
    
    // İlk başta kısmen gizle
    hideWidgetPartially();
  }

  removeAutoHide() {
    if (this.widget) {
      this.widget.style.opacity = this.settings.transparency;
    }
  }
    
    console.log('✅ Widget ayarları başarıyla uygulandı');
    
    if (detailsElement) {
      detailsElement.style.display = this.settings.showDetails ? 'flex' : 'none';
    }
    
    if (favoritesElement) {
      favoritesElement.style.display = this.settings.showFavorites ? 'block' : 'none';
    }
    
    // Auto-hide
    if (this.settings.autoHide) {
      this.setupAutoHide();
    }
  }

  savePosition() {
    // Pozisyon kaydetme işlevi - gelecekte kullanılabilir
  }

  startAutoUpdate() {
    // Otomatik güncelleme
    setInterval(() => {
      if (this.settings.enabled && this.widget && this.widget.style.display !== 'none') {
        this.loadWeatherData();
      }
    }, this.settings.updateInterval);
  }

  // Hata durumunda minimal widget oluştur
  createMinimalWidget() {
    try {
      console.log('🔧 Minimal widget oluşturuluyor...');
      
      this.widget = document.createElement('div');
      this.widget.id = 'weather-widget-extension';
      this.widget.className = 'weather-widget medium light';
      this.widget.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border-radius: 12px !important;
        padding: 16px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        font-size: 14px !important;
        color: #333 !important;
        min-width: 250px !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      `;
      
      this.widget.innerHTML = `
        <div style="text-align: center; position: relative;">
          <div style="font-size: 32px; margin-bottom: 8px;">🌤️</div>
          <div style="font-weight: 600; margin-bottom: 4px; font-size: 16px;">Weather Widget</div>
          <div style="font-size: 13px; color: #666; margin-bottom: 8px;">Extension aktif ve çalışıyor</div>
          <div style="font-size: 12px; color: #888;">Hava durumu yükleniyor...</div>
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="position: absolute; top: -8px; right: -8px; background: #ff4444; color: white; border: none; 
                         border-radius: 50%; width: 24px; height: 24px; font-size: 14px; cursor: pointer; 
                         display: flex; align-items: center; justify-content: center;">×</button>
        </div>
      `;
      
      document.body.appendChild(this.widget);
      console.log('✅ Minimal widget DOM\'a eklendi');
      
      document.body.appendChild(this.widget);
      console.log('✅ Minimal widget DOM\'a eklendi');
      
      // Basit hava durumu yükle
      this.loadSimpleWeather();
      
    } catch (error) {
      console.error('❌ Minimal widget oluşturulamadı:', error);
    }
  }

  async loadSimpleWeather() {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Istanbul&appid=${this.API_KEY}&units=metric&lang=tr`);
      const data = await response.json();
      
      if (this.widget) {
        const tempElement = this.widget.querySelector('div:last-child');
        tempElement.textContent = `${Math.round(data.main.temp)}°C - ${data.weather[0].description}`;
      }
    } catch (error) {
      console.error('Basit hava durumu yüklenemedi:', error);
    }
  }
}

// Widget'ı başlat
function initializeWeatherWidget() {
  try {
    console.log('initializeWeatherWidget çalışıyor...');
    
    // Widget'ın zaten var olup olmadığını kontrol et
    if (document.getElementById('weather-widget-extension')) {
      console.log('Weather widget zaten mevcut');
      return;
    }
    
    console.log('Document ready state:', document.readyState);
    
    // Document ready kontrolü
    if (document.readyState === 'loading') {
      console.log('Document hala yükleniyor, DOMContentLoaded bekleniyor...');
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded tetiklendi');
        setTimeout(() => {
          console.log('WeatherWidget oluşturuluyor...');
          window.weatherWidgetInstance = new WeatherWidget();
        }, 1000);
      });
    } else {
      // Sayfa zaten yüklenmiş, widget'ı başlat
      console.log('Document zaten hazır, widget oluşturuluyor...');
      setTimeout(() => {
        console.log('WeatherWidget oluşturuluyor...');
        window.weatherWidgetInstance = new WeatherWidget();
      }, 1000);
    }
  } catch (error) {
    console.error('Weather Widget başlatılamadı:', error);
  }
}

// Chrome runtime messages dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    console.log('📨 Content script mesaj aldı:', request);
    
    if (request.action === 'checkWidget') {
      const widgetExists = document.getElementById('weather-widget-extension');
      sendResponse({
        exists: !!widgetExists,
        status: widgetExists ? 'active' : 'not found'
      });
    }
    
    if (request.action === 'settingsUpdated') {
      console.log('⚙️ Ayarlar güncellendi mesajı alındı:', request.settings);
      
      // Global widget instance'ını bul
      const widgetElement = document.getElementById('weather-widget-extension');
      if (widgetElement && window.weatherWidgetInstance) {
        window.weatherWidgetInstance.handleStorageChange({
          widgetSettings: {
            newValue: request.settings,
            oldValue: window.weatherWidgetInstance.settings
          }
        });
      } else {
        console.log('Widget instance bulunamadı, yeniden başlatılıyor...');
        initializeWeatherWidget();
      }
      
      sendResponse({ success: true });
    }
    
  } catch (error) {
    console.error('Message handler hatası:', error);
    sendResponse({ error: error.message });
  }
});

// Initialize
initializeWeatherWidget();
