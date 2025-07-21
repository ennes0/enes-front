const apiKey = "1ab5083c1ad45e73e3a6fecc3f343f32";
const apiBaseUrl = "https://api.openweathermap.org/data/2.5";
const geoBaseUrl = "https://api.openweathermap.org/geo/1.0";


const defaultParams = "units=metric&lang=tr";

const loadingElement = document.getElementById("loading");


const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");
const cityElement = document.getElementById("city");
const dateElement = document.getElementById("date");
const tempElement = document.getElementById("temp");
const feelsLikeElement = document.getElementById("feels-like");
const weatherIconElement = document.getElementById("weather-icon");
const weatherDescElement = document.getElementById("weather-desc");
const windElement = document.getElementById("wind");
const humidityElement = document.getElementById("humidity");
const pressureElement = document.getElementById("pressure");
const autocompleteList = document.getElementById("autocomplete-list");
const showMapBtn = document.getElementById("show-map-btn");
const backToWeatherBtn = document.getElementById("back-to-weather-btn");

function formatDate(date, cityName = null) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  const formattedDate = date.toLocaleDateString('tr-TR', options);
  
  // Eğer şehir adı verilmişse yerel saat bilgisini ekle
  if (cityName) {
    return `${formattedDate} (${cityName} yerel saati)`;
  }
  
  return formattedDate;
}


