// Weather Widget Extension - Popup Script
class PopupManager {
  constructor() {
    this.settings = {};
    this.favorites = [];
    this.init();
  }

  async init() {
    try {
      console.log('Popup init başlıyor...');
      this.showLoading(true);
      
      // Timeout ile loading'i zorla durdur
      const timeoutId = setTimeout(() => {
        console.log('Popup loading timeout - zorla durduruldu');
        this.showLoading(false);
        this.loadDefaultSettings();
      }, 3000);
      
      await this.loadSettings();
      await this.loadFavorites();
      this.setupEventListeners();
      this.updateUI();
      
      clearTimeout(timeoutId);
      this.showLoading(false);
      
      console.log('Popup başarıyla yüklendi');
    } catch (error) {
      console.error('Popup başlatılamadı:', error);
      this.showLoading(false);
      this.loadDefaultSettings();
      this.setupEventListeners();
      this.updateUI();
    }
  }

  async loadSettings() {
    try {
      console.log('Settings yükleniyor...');
      
      // Direct chrome.storage.local kullan
      const result = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Storage timeout')), 2000);
        
        chrome.storage.local.get(['widgetSettings'], (result) => {
          clearTimeout(timeout);
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
      
      this.settings = result.widgetSettings || this.getDefaultSettings();
      console.log('Settings başarıyla yüklendi:', this.settings);
      
    } catch (error) {
      console.error('Settings yüklenemedi:', error);
      this.settings = this.getDefaultSettings();
    }
  }

  async loadFavorites() {
    try {
      console.log('Favoriler yükleniyor...');
      
      // Direct chrome.storage.local kullan
      const result = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Favorites timeout')), 2000);
        
        chrome.storage.local.get(['favorites'], (result) => {
          clearTimeout(timeout);
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result);
          }
        });
      });
      
      this.favorites = result.favorites || [
        { name: 'İstanbul', id: '745044', temp: null, icon: null },
        { name: 'Ankara', id: '323786', temp: null, icon: null },
        { name: 'İzmir', id: '311044', temp: null, icon: null }
      ];
      
