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
      
      // Mesaj dinleyicisi ekle (popup'tan gelen mesajlar için)
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('📨 Mesaj alındı:', message);
        
        if (message.action === 'settingsUpdated') {
          console.log('⚙️ Ayar güncelleme mesajı alındı:', message.settings);
          this.settings = message.settings;
          this.applySettings();
          sendResponse({ success: true });
        }
        
        return true; // Asenkron yanıt için
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
    
    // HTML yapısı - görseldeki yatay tasarım
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
        <div class="weather-divider"></div>
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
    if (!this.widget) {
      console.log('❌ Widget mevcut değil, ayarlar uygulanamıyor');
      return;
    }
    
    console.log('🔧 Widget ayarları uygulanıyor...', this.settings);
    
    // Pozisyon
    console.log('📍 Pozisyon ayarlanıyor:', this.settings.position);
    this.setPosition();
    
    // Şeffaflık
    console.log('👻 Şeffaflık ayarlanıyor:', this.settings.transparency);
    this.setTransparency();
    
    // Boyut
    console.log('📏 Boyut ayarlanıyor:', this.settings.size);
    this.setSizeStyle();
    
    // Tema
    console.log('🎨 Tema ayarlanıyor:', this.settings.theme);
    this.setThemeStyle();
    
    // Animasyonlar
    if (this.settings.animationsEnabled) {
      console.log('✨ Animasyonlar etkinleştiriliyor');
      this.widget.classList.add('animated');
    } else {
      console.log('❌ Animasyonlar devre dışı bırakılıyor');
      this.widget.classList.remove('animated');
    }
    
    // Auto-hide
    if (this.settings.autoHide) {
      console.log('👻 Auto-hide etkinleştiriliyor');
      this.setupAutoHide();
    } else {
      console.log('👁️ Auto-hide devre dışı');
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
    console.log('📍 Pozisyon değerleri:', pos);
    
    Object.assign(this.widget.style, pos);
    this.widget.style.position = 'fixed';
    this.widget.style.zIndex = '2147483647';
    
    console.log('📍 Pozisyon uygulandı:', this.widget.style.cssText);
  }

  setTransparency() {
    console.log('👻 Şeffaflık uygulanıyor:', this.settings.transparency);
    this.widget.style.opacity = this.settings.transparency;
    console.log('👻 Şeffaflık uygulandı:', this.widget.style.opacity);
  }

  setSizeStyle() {
    console.log('📏 Boyut sınıfları temizleniyor...');
    this.widget.classList.remove('small', 'medium', 'large');
    this.widget.classList.add(this.settings.size);
    console.log('📏 Boyut sınıfı eklendi:', this.settings.size);
    
    const sizeStyles = {
      'small': { width: '320px', height: '70px', fontSize: '12px' },
      'medium': { width: '400px', height: '80px', fontSize: '14px' },
      'large': { width: '480px', height: '90px', fontSize: '16px' }
    };
    
    const style = sizeStyles[this.settings.size] || sizeStyles['medium'];
    console.log('📏 Boyut stilleri uygulanıyor:', style);
    Object.assign(this.widget.style, style);
    console.log('📏 Boyut uygulandı');
  }

  setThemeStyle() {
    console.log('🎨 Tema sınıfları temizleniyor...');
    this.widget.classList.remove('light', 'dark', 'blue', 'green');
    this.widget.classList.add(this.settings.theme);
    console.log('🎨 Tema sınıfı eklendi:', this.settings.theme);
    console.log('🎨 Widget sınıfları:', this.widget.className);
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
    const widget = this.widget;
    if (!widget) return;
    
    console.log('🎯 Modern drag system başlatılıyor...');
    
    // Drag state
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let animationId = null;
    
    // Modern drag start handler
    const handleDragStart = (clientX, clientY, event) => {
      // Kontrol düğmelerine tıklanırsa drag başlatma
      if (event.target.closest('.widget-controls') || 
          event.target.closest('button') ||
          event.target.closest('.control-btn')) {
        return;
      }
      
      if (isDragging) return;
      
      event.preventDefault();
      event.stopPropagation();
      
      isDragging = true;
      
      // Get current position
      const rect = widget.getBoundingClientRect();
      startX = rect.left;
      startY = rect.top;
      offsetX = clientX - startX;
      offsetY = clientY - startY;
      
      // Add drag styling with smooth effects
      widget.classList.add('dragging');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      
      // Performance optimizations
      widget.style.willChange = 'transform';
      widget.style.transition = 'none';
      
      // Bind move and end events
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleDragEnd, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd, { passive: false });
      
      console.log('🎯 Drag başladı:', { startX, startY });
    };
    
    // Mouse move handler with 60fps optimization
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      if (animationId) return; // Skip if animation pending
      
      animationId = requestAnimationFrame(() => {
        updatePosition(e.clientX, e.clientY);
        animationId = null;
      });
    };
    
    // Touch move handler
    const handleTouchMove = (e) => {
      if (!isDragging || !e.touches[0]) return;
      e.preventDefault();
      
      if (animationId) return;
      
      const touch = e.touches[0];
      animationId = requestAnimationFrame(() => {
        updatePosition(touch.clientX, touch.clientY);
        animationId = null;
      });
    };
    
    // Smooth position update with constraints
    const updatePosition = (clientX, clientY) => {
      if (!isDragging) return;
      
      // Calculate new position
      let newX = clientX - offsetX;
      let newY = clientY - offsetY;
      
      // Boundary constraints with padding
      const padding = 10;
      const maxX = window.innerWidth - widget.offsetWidth - padding;
      const maxY = window.innerHeight - widget.offsetHeight - padding;
      
      newX = Math.max(padding, Math.min(newX, maxX));
      newY = Math.max(padding, Math.min(newY, maxY));
      
      // Apply smooth transform with GPU acceleration
      widget.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    };
    
    // Modern drag end with smooth settle
    const handleDragEnd = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
      
      // Cancel pending animation
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      // Get final position
      const rect = widget.getBoundingClientRect();
      let finalX = rect.left;
      let finalY = rect.top;
      
      // Smart edge snapping
      const snapDistance = 50;
      const padding = 20;
      
      if (finalX < snapDistance) {
        finalX = padding; // Snap to left
      } else if (finalX > window.innerWidth - widget.offsetWidth - snapDistance) {
        finalX = window.innerWidth - widget.offsetWidth - padding; // Snap to right
      }
      
      if (finalY < snapDistance) {
        finalY = padding; // Snap to top
      } else if (finalY > window.innerHeight - widget.offsetHeight - snapDistance) {
        finalY = window.innerHeight - widget.offsetHeight - padding; // Snap to bottom
      }
      
      // Smooth settle animation
      const settleStart = performance.now();
      const settleDuration = 300; // 300ms smooth settle
      
      const settle = (currentTime) => {
        const elapsed = currentTime - settleStart;
        const progress = Math.min(elapsed / settleDuration, 1);
        
        // Smooth easing function
        const easeOut = 1 - Math.pow(1 - progress, 2);
        
        if (progress < 1) {
          // Continue animation
          const currentRect = widget.getBoundingClientRect();
          const currentX = currentRect.left;
          const currentY = currentRect.top;
          
          const lerpX = currentX + (finalX - currentX) * easeOut;
          const lerpY = currentY + (finalY - currentY) * easeOut;
          
          widget.style.transform = `translate3d(${lerpX}px, ${lerpY}px, 0)`;
          
          requestAnimationFrame(settle);
        } else {
          // Finalize position
          finalizeDragEnd(finalX, finalY);
        }
      };
      
      requestAnimationFrame(settle);
      console.log('🎯 Drag sona erdi, yerleştiriliyor...');
    };
    
    // Clean finalization
    const finalizeDragEnd = (x, y) => {
      // Remove drag styles
      widget.classList.remove('dragging');
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      
      // Set final position
      widget.style.transform = 'none';
      widget.style.left = `${x}px`;
      widget.style.top = `${y}px`;
      widget.style.right = 'auto';
      widget.style.bottom = 'auto';
      widget.style.willChange = 'auto';
      
      // Re-enable smooth transitions
      widget.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Save position
      this.savePosition();
      console.log('✅ Widget yerleştirildi:', { x, y });
    };
    
    // Event bindings
    widget.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only left click
      handleDragStart(e.clientX, e.clientY, e);
    });
    
    widget.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return; // Single touch only
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY, e);
    }, { passive: false });
    
    // Visual feedback
    widget.style.cursor = 'grab';
    
    // Hover effects
    widget.addEventListener('mouseenter', () => {
      if (!isDragging) {
        widget.style.transform = 'translateY(-2px) scale(1.005)';
      }
    });
    
    widget.addEventListener('mouseleave', () => {
      if (!isDragging) {
        widget.style.transform = 'translateY(0) scale(1)';
      }
    });
    
    console.log('✅ Modern drag system hazır');
  }
      
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      const targetX = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x)) - initialPosition.x;
      const targetY = Math.max(0, Math.min(maxY, e.clientY - dragOffset.y)) - initialPosition.y;
      
      // Immediate update for better responsiveness
      currentPosition.x = targetX;
      currentPosition.y = targetY;
      widget.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    };
    
    // Touch drag handler - optimized
    const handleTouchDrag = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      
      const touch = e.touches[0];
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      const targetX = Math.max(0, Math.min(maxX, touch.clientX - dragOffset.x)) - initialPosition.x;
      const targetY = Math.max(0, Math.min(maxY, touch.clientY - dragOffset.y)) - initialPosition.y;
      
      // Immediate update for touch
      currentPosition.x = targetX;
      currentPosition.y = targetY;
      widget.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
    };
    
    // Stop drag with smooth settle animation
    const stopDrag = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', handleTouchDrag);
      document.removeEventListener('touchend', stopDrag);
      
      // Cancel any pending animation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      // Calculate final position with snap-to-edge
      const snapThreshold = 50;
      const rect = widget.getBoundingClientRect();
      let finalX = rect.left;
      let finalY = rect.top;
      
      // Snap to edges if close enough
      if (finalX < snapThreshold) {
        finalX = 20; // Left edge
      } else if (finalX > window.innerWidth - widget.offsetWidth - snapThreshold) {
        finalX = window.innerWidth - widget.offsetWidth - 20; // Right edge
      }
      
      if (finalY < snapThreshold) {
        finalY = 20; // Top edge
      } else if (finalY > window.innerHeight - widget.offsetHeight - snapThreshold) {
        finalY = window.innerHeight - widget.offsetHeight - 20; // Bottom edge
      }
      
      // Smooth settle animation
      const settleAnimation = () => {
        const currentRect = widget.getBoundingClientRect();
        const deltaX = finalX - currentRect.left;
        const deltaY = finalY - currentRect.top;
        
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
          const newX = currentPosition.x + deltaX * 0.2;
          const newY = currentPosition.y + deltaY * 0.2;
          
          currentPosition.x = newX;
          currentPosition.y = newY;
          widget.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
          
          requestAnimationFrame(settleAnimation);
        } else {
          // Final positioning
          widget.style.transform = 'none';
          widget.style.left = finalX + 'px';
          widget.style.top = finalY + 'px';
          widget.style.right = 'auto';
          widget.style.bottom = 'auto';
          
          // Clean up drag styles
          finalizeDragEnd();
        }
      };
      
      requestAnimationFrame(settleAnimation);
    };
    
    // Clean up function
    const finalizeDragEnd = () => {
      widget.classList.remove('dragging');
      widget.style.cursor = 'grab';
      widget.style.transition = 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)';
      widget.style.willChange = 'auto';
      widget.style.backfaceVisibility = 'visible';
      
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      
      this.savePosition();
    };
    
    // Event listeners
    widget.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY, e);
    });
    
    widget.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY, e);
      }
    }, { passive: false });
    
    // Visual feedback
    widget.style.cursor = 'grab';
    widget.addEventListener('mouseenter', () => {
      if (!isDragging) {
        widget.style.cursor = 'grab';
        widget.style.transform = 'translateY(-1px)';
      }
    });
    
    widget.addEventListener('mouseleave', () => {
      if (!isDragging) {
        widget.style.cursor = 'default';
        widget.style.transform = 'translateY(0)';
      }
    });
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