async function fetchWeather(city) {
  try {
    const apiUrl = `${apiBaseUrl}/weather?q=${encodeURIComponent(city)}&${defaultParams}&appid=${apiKey}`;
    console.log(`API çağrısı yapılıyor: ${apiUrl}`);
    
   
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API Hatası: ${response.status} - ${response.statusText}`);
      if (response.status === 404) {
        throw new Error("Şehir bulunamadı");
      } else if (response.status === 401) {
        throw new Error("API anahtarı geçersiz");
      } else {
        throw new Error(`API hatası: ${response.status}`);
      }
    }
    
    const data = await response.json();
    console.log("API Yanıtı:", data);
    
    // Rüzgar verilerinin API'de olup olmadığını özellikle kontrol et
    if (data.wind) {
      console.log("✅ Rüzgar verileri API'de mevcut:", data.wind);
      if (data.wind.speed !== undefined) {
        console.log(`✅ Rüzgar hızı: ${data.wind.speed} m/s (${(data.wind.speed * 3.6).toFixed(1)} km/h)`);
      } else {
        console.warn("⚠️ Rüzgar hızı verisi eksik");
      }
      if (data.wind.deg !== undefined) {
        console.log(`✅ Rüzgar yönü: ${data.wind.deg}°`);
      } else {
        console.log("ℹ️ Rüzgar yönü verisi yok (normal durum)");
      }
      if (data.wind.gust !== undefined) {
        console.log(`✅ Rüzgar esiş gücü: ${data.wind.gust} m/s`);
      } else {
        console.log("ℹ️ Rüzgar esiş gücü verisi yok (normal durum)");
      }
    } else {
      console.error("❌ Rüzgar verileri API yanıtında bulunamadı!");
    }
    
    // Sıcaklık verilerini özellikle kontrol et
    if (data.main) {
      console.log("✅ Ana hava durumu verileri mevcut:", data.main);
      console.log(`✅ Şu anki sıcaklık: ${data.main.temp}°C`);
      
      if (data.main.temp_min !== undefined) {
        console.log(`✅ Minimum sıcaklık: ${data.main.temp_min}°C`);
      } else {
        console.warn("⚠️ Minimum sıcaklık verisi eksik");
      }
      
      if (data.main.temp_max !== undefined) {
        console.log(`✅ Maksimum sıcaklık: ${data.main.temp_max}°C`);
      } else {
        console.warn("⚠️ Maksimum sıcaklık verisi eksik");
      }
      
      if (data.main.feels_like !== undefined) {
        console.log(`✅ Hissedilen sıcaklık: ${data.main.feels_like}°C`);
      }
      
      if (data.main.humidity !== undefined) {
        console.log(`✅ Nem: ${data.main.humidity}%`);
      }
      
      if (data.main.pressure !== undefined) {
        console.log(`✅ Basınç: ${data.main.pressure} hPa`);
      }
    } else {
      console.error("❌ Ana hava durumu verileri (main) API yanıtında bulunamadı!");
    }
    
    // Görüş mesafesi verilerini kontrol et
    if (data.visibility !== undefined) {
      const visibilityKm = (data.visibility / 1000).toFixed(1);
      console.log(`✅ Görüş mesafesi: ${data.visibility} m (${visibilityKm} km)`);
    } else {
      console.warn("⚠️ Görüş mesafesi verisi eksik");
    }
    
    // Bulutluluk verilerini kontrol et
    if (data.clouds) {
      console.log("✅ Bulutluluk verileri mevcut:", data.clouds);
      if (data.clouds.all !== undefined) {
        console.log(`✅ Bulutluluk oranı: ${data.clouds.all}%`);
      } else {
        console.warn("⚠️ Bulutluluk oranı verisi eksik");
      }
    } else {
      console.warn("⚠️ Bulutluluk verileri eksik");
    }
    
    // Güneş doğumu ve batımı verilerini kontrol et
    if (data.sys) {
      console.log("✅ Sistem verileri mevcut:", data.sys);
      if (data.sys.sunrise !== undefined) {
        const sunriseDate = new Date(data.sys.sunrise * 1000);
        console.log(`✅ Gün doğumu: ${data.sys.sunrise} (${sunriseDate.toLocaleTimeString('tr-TR')})`);
      } else {
        console.warn("⚠️ Gün doğumu verisi eksik");
      }
      
      if (data.sys.sunset !== undefined) {
        const sunsetDate = new Date(data.sys.sunset * 1000);
        console.log(`✅ Gün batımı: ${data.sys.sunset} (${sunsetDate.toLocaleTimeString('tr-TR')})`);
      } else {
        console.warn("⚠️ Gün batımı verisi eksik");
      }
      
      if (data.sys.country !== undefined) {
        console.log(`✅ Ülke kodu: ${data.sys.country}`);
      }
    } else {
      console.warn("⚠️ Sistem verileri eksik");
    }
    
    // Yağış verilerini kontrol et
    if (data.rain) {
      console.log("✅ Yağmur verileri mevcut:", data.rain);
      if (data.rain["1h"] !== undefined) {
        console.log(`✅ Son 1 saatteki yağmur: ${data.rain["1h"]} mm`);
      }
      if (data.rain["3h"] !== undefined) {
        console.log(`✅ Son 3 saatteki yağmur: ${data.rain["3h"]} mm`);
      }
    } else {
      console.log("ℹ️ Yağmur verisi yok (normal durum)");
    }
    
    if (data.snow) {
      console.log("✅ Kar verileri mevcut:", data.snow);
      if (data.snow["1h"] !== undefined) {
        console.log(`✅ Son 1 saatteki kar: ${data.snow["1h"]} mm`);
      }
      if (data.snow["3h"] !== undefined) {
        console.log(`✅ Son 3 saatteki kar: ${data.snow["3h"]} mm`);
      }
    } else {
      console.log("ℹ️ Kar verisi yok (normal durum)");
    }
    
    // Hava durumu açıklama verilerini kontrol et
    if (data.weather && data.weather.length > 0) {
      console.log("✅ Hava durumu açıklama verileri mevcut:", data.weather);
      const weather = data.weather[0];
      console.log(`✅ Ana hava durumu: ${weather.main}`);
      console.log(`✅ Hava durumu açıklaması: ${weather.description}`);
      console.log(`✅ Hava durumu ikonu: ${weather.icon}`);
      console.log(`✅ Hava durumu ID: ${weather.id}`);
    } else {
      console.error("❌ Hava durumu açıklama verileri eksik");
    }
    
    // Koordinat verilerini kontrol et
    if (data.coord) {
      console.log("✅ Koordinat verileri mevcut:", data.coord);
      console.log(`✅ Enlem (Latitude): ${data.coord.lat}`);
      console.log(`✅ Boylam (Longitude): ${data.coord.lon}`);
    } else {
      console.warn("⚠️ Koordinat verileri eksik");
    }
    
    // Zaman dilimi verilerini kontrol et
    if (data.timezone !== undefined) {
      console.log(`✅ Zaman dilimi offset: ${data.timezone} saniye (UTC${data.timezone >= 0 ? '+' : ''}${data.timezone / 3600} saat)`);
    } else {
      console.warn("⚠️ Zaman dilimi verisi eksik");
    }
    
    // Şehir ID'sini kontrol et
    if (data.id !== undefined) {
      console.log(`✅ Şehir ID: ${data.id}`);
    } else {
      console.warn("⚠️ Şehir ID verisi eksik");
    }
    
    return data;
  } catch (error) {
    console.error("Hava durumu sorgusu hatası:", error);
    return null;
  }
}

function displayWeather(data, originalSearchName = null) {
  if (!data) {
    weatherInfo.classList.remove("active");
    errorMessage.classList.add("active");
    return;
  }
  
  try {
    console.log("🔍 === TAM API YANITI İNCELEMESİ ===");
    console.log("Tam API yanıtı objesi:", data);
    console.log("API yanıtı JSON:", JSON.stringify(data, null, 2));
    console.log("API yanıtının anahtarları:", Object.keys(data));
    console.log("🔍 === API YANITI İNCELEMESİ TAMAMLANDI ===");
    
    // Şehrin yerel saatini hesapla ve göster
    let localTime;
    if (data.timezone !== undefined) {
      // API'den gelen timezone saniye cinsinden UTC'den fark
      const timezoneOffsetSeconds = data.timezone;
      
      // Şu anki UTC zamanını al
      const now = new Date();
      const utcTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      
      // UTC zamanına şehrin timezone offset'ini ekleyerek yerel zamanı hesapla
      localTime = new Date(utcTime.getTime() + (timezoneOffsetSeconds * 1000));
      
      console.log(`⏰ Şehir yerel saati hesaplaması:`);
      console.log(`   - Sistem zamanı: ${now.toString()}`);
      console.log(`   - UTC zaman: ${utcTime.toISOString()}`);
      console.log(`   - Şehir timezone offset: ${timezoneOffsetSeconds} saniye (${timezoneOffsetSeconds / 3600} saat)`);
      console.log(`   - Şehir yerel zamanı: ${localTime.toString()}`);
    } else {
      // Timezone verisi yoksa sistem saatini kullan
      localTime = new Date();
      console.warn("⚠️ Timezone verisi bulunamadı, sistem saati kullanılıyor");
    }
    
    dateElement.textContent = formatDate(localTime, data.name);
    
    // Şehir adı (eğer orijinal arama terimi varsa onu göster, yoksa API'den gelen şehir adını göster)
    const cityName = originalSearchName || data.name;
    cityElement.textContent = `${cityName}, ${data.sys.country}`;
    
    // Favoriler sistemi için city data attribute'larını set et
    cityElement.dataset.cityId = data.id ? data.id.toString() : '';
    cityElement.dataset.country = data.sys.country || 'TR';
    
    // Favoriler yöneticisine şehir verisi güncellendi bilgisini gönder
    if (typeof favoritesManager !== 'undefined') {
      const cityData = {
        id: data.id ? data.id.toString() : '',
        name: cityName,
        country: data.sys.country || 'TR',
        temp: Math.round(data.main.temp).toString(),
        description: data.weather[0].description,
        icon: data.weather[0].icon
      };
      favoritesManager.onCityDataUpdated(cityData);
    }
    
    // Sıcaklık
    tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°C`;
    
    // Hava durumu ikonu ve açıklaması
    const iconCode = data.weather[0].icon;
    // Daha büyük ve yüksek kaliteli ikon kullan (2x)
    weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherDescElement.textContent = data.weather[0].description;
    
    // Rüzgar hızı işleme - OpenWeatherMap API'si m/s cinsinden veri sağlar
    if (data.wind && data.wind.speed !== undefined) {
      // 1 m/s = 3.6 km/h dönüşüm faktörü
      const windSpeedMs = data.wind.speed;
      const windSpeedKmh = Math.round(windSpeedMs * 3.6); 
      
      console.log(`Rüzgar hızı dönüşümü: ${windSpeedMs} m/s → ${windSpeedKmh} km/h`);
      
      // Rüzgar yönü: Derece cinsinden (opsiyonel)
      let windDirection = "";
      if (data.wind.deg !== undefined) {
        const directions = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
        const index = Math.round(data.wind.deg / 45) % 8;
        windDirection = ` ${directions[index]}`;
        console.log(`Rüzgar yönü: ${data.wind.deg}° → ${directions[index]}`);
      }
      
      // Rüzgar esiş gücü varsa ekle (gust)
      let gustInfo = "";
      if (data.wind.gust !== undefined) {
        const gustMs = data.wind.gust;
        const gustKmh = Math.round(gustMs * 3.6); // Tam sayı
        gustInfo = `, esiş: ${gustKmh} km/h`;
        console.log(`Rüzgar esiş gücü: ${gustMs} m/s → ${gustKmh} km/h`);
      }
      
      const windText = `${windSpeedKmh} km/h${windDirection}${gustInfo}`;
      windElement.textContent = windText;
      console.log(`Final rüzgar metni: "${windText}"`);
    } else {
      // Rüzgar verisi yoksa
      windElement.textContent = "Rüzgar verisi yok";
      console.warn("⚠️ Rüzgar verisi API yanıtında bulunamadı");
    }
    
    // Nem: API'den % olarak gelir
    if (data.main && data.main.humidity !== undefined) {
      humidityElement.textContent = `${data.main.humidity}%`;
    } else {
      humidityElement.textContent = "Nem verisi yok";
      console.warn("⚠️ Nem verisi API yanıtında bulunamadı");
    }
    
    // Basınç: API'den hPa olarak gelir
    if (data.main && data.main.pressure !== undefined) {
      pressureElement.textContent = `${data.main.pressure} hPa`;
    } else {
      pressureElement.textContent = "Basınç verisi yok";
      console.warn("⚠️ Basınç verisi API yanıtında bulunamadı");
    }
    
    // Detaylı hava durumu verilerini loglama
    console.log("🌤️ === DETAYLI HAVA DURUMU VERİLERİ KONTROLÜ ===");
    
    // Bulutluluk verilerini kontrol et
    if (data.clouds) {
      console.log("✅ Bulutluluk verileri mevcut:", data.clouds);
      if (data.clouds.all !== undefined) {
        console.log(`✅ Bulutluluk oranı: ${data.clouds.all}%`);
      } else {
        console.warn("⚠️ Bulutluluk oranı verisi eksik");
      }
    } else {
      console.warn("⚠️ Bulutluluk verileri API yanıtında bulunamadı");
    }
    
    // Görüş mesafesi verilerini kontrol et
    if (data.visibility !== undefined) {
      console.log(`✅ Görüş mesafesi: ${data.visibility} metre (${(data.visibility / 1000).toFixed(1)} km)`);
    } else {
      console.warn("⚠️ Görüş mesafesi verisi API yanıtında bulunamadı");
    }
    
    // Sistem verileri (ülke, gün doğumu/batımı) kontrol et
    if (data.sys) {
      console.log("✅ Sistem verileri mevcut:", data.sys);
      
      if (data.sys.country) {
        console.log(`✅ Ülke kodu: ${data.sys.country}`);
      }
      
      if (data.sys.sunrise && data.sys.sunset) {
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        console.log(`✅ Gün doğumu: ${sunrise.toLocaleTimeString('tr-TR')}`);
        console.log(`✅ Gün batımı: ${sunset.toLocaleTimeString('tr-TR')}`);
      } else {
        console.warn("⚠️ Gün doğumu/batımı verileri eksik");
      }
    } else {
      console.warn("⚠️ Sistem verileri API yanıtında bulunamadı");
    }
    
    // Hava durumu açıklaması ve ikonu kontrol et
    if (data.weather && data.weather.length > 0) {
      console.log("✅ Hava durumu verileri mevcut:", data.weather);
      const weather = data.weather[0];
      
      if (weather.main) {
        console.log(`✅ Ana hava durumu: ${weather.main}`);
      }
      
      if (weather.description) {
        console.log(`✅ Hava durumu açıklaması: ${weather.description}`);
      }
      
      if (weather.icon) {
        console.log(`✅ Hava durumu ikonu: ${weather.icon}`);
      }
      
      if (weather.id) {
        console.log(`✅ Hava durumu ID: ${weather.id}`);
      }
    } else {
      console.error("❌ Hava durumu açıklaması verileri API yanıtında bulunamadı");
    }
    
    // Yağış verileri kontrol et
    if (data.rain) {
      console.log("✅ Yağmur verileri mevcut:", data.rain);
      if (data.rain["1h"] !== undefined) {
        console.log(`✅ Son 1 saatte yağmur: ${data.rain["1h"]} mm`);
      }
      if (data.rain["3h"] !== undefined) {
        console.log(`✅ Son 3 saatte yağmur: ${data.rain["3h"]} mm`);
      }
    } else {
      console.log("ℹ️ Yağmur verisi yok (normal durum)");
    }
    
    if (data.snow) {
      console.log("✅ Kar verileri mevcut:", data.snow);
      if (data.snow["1h"] !== undefined) {
        console.log(`✅ Son 1 saatte kar: ${data.snow["1h"]} mm`);
      }
      if (data.snow["3h"] !== undefined) {
        console.log(`✅ Son 3 saatte kar: ${data.snow["3h"]} mm`);
      }
    } else {
      console.log("ℹ️ Kar verisi yok (normal durum)");
    }
    
    // Koordinat verileri kontrol et
    if (data.coord) {
      console.log("✅ Koordinat verileri mevcut:", data.coord);
      console.log(`✅ Enlem (Latitude): ${data.coord.lat}`);
      console.log(`✅ Boylam (Longitude): ${data.coord.lon}`);
    } else {
      console.warn("⚠️ Koordinat verileri API yanıtında bulunamadı");
    }
    
    // Zaman dilimi verisi kontrol et
    if (data.timezone !== undefined) {
      console.log(`✅ Zaman dilimi offset: ${data.timezone} saniye (UTC${data.timezone >= 0 ? '+' : ''}${data.timezone / 3600} saat)`);
    } else {
      console.warn("⚠️ Zaman dilimi verisi API yanıtında bulunamadı");
    }
    
    // Şehir ID'si kontrol et
    if (data.id) {
      console.log(`✅ Şehir ID: ${data.id}`);
    } else {
      console.warn("⚠️ Şehir ID verisi API yanıtında bulunamadı");
    }
    
    // Şehir adı kontrol et
    if (data.name) {
      console.log(`✅ Şehir adı: ${data.name}`);
    } else {
      console.warn("⚠️ Şehir adı verisi API yanıtında bulunamadı");
    }
    
    console.log("🌤️ === DETAYLI VERİ KONTROLÜ TAMAMLANDI ===");
    
    // Yeni hava durumu detaylarını ekle
    updateExtraWeatherInfo(data);
    
    // Harita için koordinatları güncelle
    if (data.coord && data.coord.lat && data.coord.lon) {
      // Şehir için koordinatları ve ismini kaydet
      const cityName = originalSearchName || data.name;
      console.log(`Harita koordinatları güncelleniyor: ${cityName}, Lat: ${data.coord.lat}, Lon: ${data.coord.lon}`);
      
      // Haritayı güncelle
      currentCityCoords = { lat: data.coord.lat, lng: data.coord.lon };
      
      // Eğer harita zaten başlatılmışsa, haritayı da güncelle
      if (map && mapInitialized) {
        updateMap(data.coord.lat, data.coord.lon, cityName);
      } else {
        console.log("Harita henüz başlatılmadı, sadece koordinatlar kaydedildi");
      }
    }
    
    // Ekranı göster
    errorMessage.classList.remove("active");
    weatherInfo.classList.add("active");
  } catch (error) {
    console.error("Veri görüntüleme hatası:", error);
    console.error("Alınan veri:", data);
    weatherInfo.classList.remove("active");
    errorMessage.classList.add("active");
  }
}