      console.log('Favoriler başarıyla yüklendi:', this.favorites.length);
      
    } catch (error) {
      console.error('Favoriler yüklenemedi:', error);
      this.favorites = [
        { name: 'İstanbul', id: '745044', temp: null, icon: null },
        { name: 'Ankara', id: '323786', temp: null, icon: null },
        { name: 'İzmir', id: '311044', temp: null, icon: null }
      ];
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
      updateInterval: 300000,
      theme: 'light',
      showFavorites: true,
      showDetails: true,
      animationsEnabled: true
    };
  }

  loadDefaultSettings() {
    console.log('Default ayarlar yükleniyor...');
    this.settings = this.getDefaultSettings();
    this.favorites = [
      { name: 'İstanbul', id: '745044', temp: null, icon: null },
      { name: 'Ankara', id: '323786', temp: null, icon: null },
      { name: 'İzmir', id: '311044', temp: null, icon: null }
    ];
  }

  setupEventListeners() {
    // Toggle switches
    this.setupToggle('toggleEnabled', 'enabled');
    this.setupToggle('toggleAutoHide', 'autoHide');
    this.setupToggle('toggleAnimations', 'animationsEnabled');
    this.setupToggle('toggleDetails', 'showDetails');
    this.setupToggle('toggleFavorites', 'showFavorites');

    // Select dropdowns
    this.setupSelect('selectPosition', 'position');
    this.setupSelect('selectSize', 'size');
    this.setupSelect('selectTheme', 'theme');

    // Range slider
    this.setupRange('rangeTransparency', 'transparency');

    // Add city form
    const addCityBtn = document.getElementById('addCityBtn');
    const cityInput = document.getElementById('cityInput');

    addCityBtn.addEventListener('click', () => this.addCity());
    cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addCity();
      }
    });

    cityInput.addEventListener('input', (e) => {
      const isEmpty = e.target.value.trim() === '';
      addCityBtn.disabled = isEmpty;
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', () => this.saveSettings());

    // Auto-save on change
    this.setupAutoSave();
  }

  setupToggle(elementId, settingKey) {
    const toggle = document.getElementById(elementId);
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isActive = toggle.classList.contains('active');
      if (isActive) {
        toggle.classList.remove('active');
        this.settings[settingKey] = false;
      } else {
        toggle.classList.add('active');
        this.settings[settingKey] = true;
      }
      this.autoSave();
    });
  }

  setupSelect(elementId, settingKey) {
    const select = document.getElementById(elementId);
    if (!select) return;

    select.addEventListener('change', (e) => {
      this.settings[settingKey] = e.target.value;
      this.autoSave();
    });
  }

  setupRange(elementId, settingKey) {
    const range = document.getElementById(elementId);
    const valueDisplay = document.getElementById('transparencyValue');
    if (!range || !valueDisplay) return;

    range.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.settings[settingKey] = value;
      valueDisplay.textContent = `${Math.round(value * 100)}%`;
      this.autoSave();
    });
  }

  setupAutoSave() {
    // Debounced auto-save
    this.autoSaveTimeout = null;
  }

  autoSave() {
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.saveSettings(false); // false = silent save
    }, 500);
  }

  updateUI() {
    // Update toggles
    this.updateToggle('toggleEnabled', this.settings.enabled);
    this.updateToggle('toggleAutoHide', this.settings.autoHide);
    this.updateToggle('toggleAnimations', this.settings.animationsEnabled);
    this.updateToggle('toggleDetails', this.settings.showDetails);
    this.updateToggle('toggleFavorites', this.settings.showFavorites);

    // Update selects
    this.updateSelect('selectPosition', this.settings.position);
    this.updateSelect('selectSize', this.settings.size);
    this.updateSelect('selectTheme', this.settings.theme);

    // Update range
    this.updateRange('rangeTransparency', this.settings.transparency);

    // Update favorites list
    this.updateFavoritesList();

    // Update add button state
    const cityInput = document.getElementById('cityInput');
    const addCityBtn = document.getElementById('addCityBtn');
    if (cityInput && addCityBtn) {
      addCityBtn.disabled = cityInput.value.trim() === '';
    }
  }

  updateToggle(elementId, value) {
    const toggle = document.getElementById(elementId);
    if (!toggle) return;

    if (value) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }

  updateSelect(elementId, value) {
    const select = document.getElementById(elementId);
    if (!select) return;

    select.value = value;
  }

  updateRange(elementId, value) {
    const range = document.getElementById(elementId);
    const valueDisplay = document.getElementById('transparencyValue');
    if (!range || !valueDisplay) return;

    range.value = value;
    valueDisplay.textContent = `${Math.round(value * 100)}%`;
  }

  updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;

    favoritesList.innerHTML = '';

    if (this.favorites.length === 0) {
      favoritesList.innerHTML = `
        <div style="text-align: center; color: #6b7280; font-size: 12px; padding: 20px;">
          Henüz favori şehir eklenmemiş
        </div>
      `;
      return;
    }

    this.favorites.forEach(favorite => {
      const item = document.createElement('div');
      item.className = 'favorite-item';
      item.innerHTML = `
        <div class="favorite-info">
          <span class="favorite-icon">${favorite.icon || '🌤️'}</span>
          <span class="favorite-name">${favorite.name}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="favorite-temp">${favorite.temp ? favorite.temp + '°' : '--°'}</span>
          <button class="remove-btn" onclick="popupManager.removeCity('${favorite.id}')">
            Çıkar
          </button>
        </div>
      `;
      favoritesList.appendChild(item);
    });
  }

  async addCity() {
    const cityInput = document.getElementById('cityInput');
    const addCityBtn = document.getElementById('addCityBtn');
    
    if (!cityInput || !addCityBtn) return;

    const cityName = cityInput.value.trim();
    if (!cityName) return;

    try {
      addCityBtn.disabled = true;
      addCityBtn.textContent = 'Ekleniyor...';

      // Şehri favorilere ekle
      const response = await chrome.runtime.sendMessage({
        action: 'addToFavorites',
        city: {
          name: cityName,
          id: Date.now().toString()
        }
      });

      if (response.success) {
        // Favorileri yeniden yükle
        await this.loadFavorites();
        this.updateFavoritesList();
        
        // Input'u temizle
        cityInput.value = '';
        
        this.showStatus('Şehir başarıyla eklendi!', 'success');
      } else {
        throw new Error(response.error);
      }

    } catch (error) {
      console.error('Şehir eklenemedi:', error);
      this.showStatus(error.message || 'Şehir eklenemedi', 'error');
    } finally {
      addCityBtn.disabled = false;
      addCityBtn.textContent = 'Ekle';
    }
  }

  async removeCity(cityId) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'removeFromFavorites',
        cityId: cityId
      });

      if (response.success) {
        // Favorileri yeniden yükle
        await this.loadFavorites();
        this.updateFavoritesList();
        
        this.showStatus('Şehir favorilerden çıkarıldı', 'success');
      } else {
        throw new Error(response.error);
      }

    } catch (error) {
      console.error('Şehir çıkarılamadı:', error);
      this.showStatus(error.message || 'Şehir çıkarılamadı', 'error');
    }
  }

  async saveSettings(showMessage = true) {
    try {
      console.log('💾 Ayarlar kaydediliyor...', this.settings);
      
      // Local storage'a kaydet
      await chrome.storage.local.set({
        widgetSettings: this.settings
      });

      // Background script'e bildir
      const response = await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: this.settings
      });

      // Tüm content script'lere ayar değişikliğini bildir
      try {
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          try {
            await chrome.tabs.sendMessage(tab.id, {
              action: 'settingsUpdated',
              settings: this.settings
            });
          } catch (e) {
            // Tab'da content script yoksa hata olabilir, normal
            console.log(`Tab ${tab.id} için mesaj gönderilemedi:`, e.message);
          }
        }
      } catch (e) {
        console.log('Content script\'lere mesaj gönderilirken hata:', e.message);
      }

      if (response && response.success && showMessage) {
        this.showStatus('Ayarlar kaydedildi!', 'success');
      } else if (showMessage) {
        this.showStatus('Ayarlar kaydedildi (kısmi)', 'success');
      }

    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
      if (showMessage) {
        this.showStatus('Ayarlar kaydedilemedi', 'error');
      }
    }
  }

  showStatus(message, type = 'success') {
    const statusElement = document.getElementById('statusMessage');
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = `status-message status-${type}`;
    statusElement.style.display = 'block';

    // 3 saniye sonra gizle
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);
  }

  showError(message) {
    this.showStatus(message, 'error');
  }

  showLoading(show) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    
    if (!loading || !content) return;

    if (show) {
      loading.style.display = 'block';
      content.style.display = 'none';
    } else {
      loading.style.display = 'none';
      content.style.display = 'block';
    }
  }

  // Keyboard shortcuts
  handleKeyboard(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 's':
          event.preventDefault();
          this.saveSettings();
          break;
        case 'r':
          event.preventDefault();
          location.reload();
          break;
      }
    }

    if (event.key === 'Escape') {
      window.close();
    }
  }
}

// Global instance
let popupManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  popupManager = new PopupManager();
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  if (popupManager) {
    popupManager.handleKeyboard(event);
  }
});

// Handle popup close
window.addEventListener('beforeunload', () => {
  if (popupManager) {
    // Son bir kez kaydet
    popupManager.saveSettings(false);
  }
});

// Storage değişikliklerini dinle
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && popupManager) {
    if (changes.widgetSettings) {
      popupManager.settings = changes.widgetSettings.newValue;
      popupManager.updateUI();
    }
    
    if (changes.favorites) {
      popupManager.favorites = changes.favorites.newValue || [];
      popupManager.updateFavoritesList();
    }
  }
});

// Error handling
window.addEventListener('error', (event) => {
  console.error('Popup Hatası:', event.error);
  if (popupManager) {
    popupManager.showError('Bir hata oluştu');
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Popup Promise Hatası:', event.reason);
  if (popupManager) {
    popupManager.showError('Bir hata oluştu');
  }
});
