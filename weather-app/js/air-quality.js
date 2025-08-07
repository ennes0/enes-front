// Hava Kalitesi Yönetim Sistemi
class AirQualityManager {
  constructor() {
    this.apiKey = "1ab5083c1ad45e73e3a6fecc3f343f32"; 
    this.baseUrl = "http://api.openweathermap.org/data/2.5/air_pollution";
    this.init();
  }

  init() {
    this.createAirQualityUI();
  }

  
  async fetchAirQuality(lat, lon) {
    try {
      const url = `${this.baseUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
      
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('🌬️ Hava kalitesi verisi alındı:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Hava kalitesi verisi alınırken hata:', error);
      return null;
    }
  }

  getAQILevel(aqi) {
    const levels = {
      1: { name: 'Çok İyi', color: '#00e400', description: 'Hava kalitesi mükemmel' },
      2: { name: 'İyi', color: '#ffff00', description: 'Hava kalitesi kabul edilebilir' },
      3: { name: 'Orta', color: '#ff7e00', description: 'Hassas kişiler için zararlı olabilir' },
      4: { name: 'Kötü', color: '#ff0000', description: 'Sağlık için zararlı' },
      5: { name: 'Çok Kötü', color: '#8f3f97', description: 'Sağlık için çok zararlı' }
    };
    
    return levels[aqi] || { name: 'Bilinmiyor', color: '#666666', description: 'Veri bulunamadı' };
  }

  getPollutantLevel(value, pollutant) {
    const thresholds = {
      'pm2_5': { good: 12, moderate: 35, unhealthy: 55, veryUnhealthy: 150 },
      'pm10': { good: 54, moderate: 154, unhealthy: 254, veryUnhealthy: 354 },
      'co': { good: 4.4, moderate: 9.4, unhealthy: 12.4, veryUnhealthy: 15.4 },
      'no2': { good: 53, moderate: 100, unhealthy: 360, veryUnhealthy: 649 },
      'so2': { good: 35, moderate: 75, unhealthy: 185, veryUnhealthy: 304 },
      'o3': { good: 54, moderate: 70, unhealthy: 85, veryUnhealthy: 105 }
    };

    const threshold = thresholds[pollutant];
    if (!threshold) return { level: 'unknown', color: '#666666' };

    if (value <= threshold.good) {
      return { level: 'good', color: '#00e400', text: 'İyi' };
    } else if (value <= threshold.moderate) {
      return { level: 'moderate', color: '#ffff00', text: 'Orta' };
    } else if (value <= threshold.unhealthy) {
      return { level: 'unhealthy', color: '#ff7e00', text: 'Kötü' };
    } else if (value <= threshold.veryUnhealthy) {
      return { level: 'veryUnhealthy', color: '#ff0000', text: 'Çok Kötü' };
    } else {
      return { level: 'hazardous', color: '#8f3f97', text: 'Tehlikeli' };
    }
  }

  getHealthRecommendations(aqi) {
    const recommendations = {
      1: [
        '🌱 Hava kalitesi mükemmel!',
        '🏃‍♂️ Açık hava aktiviteleri için ideal',
        '🪟 Pencereleri açabilirsiniz'
      ],
      2: [
        '😊 Hava kalitesi iyi',
        '🚶‍♀️ Normal aktiviteler yapabilirsiniz',
        '👶 Çocuklar dışarıda oynayabilir'
      ],
      3: [
        '⚠️ Hassas kişiler dikkatli olmalı',
        '🏃‍♂️ Yoğun egzersizden kaçının',
        '👶 Astım hastaları dikkatli olmalı'
      ],
      4: [
        '🚨 Dışarı çıkarken maske takın',
        '🏠 Mümkünse evde kalın',
        '🪟 Pencereleri kapalı tutun',
        '💨 Hava temizleyici kullanın'
      ],
      5: [
        '🆘 Acil durum seviyesi!',
        '🏠 Dışarı çıkmayın',
        '😷 Mutlaka N95 maske takın',
        '🏥 Sağlık sorunları varsa doktora başvurun'
      ]
    };

    return recommendations[aqi] || ['Veri bulunamadı'];
  }

  createAirQualityUI() {
    const cardFront = document.querySelector('.card-front');
    if (!cardFront) return;

    const airQualitySection = document.createElement('div');
    airQualitySection.id = 'air-quality-section';
    airQualitySection.className = 'air-quality-section';
    airQualitySection.style.display = 'none'; 
    
    airQualitySection.innerHTML = `
      <div class="air-quality-container">
        <div class="air-quality-header">
          <h3><i class="fas fa-lungs"></i> Hava Kalitesi</h3>
          <div class="aqi-badge" id="aqi-badge">
            <span class="aqi-value" id="aqi-value">-</span>
            <span class="aqi-label" id="aqi-label">Yükleniyor...</span>
          </div>
        </div>
        
        <div class="pollutants-grid" id="pollutants-grid">
          <div class="pollutant-item">
            <div class="pollutant-name">PM2.5</div>
            <div class="pollutant-value" id="pm25-value">-</div>
            <div class="pollutant-unit">μg/m³</div>
          </div>
          <div class="pollutant-item">
            <div class="pollutant-name">PM10</div>
            <div class="pollutant-value" id="pm10-value">-</div>
            <div class="pollutant-unit">μg/m³</div>
          </div>
          <div class="pollutant-item">
            <div class="pollutant-name">CO</div>
            <div class="pollutant-value" id="co-value">-</div>
            <div class="pollutant-unit">mg/m³</div>
          </div>
          <div class="pollutant-item">
            <div class="pollutant-name">NO₂</div>
            <div class="pollutant-value" id="no2-value">-</div>
            <div class="pollutant-unit">μg/m³</div>
          </div>
          <div class="pollutant-item">
            <div class="pollutant-name">SO₂</div>
            <div class="pollutant-value" id="so2-value">-</div>
            <div class="pollutant-unit">μg/m³</div>
          </div>
          <div class="pollutant-item">
            <div class="pollutant-name">O₃</div>
            <div class="pollutant-value" id="o3-value">-</div>
            <div class="pollutant-unit">μg/m³</div>
          </div>
        </div>
        
        <div class="health-recommendations" id="health-recommendations">
          <h4><i class="fas fa-heartbeat"></i> Sağlık Önerileri</h4>
          <ul id="recommendations-list">
            <li>Veriler yükleniyor...</li>
          </ul>
        </div>
      </div>
    `;

    const extraInfoContainer = cardFront.querySelector('.extra-info-container');
    if (extraInfoContainer) {
      cardFront.insertBefore(airQualitySection, extraInfoContainer);
    } else {
      cardFront.appendChild(airQualitySection);
    }
  }

  async displayAirQuality(lat, lon) {
    const airQualitySection = document.getElementById('air-quality-section');
    if (!airQualitySection) return;

    airQualitySection.style.display = 'block';

    try {
      this.showLoadingState();

      const data = await this.fetchAirQuality(lat, lon);
      if (!data || !data.list || !data.list[0]) {
        this.showErrorState();
        return;
      }

      const airData = data.list[0];
      const aqi = airData.main.aqi;
      console.log('🌬️ Hava kalitesi verisi:', airData);
      console.log('🌬️ AQI Değeri:', aqi);
      const components = airData.components;

      this.updateAQIBadge(aqi);

      this.updatePollutants(components);

      this.updateHealthRecommendations(aqi);

    } catch (error) {
      console.error('Hava kalitesi gösterilirken hata:', error);
      this.showErrorState();
    }
  }

  showLoadingState() {
    const aqiValue = document.getElementById('aqi-value');
    const aqiLabel = document.getElementById('aqi-label');
    
    if (aqiValue) aqiValue.textContent = '-';
    if (aqiLabel) aqiLabel.textContent = 'Yükleniyor...';

    ['pm25', 'pm10', 'co', 'no2', 'so2', 'o3'].forEach(pollutant => {
      const element = document.getElementById(`${pollutant}-value`);
      if (element) element.textContent = '-';
    });
  }

  showErrorState() {
    const aqiLabel = document.getElementById('aqi-label');
    const recommendationsList = document.getElementById('recommendations-list');
    
    if (aqiLabel) aqiLabel.textContent = 'Veri alınamadı';
    if (recommendationsList) {
      recommendationsList.innerHTML = '<li>Hava kalitesi verisi şu anda kullanılamıyor</li>';
    }
  }

  updateAQIBadge(aqi) {
    const aqiValue = document.getElementById('aqi-value');
    const aqiLabel = document.getElementById('aqi-label');
    const aqiBadge = document.getElementById('aqi-badge');

    if (!aqiValue || !aqiLabel || !aqiBadge) return;

    const level = this.getAQILevel(aqi);
    
    aqiValue.textContent = aqi;
    aqiLabel.textContent = level.name;
    aqiBadge.style.backgroundColor = level.color;
    aqiBadge.style.color = aqi >= 3 ? '#ffffff' : '#000000';
  }

  updatePollutants(components) {
    const pollutants = {
      pm25: { value: components.pm2_5, element: document.getElementById('pm25-value') },
      pm10: { value: components.pm10, element: document.getElementById('pm10-value') },
      co: { value: (components.co / 1000).toFixed(1), element: document.getElementById('co-value') }, // μg/m³ → mg/m³
      no2: { value: components.no2, element: document.getElementById('no2-value') },
      so2: { value: components.so2, element: document.getElementById('so2-value') },
      o3: { value: components.o3, element: document.getElementById('o3-value') }
    };

    Object.entries(pollutants).forEach(([key, pollutant]) => {
      if (pollutant.element && pollutant.value !== undefined) {
        const level = this.getPollutantLevel(pollutant.value, key);
        pollutant.element.textContent = pollutant.value;
        pollutant.element.style.color = level.color;
        pollutant.element.style.fontWeight = 'bold';
      }
    });
  }

  updateHealthRecommendations(aqi) {
    const recommendationsList = document.getElementById('recommendations-list');
    if (!recommendationsList) return;

    const recommendations = this.getHealthRecommendations(aqi);
    
    recommendationsList.innerHTML = recommendations
      .map(rec => `<li>${rec}</li>`)
      .join('');
  }

  hideAirQuality() {
    const airQualitySection = document.getElementById('air-quality-section');
    if (airQualitySection) {
      airQualitySection.style.display = 'none';
    }
  }

  onLocationUpdated(lat, lon) {
    if (lat && lon) {
      this.displayAirQuality(lat, lon);
    } else {
      this.hideAirQuality();
    }
  }
}

const airQualityManager = new AirQualityManager();

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌬️ Hava Kalitesi Yöneticisi başlatıldı');
});