function updateExtraWeatherInfo(data) {
  // Eğer DOM elementleri yoksa oluştur
  if (!document.getElementById('extra-info')) {
    createExtraInfoElements();
  }
  
  // Görüş mesafesi: metre cinsinden gelir, km'ye çevrilir
  // API dokümantasyonunda belirtildiği gibi maksimum değer 10km
  const visibilityElement = document.getElementById('visibility');
  if (data.visibility !== undefined) {
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    visibilityElement.textContent = `${visibilityKm} km`;
  } else {
    visibilityElement.textContent = "Mevcut değil";
  }
  
  // Bulutluluk oranı
  const cloudsElement = document.getElementById('clouds');
  if (data.clouds && data.clouds.all !== undefined) {
    cloudsElement.textContent = `${data.clouds.all}%`;
  } else {
    cloudsElement.textContent = "Mevcut değil";
  }
  
  // Gün doğumu ve gün batımı
  const sunriseElement = document.getElementById('sunrise');
  const sunsetElement = document.getElementById('sunset');
  
  if (data.sys && data.sys.sunrise && data.sys.sunset) {
    // Unix timestamp'i yerel saate çevir
    // Timezone'u dikkate alarak yerel saati hesapla
    const timezone = data.timezone || 0; // Saniye cinsinden UTC'den fark
    
    const sunriseTime = new Date((data.sys.sunrise + timezone) * 1000);
    const sunsetTime = new Date((data.sys.sunset + timezone) * 1000);
    
    // UTC saatini yerel saate dönüştür
    const sunriseHours = sunriseTime.getUTCHours().toString().padStart(2, '0');
    const sunriseMinutes = sunriseTime.getUTCMinutes().toString().padStart(2, '0');
    
    const sunsetHours = sunsetTime.getUTCHours().toString().padStart(2, '0');
    const sunsetMinutes = sunsetTime.getUTCMinutes().toString().padStart(2, '0');
    
    // Saat formatında göster (saat:dakika)
    sunriseElement.textContent = `${sunriseHours}:${sunriseMinutes}`;
    sunsetElement.textContent = `${sunsetHours}:${sunsetMinutes}`;
  } else {
    sunriseElement.textContent = "Mevcut değil";
    sunsetElement.textContent = "Mevcut değil";
  }
  
  // Yağış bilgisi (varsa) - mm/saat olarak gelir
  const rainElement = document.getElementById('rain');
  const snowElement = document.getElementById('snow');
  
  if (data.rain && data.rain["1h"] !== undefined) {
    rainElement.parentElement.style.display = "flex";
    rainElement.textContent = `${data.rain["1h"]} mm`;
  } else {
    rainElement.parentElement.style.display = "none";
  }
  
  if (data.snow && data.snow["1h"] !== undefined) {
    snowElement.parentElement.style.display = "flex";
    snowElement.textContent = `${data.snow["1h"]} mm`;
  } else {
    snowElement.parentElement.style.display = "none";
  }
  
  // Min-max sıcaklık - OpenWeatherMap API'sinden doğru şekilde al
  const tempMinMaxElement = document.getElementById('temp-min-max');
  

  if (data.main && data.main.temp_min !== undefined && data.main.temp_max !== undefined) {
    const tempMin = data.main.temp_min;
    const tempMax = data.main.temp_max;
    const currentTemp = data.main.temp;
    
    console.log(`Min-Max sıcaklık değerleri: Min: ${tempMin}°C, Max: ${tempMax}°C, Şu anki: ${currentTemp}°C`);
    
    // Min-max değerlerini her zaman göster (farklı olup olmamasına bakılmaksızın)
    tempMinMaxElement.textContent = `${tempMin}°C - ${tempMax}°C`;
    tempMinMaxElement.parentElement.style.display = "flex";
    
    // Min ve max aynıysa özel durum için log
    if (tempMin === tempMax) {
      console.log("ℹ️ Min ve Max sıcaklık aynı değerde");
    }
  } else {
    tempMinMaxElement.textContent = "Veri yok";
    tempMinMaxElement.parentElement.style.display = "flex";
    console.warn("⚠️ Min-Max sıcaklık verileri API yanıtında bulunamadı");
    
    // API yanıtının main objesini kontrol et
    if (!data.main) {
      console.error("❌ API yanıtında 'main' objesi bulunamadı");
    } else {
      console.log("📋 Mevcut main objesi anahtarları:", Object.keys(data.main));
    }
  }
}

