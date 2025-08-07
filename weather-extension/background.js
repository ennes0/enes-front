// Weather Extension Background Script (Service Worker)
class WeatherService {
  constructor() {
    this.API_KEY = "1ab5083c1ad45e73e3a6fecc3f343f32";
    this.BASE_URL = "https://api.openweathermap.org/data/2.5";
    this.cache = new Map();
    this.setupMessageListener();
    this.setupStorageDefaults();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'getWeatherData':
          this.getWeatherData(request.location)
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
          return true; // Async response

        case 'getForecastData':
          this.getForecastData(request.location)
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }));
          return true; // Async response

        case 'openPopup':
          chrome.action.openPopup();
          break;

        case 'updateSettings':
          this.updateSettings(request.settings)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
          return true;

        case 'getFavorites':
          this.getFavorites()
            .then(favorites => sendResponse({ success: true, favorites }))
            .catch(error => sendResponse({ success: false, error: error.message }));
          return true;

        case 'addToFavorites':
          this.addToFavorites(request.city)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
          return true;

        case 'removeFromFavorites':
          this.removeFromFavorites(request.cityId)
            .then(() => sendResponse({ success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
          return true;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    });
  }

  async setupStorageDefaults() {
    try {
      const result = await chrome.storage.local.get(['widgetSettings', 'favorites']);
      
      if (!result.widgetSettings) {
        await chrome.storage.local.set({
          widgetSettings: {
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
          }
        });
      }

      if (!result.favorites) {
        await chrome.storage.local.set({
          favorites: [
            { name: 'İstanbul', id: '745044', temp: null, icon: null },
            { name: 'Ankara', id: '323786', temp: null, icon: null },
            { name: 'İzmir', id: '311044', temp: null, icon: null }
          ]
        });
      }
    } catch (error) {
      console.error('Storage varsayılanları ayarlanamadı:', error);
    }
  }

  async getWeatherData(location) {
    // Basit cache key
    const cacheKey = location.city || `${location.lat}_${location.lon}` || 'default';
    const cached = this.cache.get(cacheKey);
    
    // Cache kontrolü (5 dakika)
    if (cached && Date.now() - cached.timestamp < 300000) {
      console.log('Cache\'den veri alındı:', cacheKey);
      return cached.data;
    }

    try {
      let url;
      if (location.lat && location.lon) {
        url = `${this.BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${this.API_KEY}&units=metric&lang=tr`;
      } else if (location.city) {
        url = `${this.BASE_URL}/weather?q=${encodeURIComponent(location.city)}&appid=${this.API_KEY}&units=metric&lang=tr`;
      } else {
        // Fallback olarak İstanbul kullan
        url = `${this.BASE_URL}/weather?q=Istanbul&appid=${this.API_KEY}&units=metric&lang=tr`;
      }

      console.log('Background API çağrısı:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 saniye
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Weather Widget Extension'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API anahtarı geçersiz');
        } else if (response.status === 404) {
          throw new Error('Şehir bulunamadı');
        } else if (response.status === 429) {
          throw new Error('API limit aşıldı');
        }
        throw new Error(`API Hatası: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Background API başarılı:', data.name);
      
      const processedData = {
        current: {
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          wind_speed: data.wind.speed,
          wind_deg: data.wind.deg || 0,
          description: data.weather[0].description,
          weather: data.weather
        },
        location: {
          name: data.name,
          country: data.sys.country,
          lat: data.coord.lat,
          lon: data.coord.lon
        },
        timestamp: Date.now()
      };
      
      // Cache'e kaydet
      this.cache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });
      
      // Extension icon'unu güncelle
      this.updateExtensionIcon(processedData);
      
      return processedData;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('API bağlantı zaman aşımı');
      }
      console.error('Background API hatası:', error);
      throw new Error(`Hava durumu verisi alınamadı: ${error.message}`);
    }
  }

  async getForecastData(location) {
    // Basit cache key
    const cacheKey = `forecast_${location.city || `${location.lat}_${location.lon}` || 'default'}`;
    const cached = this.cache.get(cacheKey);
    
    // Cache kontrolü (10 dakika)
    if (cached && Date.now() - cached.timestamp < 600000) {
      console.log('Forecast cache\'den alındı:', cacheKey);
      return cached.data;
    }

    try {
      let url;
      if (location.lat && location.lon) {
        url = `${this.BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${this.API_KEY}&units=metric&lang=tr`;
      } else if (location.city) {
        url = `${this.BASE_URL}/forecast?q=${encodeURIComponent(location.city)}&appid=${this.API_KEY}&units=metric&lang=tr`;
      } else {
        // Fallback olarak İstanbul kullan
        url = `${this.BASE_URL}/forecast?q=Istanbul&appid=${this.API_KEY}&units=metric&lang=tr`;
      }

      console.log('Background Forecast çağrısı:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 saniye
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Weather Widget Extension'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('API anahtarı geçersiz');
        } else if (response.status === 404) {
          throw new Error('Şehir bulunamadı');
        } else if (response.status === 429) {
          throw new Error('API limit aşıldı');
        }
        throw new Error(`Forecast API Hatası: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Background Forecast başarılı:', data.city.name);
      
      // 5 günlük tahmin (günde 1 veri)
      const dailyForecasts = [];
      const processedDates = new Set();
      
      for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        // Her günden sadece 1 veri al (öğleden sonra verileri tercih et)
        if (!processedDates.has(dateString) && date.getHours() >= 12) {
          processedDates.add(dateString);
          dailyForecasts.push({
            date: item.dt,
            temp: {
              day: item.main.temp,
              min: item.main.temp_min,
              max: item.main.temp_max
            },
            weather: item.weather[0],
            humidity: item.main.humidity,
            wind_speed: item.wind.speed
          });
          
          if (dailyForecasts.length >= 5) break;
        }
      }
      
      const processedData = {
        city: {
          name: data.city.name,
          country: data.city.country,
          coord: data.city.coord
        },
        daily: dailyForecasts,
        timestamp: Date.now()
      };
      
      // Cache'e kaydet
      this.cache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });
      
      return processedData;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Forecast API bağlantı zaman aşımı');
      }
      console.error('Background Forecast hatası:', error);
      throw new Error(`5 günlük tahmin verisi alınamadı: ${error.message}`);
    }
  }

  async updateSettings(newSettings) {
    try {
      const currentSettings = await chrome.storage.local.get(['widgetSettings']);
      const updatedSettings = {
        ...currentSettings.widgetSettings,
        ...newSettings
      };
      
      await chrome.storage.local.set({
        widgetSettings: updatedSettings
      });
      
      return updatedSettings;
    } catch (error) {
      throw new Error('Ayarlar güncellenemedi');
    }
  }

  async getFavorites() {
    try {
      const result = await chrome.storage.local.get(['favorites']);
      return result.favorites || [];
    } catch (error) {
      throw new Error('Favoriler alınamadı');
    }
  }

  async addToFavorites(city) {
    try {
      const favorites = await this.getFavorites();
      
      // Zaten favorilerde mi kontrol et
      const exists = favorites.some(fav => fav.name.toLowerCase() === city.name.toLowerCase());
      if (exists) {
        throw new Error('Bu şehir zaten favorilerde');
      }
      
      favorites.push({
        name: city.name,
        id: city.id || Date.now().toString(),
        temp: city.temp || null,
        icon: city.icon || null
      });
      
      await chrome.storage.local.set({ favorites });
      return favorites;
    } catch (error) {
      throw new Error(`Favorilere eklenemedi: ${error.message}`);
    }
  }

  async removeFromFavorites(cityId) {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== cityId);
      
      await chrome.storage.local.set({ favorites: updatedFavorites });
      return updatedFavorites;
    } catch (error) {
      throw new Error('Favorilerden çıkarılamadı');
    }
  }

  // Geocoding servisi
  async geocodeCity(cityName) {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Geocoding API hatası');
      }
      
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('Şehir bulunamadı');
      }
      
      return {
        lat: data[0].lat,
        lon: data[0].lon,
        name: data[0].name,
        country: data[0].country
      };
    } catch (error) {
      throw new Error(`Şehir konumu bulunamadı: ${error.message}`);
    }
  }

  // Weather icon URL'i alma
  getWeatherIconUrl(iconCode, size = '2x') {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  }

  // Extension icon güncelleme
  async updateExtensionIcon(weatherData) {
    try {
      if (weatherData && weatherData.current && weatherData.current.weather) {
        const iconCode = weatherData.current.weather[0].icon;
        const iconUrl = this.getWeatherIconUrl(iconCode, '4x');
        
        // Browser action icon'unu güncelle
        chrome.action.setIcon({
          path: iconUrl
        });
        
        // Badge ile sıcaklık göster
        const temp = Math.round(weatherData.current.temp);
        chrome.action.setBadgeText({
          text: `${temp}°`
        });
        
        chrome.action.setBadgeBackgroundColor({
          color: '#3b82f6'
        });
      }
    } catch (error) {
      console.log('Extension icon güncellenemedi:', error);
    }
  }

  // Default icon ayarlama
  setDefaultIcon() {
    try {
      // Default weather icon URL'i
      const defaultIconUrl = 'https://openweathermap.org/img/wn/01d@2x.png';
      
      chrome.action.setIcon({
        path: defaultIconUrl
      });
      
      chrome.action.setBadgeText({
        text: ''
      });
      
      chrome.action.setTitle({
        title: 'Weather Widget - Hava durumu için tıklayın'
      });
    } catch (error) {
      console.log('Default icon ayarlanamadı:', error);
    }
  }

  // Hava durumu uyarıları (gelecekte kullanım için)
  async getWeatherAlerts(lat, lon) {
    try {
      const url = `${this.BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&exclude=minutely,daily`;
      const response = await fetch(url);
      
      if (!response.ok) {
        return null; // Uyarı servisi çalışmıyorsa sessizce geç
      }
      
      const data = await response.json();
      return data.alerts || [];
    } catch (error) {
      console.log('Uyarı servisi kullanılamıyor:', error.message);
      return [];
    }
  }

  // Cache temizleme
  clearCache() {
    this.cache.clear();
  }
}

