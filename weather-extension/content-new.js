// Weather Widget Extension - Content Script
console.log('🌤️ Weather Widget Extension Content Script yüklendi');

class WeatherWidget {
  constructor() {
    this.widget = null;
    this.isVisible = false;
    this.settings = {
      enabled: true,
      position: 'top-right',
      size: 'medium',
      theme: 'blue',
      transparency: 0.95,
      animationsEnabled: true,
      autoHide: false,
      showDetails: true,
      refreshInterval: 300000 // 5 dakika
    };
    this.currentLocationData = null;
    this.favorites = [];
    this.apiKey = '1ab5083c1ad45e73e3a6fecc3f343f32';
    
    this.init();
  }

  async init() {
    try {
      console.log('🚀 WeatherWidget başlatılıyor...');
      
      // Ayarları yükle
      await this.loadSettings();
      
      // Storage değişikliklerini dinle
      chrome.storage.onChanged.addListener((changes) => {
        this.handleStorageChange(changes);
      });
      
      // Widget'ı oluştur
      if (this.settings.enabled) {
        this.createWidget();
        this.loadWeatherData();
        this.startAutoUpdate();
      }
      
      console.log('✅ WeatherWidget başarıyla başlatıldı');
      
    } catch (error) {
      console.error('❌ WeatherWidget başlatılamadı:', error);
    }
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.local.get(['widgetSettings', 'favorites']);
      
      if (result.widgetSettings) {
        this.settings = { ...this.settings, ...result.widgetSettings };
        console.log('⚙️ Ayarlar yüklendi:', this.settings);
      }
      
      if (result.favorites) {
        this.favorites = result.favorites;
        console.log('⭐ Favoriler yüklendi:', this.favorites);
      }
      
    } catch (error) {
      console.error('❌ Ayarlar yüklenemedi:', error);
    }
  }

  createWidget() {
    console.log('🏗️ Widget oluşturuluyor...');
    
    // Mevcut widget'ı kaldır
    this.removeWidget();
    
    // Widget container
    this.widget = document.createElement('div');
    this.widget.id = 'weather-widget-extension';
    this.widget.className = `weather-widget ${this.settings.size} ${this.settings.theme}`;
    
    // HTML yapısı - yatay tasarım
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
    document.body.appendChild(this.widget);
    
    // Ayarları uygula
    this.applySettings();
    
    // Event listener'ları ekle
    this.addEventListeners();
    
    // Draggable yap
    this.makeDraggable();
    
    this.isVisible = true;
    console.log('✅ Widget başarıyla oluşturuldu');
  }

  removeWidget() {
    const existingWidget = document.getElementById('weather-widget-extension');
    if (existingWidget) {
      existingWidget.remove();
      console.log('🗑️ Mevcut widget kaldırıldı');
    }
  }

  applySettings() {
    if (!this.widget) return;
    
    console.log('🔧 Widget ayarları uygulanıyor...', this.settings);
    
    // Pozisyon
    this.setPosition();
    
    // Şeffaflık
    this.setTransparency();
    
    // Boyut
    this.setSizeStyle();
    
    // Tema
    this.setThemeStyle();
    
    // Animasyonlar
    if (this.settings.animationsEnabled) {
      this.widget.classList.add('animated');
    } else {
      this.widget.classList.remove('animated');
    }
    
    // Auto-hide
    if (this.settings.autoHide) {
      this.setupAutoHide();
    }
    
    console.log('✅ Widget ayarları uygulandı');
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
  }

  setTransparency() {
    this.widget.style.opacity = this.settings.transparency;
  }

  setSizeStyle() {
    this.widget.classList.remove('small', 'medium', 'large');
    this.widget.classList.add(this.settings.size);
    
    const sizeStyles = {
      'small': { minWidth: '260px', height: '100px', fontSize: '12px' },
      'medium': { minWidth: '320px', height: '120px', fontSize: '14px' },
      'large': { minWidth: '380px', height: '140px', fontSize: '16px' }
    };
    
    const style = sizeStyles[this.settings.size] || sizeStyles['medium'];
    Object.assign(this.widget.style, style);
  }

  setThemeStyle() {
    this.widget.classList.remove('light', 'dark', 'blue', 'green');
    this.widget.classList.add(this.settings.theme);
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
    
    hideWidgetPartially();
  }

  addEventListeners() {
    // Refresh button
    const refreshBtn = this.widget.querySelector('#refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadWeatherData();
      });
    }
    
    // Close button
    const closeBtn = this.widget.querySelector('#close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideWidget();
      });
    }
  }

  makeDraggable() {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let initialPosition = { x: 0, y: 0 };
    
    const widget = this.widget;
    if (!widget) return;
    
    widget.addEventListener('mousedown', (e) => {
      if (e.target.closest('.widget-controls') || 
          e.target.closest('button')) return;
      
      e.preventDefault();
      isDragging = true;
      
      const rect = widget.getBoundingClientRect();
      dragOffset.x = e.clientX - rect.left;
      dragOffset.y = e.clientY - rect.top;
      initialPosition.x = rect.left;
      initialPosition.y = rect.top;
      
      widget.classList.add('dragging');
      widget.style.cursor = 'grabbing';
      widget.style.transition = 'none';
      
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
      document.body.style.userSelect = 'none';
    });
    
    const handleDrag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      const x = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x));
      const y = Math.max(0, Math.min(maxY, e.clientY - dragOffset.y));
      
      widget.style.transform = `translate(${x - initialPosition.x}px, ${y - initialPosition.y}px)`;
    };
    
    const stopDrag = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
      
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
      widget.style.cursor = 'grab';
      widget.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      document.body.style.userSelect = '';
      
      this.savePosition();
    };
    
    widget.style.cursor = 'grab';
  }

  async loadWeatherData() {
    try {
      console.log('🌤️ Hava durumu verisi yükleniyor...');
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Istanbul&appid=${this.apiKey}&units=metric&lang=tr`
      );
      
      if (!response.ok) {
        throw new Error(`API Hatası: ${response.status}`);
      }
      
      const weatherData = await response.json();
      console.log('✅ Hava durumu verisi alındı:', weatherData);
      
      this.updateWidget(weatherData);
      
    } catch (error) {
      console.error('❌ Hava durumu yüklenemedi:', error);
      this.showError(error.message);
    }
  }

  updateWidget(weatherData) {
    if (!weatherData || !this.widget) return;
    
    try {
      console.log('🔄 Widget güncelleniyor...', weatherData);
      
      // Lokasyon
      const locationElement = this.widget.querySelector('#location-name');
      if (locationElement) {
        locationElement.textContent = `📍 ${weatherData.name || 'Bilinmeyen'}`;
      }
      
      // Sıcaklık
      const tempElement = this.widget.querySelector('#temperature');
      if (tempElement) {
        tempElement.textContent = `${Math.round(weatherData.main.temp)}°`;
      }
      
      // Durum
      const conditionElement = this.widget.querySelector('#weather-condition');
      if (conditionElement) {
        conditionElement.textContent = weatherData.weather[0].description || '';
      }
      
      // Tarih
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
      
      // İkon
      const weatherIconCode = weatherData.weather[0].icon;
      const weatherEmoji = this.getWeatherEmoji(weatherIconCode);
      
      const iconElement = this.widget.querySelector('#main-weather-icon');
      if (iconElement) {
        iconElement.textContent = weatherEmoji;
      }
      
      // Tema güncelle
      this.updateWidgetTheme(weatherIconCode);
      
      console.log('✅ Widget başarıyla güncellendi');
      
    } catch (error) {
      console.error('❌ Widget güncellenemedi:', error);
    }
  }

  getWeatherEmoji(iconCode) {
    const emojiMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    
    return emojiMap[iconCode] || '🌤️';
  }

  updateWidgetTheme(weatherIconCode) {
    if (!this.widget) return;
    
    this.widget.classList.remove('sunny', 'partly-cloudy', 'cloudy', 'rainy', 'night', 'stormy');
    
    if (weatherIconCode.includes('01')) {
      this.widget.classList.add('sunny');
    } else if (weatherIconCode.includes('02')) {
      this.widget.classList.add('partly-cloudy');
    } else if (weatherIconCode.includes('03') || weatherIconCode.includes('04')) {
      this.widget.classList.add('cloudy');
    } else if (weatherIconCode.includes('09') || weatherIconCode.includes('10')) {
      this.widget.classList.add('rainy');
    } else if (weatherIconCode.includes('11')) {
      this.widget.classList.add('stormy');
    } else if (weatherIconCode.includes('n')) {
      this.widget.classList.add('night');
    }
  }

  showError(message) {
    console.error('⚠️ Hata gösteriliyor:', message);
    
    const conditionElement = this.widget.querySelector('#weather-condition');
    if (conditionElement) {
      conditionElement.textContent = 'Hava durumu yüklenemedi';
    }
    
    const tempElement = this.widget.querySelector('#temperature');
    if (tempElement) {
      tempElement.textContent = '--°';
    }
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
      
      this.settings = newSettings;
      
      if (newSettings.enabled && !oldSettings.enabled) {
        console.log('✅ Widget etkinleştiriliyor...');
        this.showWidget();
      } else if (!newSettings.enabled && oldSettings.enabled) {
        console.log('❌ Widget devre dışı bırakılıyor...');
        this.hideWidget();
      } else if (newSettings.enabled) {
        console.log('🔧 Widget ayarları güncelleniyor...');
        this.applySettings();
      }
    }
    
    if (changes.favorites) {
      console.log('⭐ Favoriler güncelleniyor...');
      this.favorites = changes.favorites.newValue || [];
    }
  }

  savePosition() {
    if (!this.widget) return;
    
    const rect = this.widget.getBoundingClientRect();
    const position = {
      left: rect.left,
      top: rect.top
    };
    
    chrome.storage.local.set({ widgetPosition: position });
    console.log('💾 Widget pozisyonu kaydedildi:', position);
  }

  startAutoUpdate() {
    // Her 5 dakikada bir otomatik güncelle
    setInterval(() => {
      if (this.isVisible && this.settings.enabled) {
        console.log('🔄 Otomatik hava durumu güncellemesi...');
        this.loadWeatherData();
      }
    }, this.settings.refreshInterval);
  }
}

// Widget'ı başlat
let weatherWidget;

// Sayfa yüklendiğinde widget'ı oluştur
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    weatherWidget = new WeatherWidget();
    window.weatherWidget = weatherWidget; // Global erişim için
  });
} else {
  weatherWidget = new WeatherWidget();
  window.weatherWidget = weatherWidget; // Global erişim için
}

console.log('🌤️ Weather Widget Content Script yüklendi');