function createExtraInfoElements() {
  // Ana ekstra bilgi konteyneri
  const extraInfoContainer = document.createElement('div');
  extraInfoContainer.id = 'extra-info';
  extraInfoContainer.className = 'extra-info-container';
  
  // Görüş mesafesi, bulutluluk, gün doğumu/batımı ve yağış bilgisi
  const extraInfoHTML = `
    <h3 class="extra-info-title">Detaylı Hava Durumu Bilgileri</h3>
    
    <div class="info-row">
      <div class="info-item">
        <i class="fas fa-eye"></i>
        <div class="info-label">Görüş</div>
        <div id="visibility" class="info-value">--</div>
      </div>
      <div class="info-item">
        <i class="fas fa-cloud"></i>
        <div class="info-label">Bulutluluk</div>
        <div id="clouds" class="info-value">--%</div>
      </div>
    </div>
    <div class="info-row">
      <div class="info-item">
        <i class="fas fa-sunrise"></i>
        <div class="info-label">Gün Doğumu</div>
        <div id="sunrise" class="info-value">--:--</div>
      </div>
      <div class="info-item">
        <i class="fas fa-sunset"></i>
        <div class="info-label">Gün Batımı</div>
        <div id="sunset" class="info-value">--:--</div>
      </div>
    </div>
    <div class="info-row">
      <div class="info-item">
        <i class="fas fa-cloud-rain"></i>
        <div class="info-label">Yağmur (1s)</div>
        <div id="rain" class="info-value">-- mm</div>
      </div>
      <div class="info-item">
        <i class="fas fa-snowflake"></i>
        <div class="info-label">Kar (1s)</div>
        <div id="snow" class="info-value">-- mm</div>
      </div>
    </div>
    <div class="info-row">
      <div class="info-item">
        <i class="fas fa-temperature-high"></i>
        <div class="info-label">Min-Max</div>
        <div id="temp-min-max" class="info-value">--°C - --°C</div>
      </div>
    </div>
  `;
  
  extraInfoContainer.innerHTML = extraInfoHTML;
  
  // Var olan card-front elementine ekle
  const cardFront = document.querySelector('.card-front');
  cardFront.appendChild(extraInfoContainer);
}

window.addEventListener("DOMContentLoaded", async () => {
  // UI'ı hazırla: yükleme göster
  loadingElement.classList.add("active");
  
  // HTTPS kontrolü
  if (window.location.protocol === 'http:' && !window.location.hostname.includes('localhost')) {
    console.warn("API güvenlik kısıtlaması: OpenWeatherMap API HTTPS gerektirebilir. Yerel test veya HTTPS kullanın.");
  }
  
  try {
    // Önce ID ile İstanbul'u aramayı dene (daha güvenilir)
    let data = await fetchWeatherById(745044); // İstanbul ID'si
    
    if (!data) {
      // ID ile arama başarısız olursa normal aramayı dene
      data = await fetchWeather("Istanbul");
    }
    
    if (!data) {
      // Son çare olarak Ingilizce yazımı dene
      data = await fetchWeather("Istanbul,TR");
    }
    
    loadingElement.classList.remove("active");
    displayWeather(data);
  } catch (error) {
    console.error("Başlangıç hava durumu yüklenirken hata:", error);
    loadingElement.classList.remove("active");
    errorMessage.classList.add("active");
  }
});

searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  
  if (!city) {
    return;
  }
  
  // Otomatik tamamlama listesini kapat
  //autocompleteList.classList.remove('show');
  
  // Yeni arama fonksiyonumuzu kullan
  searchWeatherForCity(city);
});

cityInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    
    if (!city) {
      return;
    }
    
    // Otomatik tamamlama listesini kapat
    autocompleteList.classList.remove('show');
    
    // Yeni arama fonksiyonumuzu kullan
    searchWeatherForCity(city);
  }
});

async function fetchWeatherById(cityId) {
  try {
    const apiUrl = `${apiBaseUrl}/weather?id=${cityId}&${defaultParams}&appid=${apiKey}`;
    console.log(`API çağrısı yapılıyor (ID ile): ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API Hatası: ${response.status}`);
      throw new Error("Şehir bulunamadı");
    }
    
    const data = await response.json();
    console.log("API Yanıtı (ID ile):", data);
    
    // ID bazlı sorguda da rüzgar verilerini kontrol et
    if (data.wind) {
      console.log("✅ Rüzgar verileri (ID ile) mevcut:", data.wind);
    } else {
      console.warn("⚠️ Rüzgar verileri (ID ile) bulunamadı");
    }
    
    // ID bazlı sorguda sıcaklık verilerini kontrol et
    if (data.main) {
      console.log("✅ Sıcaklık verileri (ID ile) mevcut:", {
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        feels_like: data.main.feels_like
      });
    } else {
      console.warn("⚠️ Ana sıcaklık verileri (ID ile) bulunamadı");
    }
    
    return data;
  } catch (error) {
    console.error("Hata:", error);
    return null;
  }
}

