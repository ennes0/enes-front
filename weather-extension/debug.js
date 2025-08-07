// Weather Widget Extension Debug Script
// Chrome Console'da çalıştırın: chrome://extensions/ -> Weather Widget -> Inspect views: background page

console.log('=== Weather Widget Debug ===');

// Extension durumunu kontrol et
chrome.storage.local.get(['widgetSettings', 'favorites'], (result) => {
  console.log('Storage içeriği:', result);
});

// Weather service'i test et
try {
  if (typeof weatherService !== 'undefined') {
    console.log('✅ WeatherService mevcut');
    
    // Test API call
    weatherService.getWeatherData({ city: 'Istanbul' })
      .then(data => {
        console.log('✅ API Test başarılı:', data);
      })
      .catch(error => {
        console.error('❌ API Test başarısız:', error);
      });
  } else {
    console.error('❌ WeatherService tanımlı değil');
  }
} catch (error) {
  console.error('❌ WeatherService test hatası:', error);
}

// Content script durumunu kontrol et
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, {action: 'checkWidget'}, (response) => {
    if (chrome.runtime.lastError) {
      console.error('❌ Content script iletişim hatası:', chrome.runtime.lastError);
    } else {
      console.log('✅ Content script yanıtı:', response);
    }
  });
});

// Alarm kontrolü
chrome.alarms.getAll((alarms) => {
  console.log('Aktif alarmlar:', alarms);
});

// Permissions kontrolü
chrome.permissions.getAll((permissions) => {
  console.log('Extension permissions:', permissions);
});

console.log('=== Debug Tamamlandı ===');