// Service'i başlat
const weatherService = new WeatherService();

// Extension lifecycle events
chrome.runtime.onStartup.addListener(() => {
  console.log('Weather Widget Extension başlatıldı');
  
  // Default icon ayarla
  if (weatherService) {
    weatherService.setDefaultIcon();
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Weather Widget Extension yüklendi');
    
    // Default icon ayarla
    if (weatherService) {
      weatherService.setDefaultIcon();
    }
    
    // İlk kurulum bildirimi
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'https://openweathermap.org/img/wn/01d@2x.png',
      title: 'Weather Widget',
      message: 'Weather Widget başarıyla yüklendi! Her sayfada hava durumunu görebilirsiniz.'
    });
  } else if (details.reason === 'update') {
    console.log('Weather Widget Extension güncellendi');
    if (weatherService) {
      weatherService.setDefaultIcon();
    }
  }
});

// Alarm API ile periyodik güncelleme (opsiyonel)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'weatherUpdate') {
    // Cache'i temizle ki yeni veri alınsın
    weatherService.clearCache();
  }
});

// Her 30 dakikada bir cache'i temizle
chrome.alarms.create('weatherUpdate', {
  delayInMinutes: 30,
  periodInMinutes: 30
});

// Tab değişikliklerini dinle (gelecekte kullanım için)
chrome.tabs.onActivated.addListener((activeInfo) => {
  // Aktif tab değiştiğinde widget'ı güncelleyebiliriz
});

// Network durumu değişikliklerini dinle
chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.frameId === 0) { // Ana frame
    // Sayfa yüklendiğinde widget'ın doğru çalıştığından emin ol
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Weather Extension Service Worker Hatası:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Weather Extension Promise Hatası:', event.reason);
});