async function fetchWeatherByCoordinates(lat, lon) {
  try {
    const apiUrl = `${apiBaseUrl}/weather?lat=${lat}&lon=${lon}&${defaultParams}&appid=${apiKey}`;
    console.log(`API çağrısı yapılıyor (Koordinat ile): ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API Hatası: ${response.status}`);
      throw new Error("Konum için hava durumu bulunamadı");
    }
    
    const data = await response.json();
    console.log("API Yanıtı (Koordinat ile):", data);
    
    // Koordinat bazlı sorguda da rüzgar verilerini kontrol et
    if (data.wind) {
      console.log("✅ Rüzgar verileri (koordinat ile) mevcut:", data.wind);
    } else {
      console.warn("⚠️ Rüzgar verileri (koordinat ile) bulunamadı");
    }
    
    // Koordinat bazlı sorguda sıcaklık verilerini kontrol et
    if (data.main) {
      console.log("✅ Sıcaklık verileri (koordinat ile) mevcut:", {
        temp: data.main.temp,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        feels_like: data.main.feels_like
      });
    } else {
      console.warn("⚠️ Ana sıcaklık verileri (koordinat ile) bulunamadı");
    }
    
    return data;
  } catch (error) {
    console.error("Hata:", error);
    return null;
  }
}

async function geocodeCity(cityName) {
  try {
    const limit = 5; // Daha fazla seçenek için limit artırıldı
    const apiUrl = `${geoBaseUrl}/direct?q=${encodeURIComponent(cityName)}&limit=${limit}&appid=${apiKey}`;
    console.log(`Geocoding API çağrısı yapılıyor: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error(`Geocoding API hatası: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Geocoding API Yanıtı:", data);
    
    if (!data || data.length === 0) {
      throw new Error("Şehir bulunamadı");
    }
    
    // Aranan şehir adına en yakın eşleşmeyi bul
    // Küçük harfe çevirip karşılaştırma yapalım
    const searchNameLower = cityName.toLowerCase();
    let bestMatch = data[0]; // Varsayılan olarak ilk sonuç
    
    // Tam eşleşme var mı kontrol et
    for (const location of data) {
      if (location.name.toLowerCase() === searchNameLower) {
        bestMatch = location;
        break; // Tam eşleşme bulundu
      }
    }
    
    return {
      lat: bestMatch.lat,
      lon: bestMatch.lon,
      name: bestMatch.name,
      country: bestMatch.country,
      originalSearch: cityName // Kullanıcının girdiği orijinal şehir adını sakla
    };
  } catch (error) {
    console.error("Geocoding hatası:", error);
    return null;
  }
}

const popularCities = {
  "istanbul": 745044,
  "ankara": 323786,
  "izmir": 311046,
  "antalya": 323777,
  "bursa": 750269
};

/*

*/
const majorCities = [
  { name: "Adana", country: "TR", id: 325363 },
  { name: "Adıyaman", country: "TR", id: 325330 },
  { name: "Afyonkarahisar", country: "TR", id: 325303 },
  { name: "Ağrı", country: "TR", id: 325329 },
  { name: "Amasya", country: "TR", id: 325163 },
  { name: "Ankara", country: "TR", id: 323786 },
  { name: "Antalya", country: "TR", id: 323777 },
  { name: "Artvin", country: "TR", id: 751952 },
  { name: "Aydın", country: "TR", id: 322830 },
  { name: "Balıkesir", country: "TR", id: 751077 },
  { name: "Bilecik", country: "TR", id: 750598 },
  { name: "Bingöl", country: "TR", id: 321079 },
  { name: "Bitlis", country: "TR", id: 321022 },
  { name: "Bolu", country: "TR", id: 750268 },
  { name: "Burdur", country: "TR", id: 321322 },
  { name: "Bursa", country: "TR", id: 750269 },
  { name: "Çanakkale", country: "TR", id: 749780 },
  { name: "Çankırı", country: "TR", id: 749747 },
  { name: "Çorum", country: "TR", id: 749747 },
  { name: "Denizli", country: "TR", id: 317109 },
  { name: "Diyarbakır", country: "TR", id: 316541 },
  { name: "Edirne", country: "TR", id: 315807 },
  { name: "Elazığ", country: "TR", id: 315808 },
  { name: "Erzincan", country: "TR", id: 315795 },
  { name: "Erzurum", country: "TR", id: 315795 },
  { name: "Eskişehir", country: "TR", id: 315808 },
  { name: "Gaziantep", country: "TR", id: 315373 },
  { name: "Giresun", country: "TR", id: 745042 },
  { name: "Gümüşhane", country: "TR", id: 745028 },
  { name: "Hakkari", country: "TR", id: 314830 },
  { name: "Hatay", country: "TR", id: 311044 },
  { name: "Isparta", country: "TR", id: 311071 },
  { name: "Mersin", country: "TR", id: 324828 },
  { name: "İstanbul", country: "TR", id: 745044 },
  { name: "İzmir", country: "TR", id: 311046 },
  { name: "Kars", country: "TR", id: 743165 },
  { name: "Kastamonu", country: "TR", id: 743166 },
  { name: "Kayseri", country: "TR", id: 307513 },
  { name: "Kırklareli", country: "TR", id: 742865 },
  { name: "Kırşehir", country: "TR", id: 742865 },
  { name: "Kocaeli", country: "TR", id: 745028 },
  { name: "Konya", country: "TR", id: 306569 },
  { name: "Kütahya", country: "TR", id: 306571 },
  { name: "Malatya", country: "TR", id: 304922 },
  { name: "Manisa", country: "TR", id: 304825 },
  { name: "Kahramanmaraş", country: "TR", id: 304825 },
  { name: "Mardin", country: "TR", id: 304794 },
  { name: "Muğla", country: "TR", id: 304183 },
  { name: "Muş", country: "TR", id: 304183 },
  { name: "Nevşehir", country: "TR", id: 303830 },
  { name: "Niğde", country: "TR", id: 303830 },
  { name: "Ordu", country: "TR", id: 741240 },
  { name: "Rize", country: "TR", id: 740483 },
  { name: "Sakarya", country: "TR", id: 741098 },
  { name: "Samsun", country: "TR", id: 740263 },
  { name: "Siirt", country: "TR", id: 739600 },
  { name: "Sinop", country: "TR", id: 739598 },
  { name: "Sivas", country: "TR", id: 739598 },
  { name: "Tekirdağ", country: "TR", id: 738927 },
  { name: "Tokat", country: "TR", id: 738926 },
  { name: "Trabzon", country: "TR", id: 738648 },
  { name: "Tunceli", country: "TR", id: 738648 },
  { name: "Şanlıurfa", country: "TR", id: 304919 },
  { name: "Uşak", country: "TR", id: 738025 },
  { name: "Van", country: "TR", id: 298117 },
  { name: "Yozgat", country: "TR", id: 737022 },
  { name: "Zonguldak", country: "TR", id: 737022 },
  { name: "Aksaray", country: "TR", id: 323786 },
  { name: "Bayburt", country: "TR", id: 751952 },
  { name: "Karaman", country: "TR", id: 307513 },
  { name: "Kırıkkale", country: "TR", id: 742865 },
  { name: "Batman", country: "TR", id: 321079 },
  { name: "Şırnak", country: "TR", id: 314830 },
  { name: "Bartın", country: "TR", id: 750598 },
  { name: "Ardahan", country: "TR", id: 751952 },
  { name: "Iğdır", country: "TR", id: 325329 },
  { name: "Yalova", country: "TR", id: 751077 },
  { name: "Karabük", country: "TR", id: 750598 },
  { name: "Kilis", country: "TR", id: 315373 },
  { name: "Osmaniye", country: "TR", id: 315373 },
  { name: "Düzce", country: "TR", id: 750268 }
];

async function searchCityByIdIfAvailable(cityName) {
  const lowerCityName = cityName.toLowerCase();
  const cityId = popularCities[lowerCityName];
  
  if (cityId) {
    console.log(`Şehir ID'si bulundu: ${cityName} -> ${cityId}`);
    return await fetchWeatherById(cityId);
  }
  
  return null;
}


function filterCities(searchText) {
  if (!searchText || searchText.length < 1) {
    return [];
  }
  
  if (/^[^a-zğüşöçıiİA-ZĞÜŞÖÇ\s]+$/.test(searchText)) {
    return [];
  }

  // Türkçe karakterleri normalize et
  const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/ı/gi, 'i')
      .replace(/ğ/gi, 'g')
      .replace(/ü/gi, 'u')
      .replace(/ş/gi, 's')
      .replace(/ö/gi, 'o')
      .replace(/ç/gi, 'c')
      .replace(/İ/gi, 'i');
  };
  
  const normalizedSearch = normalizeText(searchText);
  const isShortQuery = normalizedSearch.length <= 2;
  
  const results = {
    exactMatches: [],
    startsWithMatches: [],
    wordStartsWithMatches: [],
    includesMatches: []
  };

  majorCities.forEach(city => {
    const normalizedCityName = normalizeText(city.name);
    const cityWords = normalizedCityName.split(' ');
    
    // ELSE IF yerine ayrı IF'ler kullan - birden fazla kategoriye girebilsin
    if (normalizedCityName === normalizedSearch) {
      results.exactMatches.push(city);
    }
    
    if (normalizedCityName.startsWith(normalizedSearch)) {
      // Tam eşleşme zaten varsa startsWithMatches'e ekleme
      if (normalizedCityName !== normalizedSearch) {
        results.startsWithMatches.push(city);
      }
    }
    
    if (!isShortQuery && cityWords.some(word => word.startsWith(normalizedSearch))) {
      // Zaten exactMatches veya startsWithMatches'te yoksa ekle
      if (normalizedCityName !== normalizedSearch && !normalizedCityName.startsWith(normalizedSearch)) {
        results.wordStartsWithMatches.push(city);
      }
    }
    
    if (!isShortQuery && normalizedCityName.includes(normalizedSearch)) {
      // Diğer kategorilerde yoksa ekle
      if (normalizedCityName !== normalizedSearch && 
          !normalizedCityName.startsWith(normalizedSearch) && 
          !cityWords.some(word => word.startsWith(normalizedSearch))) {
        results.includesMatches.push(city);
      }
    }
  });

  // Öncelik sırasına göre birleştir
  let allMatches = [
    ...results.exactMatches,
    ...results.startsWithMatches,
    ...results.wordStartsWithMatches,
    ...results.includesMatches
  ];

  return allMatches.slice(0, 3);
}

