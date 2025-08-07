# Weather Widget Browser Extension 🌤️

Her web sayfasında hava durumu widget'ını görüntülemenizi sağlayan modern browser extension'ı.

## 📋 Özellikler

### ✨ Temel Özellikler
- **Her Sayfada Widget**: Tüm web sitelerinde floating weather widget
- **Gerçek Zamanlı Hava Durumu**: OpenWeatherMap API entegrasyonu
- **Favori Şehirler**: En sevdiğiniz şehirleri kaydedin
- **Konum Tabanlı**: GPS ile otomatik konum algılama
- **Responsive Tasarım**: Mobil ve desktop uyumlu

### 🎨 Görünüm Özellikleri
- **3 Boyut Seçeneği**: Küçük, Orta, Büyük
- **Tema Desteği**: Açık ve Koyu tema
- **Şeffaflık Ayarı**: %30-100 arası ayarlanabilir
- **Pozisyon Seçimi**: 4 köşe konumu seçeneği
- **Animasyonlar**: Smooth geçiş efektleri

### 🔧 Gelişmiş Özellikler
- **Otomatik Gizleme**: Mouse dışında şeffaflaşma
- **Sürükle & Bırak**: Widget pozisyonunu değiştirme
- **Akıllı Önbellek**: 5 dakika cache sistemi
- **Hata Yönetimi**: Graceful error handling
- **Offline Destek**: Önbellek ile çalışma

## 🚀 Kurulum

### Chrome/Edge (Manuel Yükleme)
1. Chrome'da `chrome://extensions/` adresine gidin
2. Sağ üstten "Developer mode" açın
3. "Load unpacked" butonuna tıklayın
4. `weather-extension` klasörünü seçin
5. Extension otomatik yüklenecek

### Firefox (Geliştirici Modu)
1. Firefox'ta `about:debugging` adresine gidin
2. "This Firefox" sekmesini seçin
3. "Load Temporary Add-on" tıklayın
4. `manifest.json` dosyasını seçin

## 📁 Dosya Yapısı

```
weather-extension/
├── manifest.json          # Extension yapılandırması
├── content.js             # Ana widget script'i
├── background.js          # Service worker
├── widget.css            # Widget stilleri
├── popup.html            # Ayarlar popup'ı
├── popup.js              # Popup fonksiyonalitesi
└── icons/                # Extension ikonları
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## ⚙️ API Yapılandırması

Extension OpenWeatherMap API kullanır. Kendi API anahtarınızı kullanmak için:

1. [OpenWeatherMap](https://openweathermap.org/api) sitesinden ücretsiz API key alın
2. `content.js` ve `background.js` dosyalarındaki `API_KEY` değişkenini güncelleyin

```javascript
this.API_KEY = "YOUR_API_KEY_HERE";
```

## 🎛️ Ayarlar

Extension popup'ından aşağıdaki ayarları yapabilirsiniz:

### Genel Ayarlar
- **Widget Durumu**: Açık/Kapalı
- **Pozisyon**: Sağ üst, Sol üst, Sağ alt, Sol alt
- **Boyut**: Küçük, Orta, Büyük
- **Tema**: Açık, Koyu
- **Şeffaflık**: %30-100

### Davranış Ayarları
- **Otomatik Gizle**: Mouse dışında şeffaflaşma
- **Animasyonlar**: Geçiş efektleri
- **Detayları Göster**: Nem, rüzgar, basınç
- **Favorileri Göster**: Favori şehirler listesi

### Favori Şehirler
- Yeni şehir ekleme
- Mevcut şehirleri çıkarma
- Hızlı şehir değişimi

## 🔗 Widget Kontrolleri

### Başlık Çubuğu
- **Sürükle**: Widget'ı hareket ettirin
- **Minimize**: Widget'ı küçültün/büyütün
- **Yenile**: Hava durumunu güncelleyin
- **Ayarlar**: Popup ayarlarını açın
- **Kapat**: Widget'ı gizleyin

### Ana Alan
- **Sıcaklık**: Anlık sıcaklık
- **Açıklama**: Hava durumu açıklaması
- **Hissedilen**: Hissedilen sıcaklık
- **Detaylar**: Rüzgar, nem, basınç

### Alt Alan
- **Son Güncelleme**: Güncelleme zamanı
- **Konum**: GPS konum butonu

## 🛠️ Geliştirme

### Teknolojiler
- **Manifest V3**: Modern Chrome extension API
- **Vanilla JavaScript**: Framework dependency yok
- **Modern CSS**: Flexbox, Grid, CSS Variables
- **Service Worker**: Background processing

### Geliştirici Modu
```bash
# Extension'ı geliştirme modunda yükleyin
# Chrome DevTools ile debug yapabilirsiniz