function displayAutocompleteSuggestions(matches) {
  if (matches.length === 0 && cityInput.value.trim().length >= 1) {
    autocompleteList.innerHTML = '<div class="autocomplete-item">Şehir bulunamadı</div>';
    //autocompleteList.classList.remove('show');
    return;
  }

  const html = matches.map(city => {
    // Aranan metni şehir adında vurgula
    const cityName = city.name;
    const searchText = cityInput.value.trim();
    
    let highlightedName = cityName;
    
    if (searchText && searchText.length >= 1) {
      try {
        // Türkçe karakterleri düzgün eşleştirmek için karakter sınıfları oluştur
        const createTurkishCharacterClass = (char) => {
          const charMap = {
            'i': '[iİıI]',
            'ı': '[iıİI]',
            'İ': '[iıİI]',
            'I': '[iıİI]',
            'g': '[gğGĞ]',
            'ğ': '[gğGĞ]',
            'G': '[gğGĞ]',
            'Ğ': '[gğGĞ]',
            'u': '[uüUÜ]',
            'ü': '[uüUÜ]',
            'U': '[uüUÜ]',
            'Ü': '[uüUÜ]',
            's': '[sşSŞ]',
            'ş': '[sşSŞ]',
            'S': '[sşSŞ]',
            'Ş': '[sşSŞ]',
            'o': '[oöOÖ]',
            'ö': '[oöOÖ]',
            'O': '[oöOÖ]',
            'Ö': '[oöOÖ]',
            'c': '[cçCÇ]',
            'ç': '[cçCÇ]',
            'C': '[cçCÇ]',
            'Ç': '[cçCÇ]'
          };
          return charMap[char] || char;
        };
        
        // Arama metninin tüm karakterlerini Türkçe karakter sınıflarına dönüştür
        let pattern = '';
        for (let i = 0; i < searchText.length; i++) {
          const char = searchText[i];
          // Önce regex özel karakterleri escape et
          const escapedChar = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          pattern += createTurkishCharacterClass(escapedChar);
        }
        
        // Case-insensitive bir şekilde arama metni için düzenli ifade oluştur
        // İçerdiği her karakter için Türkçe karakter sınıfını kullan
        const regex = new RegExp(`(${pattern})`, 'gi');
        
        // Eşleşen metni <strong> etiketleriyle vurgula
        highlightedName = cityName.replace(regex, '<strong>$1</strong>');
      } catch (e) {
        console.error('Vurgulama hatası:', e);
      }
    }
    
    return `
      <div class="autocomplete-item" data-city="${cityName}" data-id="${city.id}" data-country="${city.country}">
        <div class="autocomplete-icon">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="autocomplete-text">
          <span class="autocomplete-name">${highlightedName}</span>
          <span class="autocomplete-country">${getCountryName(city.country)}</span>
        </div>
      </div>
    `;
  }).join('');

  autocompleteList.innerHTML = html;
  autocompleteList.classList.add('show');
  
  // Otomatik tamamlama öğelerine tıklama olayları ekle
  const items = document.querySelectorAll('.autocomplete-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const cityName = item.getAttribute('data-city');
      const cityId = item.getAttribute('data-id');
      cityInput.value = cityName;
      autocompleteList.classList.remove('show');
      
      // Hava durumunu seçilen şehir için ara
      searchWeatherForCity(cityName, cityId);
    });
    
    // Fare ile üzerine gelindiğinde seçili yap
    item.addEventListener('mouseenter', () => {
      // Tüm öğelerden active sınıfını kaldır
      items.forEach(i => i.classList.remove('active'));
      // Bu öğeyi active yap
      item.classList.add('active');
      // Global indeksi güncelle
      currentFocus = Array.from(items).indexOf(item);
    });
  });
}

function getCountryName(countryCode) {
  const countryNames = {
    'TR': 'Türkiye',
    'US': 'Amerika Birleşik Devletleri',
    'GB': 'Birleşik Krallık',
    'DE': 'Almanya',
    'FR': 'Fransa',
    'IT': 'İtalya',
    'ES': 'İspanya',
    'JP': 'Japonya',
    'RU': 'Rusya',
    'AE': 'Birleşik Arap Emirlikleri',
    'NL': 'Hollanda'
  };
  
  return countryNames[countryCode] || countryCode;
}

async function searchWeatherForCity(cityName, cityId) {
  // UI'ı hazırla: bilgileri gizle, yükleme göster
  weatherInfo.classList.remove("active");
  errorMessage.classList.remove("active");
  loadingElement.classList.add("active");
  
  try {
    let data;
    
    // Eğer ID varsa, ID ile ara (daha güvenilir)
    if (cityId) {
      data = await fetchWeatherById(cityId);
    }
    
    // ID ile bulunamazsa veya ID yoksa, geocoding ile ara
    if (!data) {
      const locationData = await geocodeCity(cityName);
      
      if (locationData) {
        data = await fetchWeatherByCoordinates(locationData.lat, locationData.lon);
        loadingElement.classList.remove("active");
        displayWeather(data, locationData.originalSearch);
        return;
      }
    }
    
    // Hala bulunamadıysa doğrudan şehir adıyla ara
    if (!data) {
      data = await fetchWeather(cityName);
    }
    
    loadingElement.classList.remove("active");
    displayWeather(data, cityName);
  } catch (error) {
    console.error("Arama hatası:", error);
    loadingElement.classList.remove("active");
    errorMessage.classList.add("active");
  }
}

let currentFocus = -1;

cityInput.addEventListener('input', (e) => {
  // Her karakter girişinde hemen güncelle
  const searchText = cityInput.value.trim();
  const matches = filterCities(searchText);
  displayAutocompleteSuggestions(matches);
  currentFocus = -1; // Seçili öğeyi sıfırla
});

cityInput.addEventListener('click', (e) => {
  const searchText = cityInput.value.trim();
  if (searchText.length >= 1) {
    const matches = filterCities(searchText);
    displayAutocompleteSuggestions(matches);
  }
});

cityInput.addEventListener('keydown', (e) => {
  const autocompleteItems = document.querySelectorAll('.autocomplete-item');
  
  if (autocompleteItems.length === 0) return;
  
  // Aşağı ok tuşu
  if (e.key === 'ArrowDown') {
    currentFocus++;
    if (currentFocus >= autocompleteItems.length) currentFocus = 0;
    setActiveItem(autocompleteItems);
    e.preventDefault(); // Cursor'ın input içinde hareket etmesini engelle
  } 
  // Yukarı ok tuşu
  else if (e.key === 'ArrowUp') {
    currentFocus--;
    if (currentFocus < 0) currentFocus = autocompleteItems.length - 1;
    setActiveItem(autocompleteItems);
    e.preventDefault(); // Cursor'ın input içinde hareket etmesini engelle
  } 
  // Enter tuşu - seçili öğeyi seç
  else if (e.key === 'Enter' && currentFocus > -1) {
    if (autocompleteList.classList.contains('show') && autocompleteItems[currentFocus]) {
      autocompleteItems[currentFocus].click();
      e.preventDefault(); // Default Enter davranışını engelle
    }
  }
});

function setActiveItem(items) {
  // Önce tüm "active" classlarını kaldır
  items.forEach(item => {
    item.classList.remove('active');
  });
  
  // Seçili öğeyi işaretle
  if (currentFocus >= 0) {
    items[currentFocus].classList.add('active');
    
    // Scroll gerekiyorsa, görünür alanda tut
    const container = autocompleteList;
    const activeItem = items[currentFocus];
    
    // Eğer öğe görünür alanın altında ise
    if (activeItem.offsetTop + activeItem.clientHeight > 
        container.scrollTop + container.clientHeight) {
      container.scrollTop = activeItem.offsetTop + activeItem.clientHeight - 
                            container.clientHeight;
    }
    // Eğer öğe görünür alanın üstünde ise
    else if (activeItem.offsetTop < container.scrollTop) {
      container.scrollTop = activeItem.offsetTop;
    }
  }
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.autocomplete-container')) {
    autocompleteList.classList.remove('show');
  }
});

cityInput.addEventListener('focus', () => {
  const searchText = cityInput.value.trim();
  if (searchText.length >= 1) {
    const matches = filterCities(searchText);
    displayAutocompleteSuggestions(matches);
  }
});


const locationBtn = document.getElementById("location-btn");

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    // UI'ı hazırla
    weatherInfo.classList.remove("active");
    errorMessage.classList.remove("active");
    loadingElement.classList.add("active");
    
    navigator.geolocation.getCurrentPosition(
      // Başarılı konum alma
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log(`Konum alındı: Lat: ${latitude}, Lon: ${longitude}`);
          
          const data = await fetchWeatherByCoordinates(latitude, longitude);
          
          loadingElement.classList.remove("active");
          // Konuma dayalı hava durumunda kullanıcı araması yok, bu nedenle sadece API'den gelen şehir adı kullanılır
          displayWeather(data);
        } catch (error) {
          console.error("Konum bazlı hava durumu hatası:", error);
          loadingElement.classList.remove("active");
          errorMessage.classList.add("active");
        }
      },
      // Konum alma hatası
      (error) => {
        console.error("Konum alma hatası:", error);
        loadingElement.classList.remove("active");
        errorMessage.classList.add("active");
      }
    );
  } else {
    alert("Tarayıcınız konum hizmetini desteklemiyor.");
    errorMessage.classList.add("active");
  }
});

let map = null;
let marker = null;
let currentCityCoords = { lat: 41.0082, lng: 28.9784 }; // Varsayılan konum (İstanbul)
let mapInitialized = false;

function initMap() {
  try {
    console.log("initMap çağrıldı, harita başlatılıyor...");
    
    // Map DOM elementi var mı kontrol et
    const mapElement = document.getElementById("map");
    if (!mapElement) {
      console.error("Map DOM elementi bulunamadı!");
      return;
    }
    
    // İlk başta harita oluşturulduğunda İstanbul'u göster
    map = new google.maps.Map(mapElement, {
      center: currentCityCoords,
      zoom: 10,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        }
      ]
    });
    
    console.log("Harita oluşturuldu:", map);
    
    // İlk işaretleyici (marker)
    marker = new google.maps.Marker({
      position: currentCityCoords,
      map: map,
      animation: google.maps.Animation.DROP,
      title: "İstanbul"
    });
    
    // Harita yüklendiğinde bayrak ayarla
    mapInitialized = true;
    console.log("Harita başarıyla başlatıldı");
    
    // Loading mesajını kaldır - mapElement zaten yukarıda tanımlı
    if (mapElement) {
      mapElement.classList.add('loaded');
    }
    
    // Eğer kart ters çevrilmişse haritayı yeniden boyutlandır
    if (document.querySelector('.card').classList.contains('flipped')) {
      console.log("Kart zaten çevrilmiş, haritayı yeniden boyutlandırıyorum");
      setTimeout(() => {
        resizeAndCenterMap();
      }, 500);
    }
  } catch (error) {
    console.error("Harita başlatma hatası:", error);
  }
}

window.initMap = initMap;