# Content Script Debug
console.log açıklamaları content.js içinde

# Background Script Debug
chrome://extensions/ -> Inspect views: background page

# Popup Debug
Extension icon'a sağ tık -> "Inspect popup"
```

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**Widget görünmüyor:**
- Extension'ın etkin olduğunu kontrol edin
- Developer Console'da hata mesajlarına bakın
- Sayfayı yenileyin (F5)

**API çalışmıyor:**
- Internet bağlantınızı kontrol edin
- API key'in geçerli olduğunu kontrol edin
- Rate limit aşımı olabilir (dakikada 60 istek)

**Ayarlar kaybolmuş:**
- Chrome'un storage iznini kontrol edin
- Extension'ı yeniden yükleyin

### Debug Modları
```javascript
// Content script debug
localStorage.setItem('weatherWidgetDebug', 'true');

// Background script debug
chrome.storage.local.set({debugMode: true});
```

## 📊 Performans

### Optimizasyonlar
- **Smart Caching**: 5 dakika API cache
- **Lazy Loading**: Widget ihtiyaç anında yüklenir
- **Event Delegation**: Efficient event handling
- **Debounced Updates**: Rate limited API calls

### Kaynak Kullanımı
- **Memory**: ~2-5MB RAM usage
- **CPU**: Minimal background processing
- **Network**: ~1KB per API call
- **Storage**: ~10KB local storage

## 🔐 Güvenlik

### İzinler
- **storage**: Ayarlar ve favoriler için
- **geolocation**: Konum tabanlı hava durumu
- **activeTab**: Aktif sekme erişimi
- **background**: Service worker çalıştırma

### Veri Gizliliği
- **Local Storage**: Veriler sadece cihazınızda
- **No Tracking**: Kullanıcı davranışı takibi yok
- **Secure APIs**: HTTPS bağlantıları
- **No Data Collection**: Kişisel veri toplama yok

## 📱 Uyumluluk

### Desteklenen Tarayıcılar
- ✅ Chrome 88+ (Manifest V3)
- ✅ Edge 88+ (Chromium)
- ✅ Opera 74+
- ⚠️ Firefox (Manifest V2 gerekli)
- ❌ Safari (WebExtensions gerekli)

### Desteklenen Platformlar
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu 18+)
- ✅ ChromeOS

## 🎯 Gelecek Özellikler

### v1.1 Planları
- [ ] 7 günlük hava durumu tahmini
- [ ] Hava durumu uyarıları
- [ ] Widget teması özelleştirme
- [ ] Keyboard shortcuts

### v1.2 Planları
- [ ] Hava radar entegrasyonu
- [ ] Çoklu lokasyon desteği
- [ ] Export/Import ayarları
- [ ] Gelişmiş animasyonlar

### v2.0 Vizyonu
- [ ] AI tabanlı hava tahmini
- [ ] Social sharing özellikleri
- [ ] Weather-based recommendations
- [ ] Progressive Web App desteği

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'ı push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 👨‍💻 Geliştirici

- **Enes** - *Full Stack Developer*
- GitHub: [@ennes0](https://github.com/ennes0)
- Portfolio: [enes-front](https://github.com/ennes0/enes-front)

## 🙏 Teşekkürler

- [OpenWeatherMap](https://openweathermap.org/) - Weather API
- [Font Awesome](https://fontawesome.com/) - Icons
- Chrome Extensions Team - Manifest V3 documentation

## 📞 Destek

Sorunlar için GitHub Issues kullanın veya:
- Email: [developer@example.com]
- Discord: [Weather Widget Community]

---

**Weather Widget Extension** - Her sayfada hava durumu! 🌤️