function updateMap(lat, lng, cityName) {
  console.log(`updateMap çağrıldı: ${cityName}, ${lat}, ${lng}`);
  
  // Yeni koordinatları kaydet
  currentCityCoords = { lat, lng };
  
  // Eğer harita henüz yüklenmemişse, sadece koordinatları kaydedip çık
  if (!map || !mapInitialized) {
    console.log("Harita henüz yüklenmedi, sadece koordinatlar kaydedildi");
    return;
  }
  
  try {
    console.log("Harita güncelleniyor...");
    
    // Harita merkezini güncelle
    map.setCenter(currentCityCoords);
    
    // Mevcut işaretleyiciyi kaldır ve yenisini ekle
    if (marker) {
      marker.setMap(null);
    }
    
    // Özelleştirilmiş işaretleyici ikonu oluştur
    const markerIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#3498db',
      fillOpacity: 0.8,
      strokeColor: '#2980b9',
      strokeWeight: 2,
      scale: 8
    };
    
    // İşaretleyiciyi ekle
    marker = new google.maps.Marker({
      position: currentCityCoords,
      map: map,
      animation: google.maps.Animation.DROP,
      title: cityName,
      icon: markerIcon
    });
    
    // Bilgi penceresi oluştur
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="font-family: 'Segoe UI', sans-serif; padding: 5px;"><b>${cityName}</b><br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</div>`
    });
    
    // İşaretleyiciye tıklandığında bilgi penceresini göster
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
    
    // Harita yakınlaştırma seviyesini ayarla
    map.setZoom(11);
    
    console.log("Harita başarıyla güncellendi");
  } catch (error) {
    console.error("Harita güncelleme hatası:", error);
  }
}

function resizeAndCenterMap() {
  if (map && mapInitialized) {
    console.log("Harita yeniden boyutlandırılıyor...");
    
    // Haritayı yeniden boyutlandır ve merkezle
    google.maps.event.trigger(map, 'resize');
    map.setCenter(currentCityCoords);
    
    // Marker animasyonunu tetikle
    if (marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      // 1.5 saniye sonra animasyonu durdur
      setTimeout(() => {
        marker.setAnimation(null);
      }, 1500);
    }
    
    console.log("Harita yeniden boyutlandırıldı ve merkezlendi");
  } else {
    console.log("Harita henüz yüklenmediği için yeniden boyutlandırılamadı");
  }
}

document.querySelector('.card').addEventListener('transitionend', function(e) {
  if (e.propertyName === 'transform' && this.classList.contains('flipped')) {
    console.log("Kart çevirme animasyonu tamamlandı, harita yeniden boyutlandırılıyor");
    resizeAndCenterMap();
  }
});

showMapBtn.addEventListener("click", () => {
  console.log("Harita gösterme butonu tıklandı");
  const card = document.querySelector('.card');
  card.classList.add('flipped');
  
  // Kart çevrildiğinde harita yeniden boyutlandırılmalı (animasyon sırasında)
  setTimeout(() => {
    // transitionend event'i ile işlem yapılacak, ancak ekstra güvenlik olarak
    // timeout ile de kontrol edelim
    resizeAndCenterMap();
  }, 800); // Kart çevirme animasyonunun süresi kadar bekle
});

backToWeatherBtn.addEventListener("click", () => {
  console.log("Hava durumuna dönüş butonu tıklandı");
  const card = document.querySelector('.card');
  card.classList.remove('flipped');
});

function testWindConversion() {
  console.log("=== Rüzgar Birim Dönüşüm Testi ===");
  
  // Test değerleri (m/s cinsinden) - gerçek hava durumu değerleri
  const testWindSpeeds = [
    { ms: 0, desc: "Rüzgarsız" },
    { ms: 1, desc: "Hafif rüzgar" },
    { ms: 3, desc: "Hafif esinti" },
    { ms: 5, desc: "Orta esinti" },
    { ms: 8, desc: "Taze esinti" },
    { ms: 12, desc: "Kuvvetli rüzgar" },
    { ms: 15, desc: "Sert rüzgar" },
    { ms: 20, desc: "Fırtına" }
  ];
  
  testWindSpeeds.forEach(({ ms, desc }) => {
    const kmh = Math.round(ms * 3.6);
    console.log(`${ms} m/s = ${kmh} km/h (${desc})`);
  });
  
  // Rüzgar yönü testi
  console.log("\n=== Rüzgar Yönü Testi ===");
  const testDegrees = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  const directions = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
  
  testDegrees.forEach(deg => {
    const index = Math.round(deg / 45) % 8;
    console.log(`${deg}° = ${directions[index]}`);
  });
  
  console.log("=== Test Tamamlandı ===");
}

async function testApiData() {
  console.log("=== API Veri Testi Başlatılıyor ===");
  
  try {
    // Test şehirleri
    const testCities = ['Istanbul', 'Ankara', 'London'];
    
    for (const city of testCities) {
      console.log(`\n--- ${city} için API testi ---`);
      const data = await fetchWeather(city);
      
      if (data) {
        console.log(`✅ ${city} API başarılı`);
        console.log(`📊 Şu anki sıcaklık: ${data.main?.temp}°C`);
        console.log(`🌡️ Min sıcaklık: ${data.main?.temp_min}°C`);
        console.log(`🌡️ Max sıcaklık: ${data.main?.temp_max}°C`);
        console.log(`💨 Rüzgar hızı: ${data.wind?.speed} m/s`);
        
        // Min-max mantık kontrolü
        if (data.main?.temp_min !== undefined && data.main?.temp_max !== undefined && data.main?.temp !== undefined) {
          const min = data.main.temp_min;
          const max = data.main.temp_max;
          const current = data.main.temp;
          
          if (min <= current && current <= max) {
            console.log(`✅ Min-Max değerleri mantıklı: ${min}°C ≤ ${current}°C ≤ ${max}°C`);
          } else {
            console.log(`⚠️ Min-Max değerleri anormal: Min=${min}°C, Şu anki=${current}°C, Max=${max}°C`);
          }
        } else {
          console.log(`❌ Min-Max veya şu anki sıcaklık verisi eksik`);
        }
      } else {
        console.log(`❌ ${city} API başarısız`);
      }
    }
  } catch (error) {
    console.error("API test hatası:", error);
  }
  
  console.log("\n=== API Veri Testi Tamamlandı ===");
}


function loadGoogleMapsScript() {
  // İlk olarak initMap fonksiyonunun tanımlı olduğundan emin ol
  if (typeof window.initMap !== 'function') {
    console.error('initMap fonksiyonu henüz tanımlanmadı!');
    setTimeout(loadGoogleMapsScript, 100); 
    return;
  }
  
  const script = document.createElement('script');
  // Google Maps API anahtarı ile harita yükleme
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDw2tqWxldIJgur7Iuw8ErU3J5DIO8h0yA&v=weekly&callback=initMap";
  script.async = true;
  script.defer = true;
  script.onerror = function() {
    console.error('Google Maps API yüklenemedi! API anahtarı veya internet bağlantısını kontrol edin.');
    alert('Google Maps yüklenemedi. Lütfen internet bağlantınızı kontrol edin.');
  };
  script.onload = function() {
    console.log('Google Maps API başarıyla yüklendi');
  };
  document.body.appendChild(script);
  
  console.log("Google Maps API yükleniyor...");
}


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(loadGoogleMapsScript, 500); 
  console.log("Sayfa yüklendi, harita yükleniyor...");
});

