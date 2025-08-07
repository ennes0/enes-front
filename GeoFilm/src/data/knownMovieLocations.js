// Bilinen film çekim lokasyonları - TMDb ID'leri ile eşleştirilmiş
export const knownMovieLocations = {
  // Skyfall (2012) - TMDb ID: 37724
  37724: [
    {
      name: "Istanbul Grand Bazaar",
      city: "Istanbul",
      country: "Turkey",
      coordinates: [41.0106, 28.9683],
      scene: "Opening motorcycle chase sequence",
      description: "James Bond'un motosikletle kovalamaca sahnesi çekildiği tarihi Kapalıçarşı. Daniel Craig ve dublörlerinin 2 hafta boyunca çekim yaptığı ikonik lokasyon.",
      filmingDate: "2012-04-25",
      duration: "8 dakika",
      trivia: "Çekim sırasında bazı dükkanlar geçici olarak kapatıldı ve özel izinler alındı."
    },
    {
      name: "Eminönü Rooftops",
      city: "Istanbul", 
      country: "Turkey",
      coordinates: [41.0082, 28.9784],
      scene: "Rooftop motorcycle chase",
      description: "Bond'un çatılarda motosiklet kovalamacası yaptığı sahne. İstanbul'un tarihi siluetini gösteren muhteşem çekim açıları.",
      filmingDate: "2012-04-26"
    },
    {
      name: "National Gallery",
      city: "London",
      country: "UK", 
      coordinates: [51.5089, -0.1283],
      scene: "Bond meets Q",
      description: "Bond'un Q ile ilk karşılaştığı müze sahnesi."
    }
  ],

  // La La Land (2016) - TMDb ID: 313369
  313369: [
    {
      name: "Griffith Observatory",
      city: "Los Angeles",
      country: "USA",
      coordinates: [34.1184, -118.3004],
      scene: "Planetarium dance sequence", 
      description: "Sebastian ve Mia'nın büyülü dans sahnesini gerçekleştirdiği Los Angeles'ın en ikonik gözlemevi. Şehrin muhteşem manzarasına karşı çekilen romantik sahne.",
      filmingDate: "2015-08-15",
      trivia: "Sahne gün batımında çekildi ve özel aydınlatma kullanıldı."
    },
    {
      name: "Angels Flight Railway",
      city: "Los Angeles",
      country: "USA",
      coordinates: [34.0506, -118.2494],
      scene: "Romantic walk scene",
      description: "Çiftin romantik yürüyüş sahnesi çekildiği tarihi funicular demiryolu."
    },
    {
      name: "Hermosa Beach Pier",
      city: "Los Angeles", 
      country: "USA",
      coordinates: [33.8619, -118.4017],
      scene: "Sebastian's jazz club scene",
      description: "Sebastian'ın jazz kulübü sahnesinin çekildiği pier lokasyonu."
    }
  ],

  // Inception (2010) - TMDb ID: 27205
  27205: [
    {
      name: "Pont de Bir-Hakeim",
      city: "Paris",
      country: "France",
      coordinates: [48.8554, 2.2886], 
      scene: "Arthur and Ariadne walking scene",
      description: "Arthur'un Ariadne'ye rüya mimarisini öğrettiği sahne. Paris'in ikonik köprüsünde çekilen büyüleyici sekans.",
      trivia: "Köprü 1903'te inşa edilmiş ve Eiffel Kulesi'ne yakınlığıyla ünlü."
    },
    {
      name: "Château de Fontainebleau", 
      city: "Fontainebleau",
      country: "France",
      coordinates: [48.4021, 2.7],
      scene: "Saito's limbo world",
      description: "Saito'nun limbo dünyası sahnesinin çekildiği muhteşem Fransız château'su."
    },
    {
      name: "University College London",
      city: "London", 
      country: "UK",
      coordinates: [51.5246, -0.1340],
      scene: "Ariadne's architecture class",
      description: "Ariadne'nin mimarlık dersi sahnesinin çekildiği üniversite."
    }
  ],

  // The Dark Knight (2008) - TMDb ID: 155
  155: [
    {
      name: "Chicago Board of Trade Building",
      city: "Chicago",
      country: "USA",
      coordinates: [41.8781, -87.6298],
      scene: "Wayne Enterprises Building",
      description: "Wayne Enterprises'ın dış görünümü için kullanılan gökdelen. Batman'in ofis sahneleri burada çekildi.",
      trivia: "1930 yılında inşa edilen Art Deco stili bina."
    },
    {
      name: "Lower Wacker Drive",
      city: "Chicago", 
      country: "USA",
      coordinates: [41.8868, -87.6357],
      scene: "Batmobile chase sequence", 
      description: "Joker'in kamyonu ile kovalamaca sahnesinin çekildiği ünlü Chicago yolu."
    }
  ],

  // Casablanca (1942) - TMDb ID: 289
  289: [
    {
      name: "Place Mohammed V",
      city: "Casablanca",
      country: "Morocco",
      coordinates: [33.5975, -7.6197],
      scene: "City center scenes",
      description: "Şehir merkezi sahnelerinin çekildiği ana meydan."
    }
  ],

  // Amélie (2001) - TMDb ID: 194
  194: [
    {
      name: "Café des Deux Moulins",
      city: "Paris", 
      country: "France",
      coordinates: [48.8841, 2.3387],
      scene: "Amélie's workplace",
      description: "Amélie'nin çalıştığı kafe. Film sonrası turistik bir mekan haline geldi.",
      trivia: "Hala açık olan kafe, film hayranları tarafından sıkça ziyaret ediliyor."
    },
    {
      name: "Sacré-Cœur Basilica",
      city: "Paris",
      country: "France", 
      coordinates: [48.8867, 2.3431],
      scene: "Montmartre scenes",
      description: "Montmartre bölgesi sahnelerinin çekildiği basilika."
    }
  ],

  // The Matrix (1999) - TMDb ID: 603
  603: [
    {
      name: "Martin Place",
      city: "Sydney",
      country: "Australia",
      coordinates: [-33.8688, 151.2093],
      scene: "Subway station entrance",
      description: "Metro istasyonu giriş sahnesinin çekildiği Sydney meydanı."
    }
  ],

  // Lost in Translation (2003) - TMDb ID: 153
  153: [
    {
      name: "Park Hyatt Tokyo",
      city: "Tokyo",
      country: "Japan", 
      coordinates: [35.6762, 139.7267],
      scene: "Hotel bar scenes",
      description: "Bob ve Charlotte'ın kaldığı otel. New York Bar'da çekilen sahneler.",
      trivia: "Otelin 52. katındaki bar, gerçekten şehrin muhteşem manzarasını sunuyor."
    },
    {
      name: "Shibuya Crossing",
      city: "Tokyo",
      country: "Japan",
      coordinates: [35.6598, 139.7006], 
      scene: "Charlotte walking alone",
      description: "Charlotte'ın yalnız yürüyüş sahnesinin çekildiği dünyaca ünlü kavşak."
    }
  ],

  // Midnight in Paris (2011) - TMDb ID: 59436
  59436: [
    {
      name: "Shakespeare and Company",
      city: "Paris",
      country: "France",
      coordinates: [48.8527, 2.3467],
      scene: "Gil browsing books", 
      description: "Gil'in kitap mağazasında dolaştığı sahne. Ünlü İngilizce kitap mağazası."
    },
    {
      name: "Pont Alexandre III",
      city: "Paris",
      country: "France",
      coordinates: [48.8634, 2.3125],
      scene: "Gil and Inez walking",
      description: "Gil ve Inez'in yürüyüş sahnesinin çekildiği muhteşem köprü."
    }
  ],

  // Star Wars: Episode IV - A New Hope (1977)
  11: [
    {
      name: "Tatooine Film Set",
      city: "Tozeur",
      country: "Tunisia",
      coordinates: [33.9197, 8.1335],
      scene: "Tatooine desert scenes",
      description: "Luke Skywalker'ın ev gezegeni Tatooine sahnelerinin çekildiği çöl bölgesi."
    },
    {
      name: "Tikal Ruins",
      city: "Tikal",
      country: "Guatemala",
      coordinates: [17.2223, -89.6226],
      scene: "Rebel base on Yavin 4",
      description: "İsyancıların üssü Yavin 4 gezegenindeki tapınak sahneleri."
    }
  ],

  // The Godfather (1972)
  238: [
    {
      name: "Corleone Town",
      city: "Corleone",
      country: "Italy",
      coordinates: [37.8159, 13.3009],
      scene: "Sicily scenes",
      description: "Michael Corleone'nin Sicilya'daki sahnelerinin çekildiği tarihi kasaba."
    },
    {
      name: "Bar Vitelli",
      city: "Savoca",
      country: "Italy", 
      coordinates: [37.9453, 15.3308],
      scene: "Wedding scenes",
      description: "Michael'ın Sicilya'daki düğün sahnelerinin çekildiği pintoresk köy."
    }
  ],

  // Titanic (1997)
  597: [
    {
      name: "Harland & Wolff Shipyard",
      city: "Belfast",
      country: "Northern Ireland",
      coordinates: [54.5973, -5.9301],
      scene: "Shipyard scenes",
      description: "Titanic'in inşa edildiği tarihi tersane sahneslerinin çekildiği yer."
    },
    {
      name: "Halifax Harbour",
      city: "Halifax",
      country: "Canada",
      coordinates: [44.6488, -63.5752],
      scene: "Port scenes",
      description: "Liman sahnelerinin çekildiği Atlantik kıyısındaki şehir."
    }
  ],

  // Avatar (2009)
  19995: [
    {
      name: "Hallelujah Mountains",
      city: "Zhangjiajie",
      country: "China",
      coordinates: [29.1175, 110.4792],
      scene: "Pandora floating mountains",
      description: "Pandora gezegenindeki yüzen dağlara ilham veren muhteşem kaya formasyonları."
    },
    {
      name: "Li River Karst Landscape",
      city: "Guilin",
      country: "China",
      coordinates: [25.2342, 110.1693],
      scene: "Landscape inspiration",
      description: "Pandora'nın doğal güzelliklerine ilham veren Li Nehri manzaraları."
    }
  ],

  // The Avengers (2012)
  24428: [
    {
      name: "Public Square",
      city: "Cleveland",
      country: "USA",
      coordinates: [41.4993, -81.6944],
      scene: "Stuttgart scene",
      description: "Loki'nin Stuttgart sahnesinin çekildiği şehir merkezi."
    },
    {
      name: "Grand Central Terminal",
      city: "New York",
      country: "USA",
      coordinates: [40.7829, -73.9654],
      scene: "Final battle",
      description: "Chitauri istilasına karşı final savaşının çekildiği Times Square ve çevresi."
    }
  ],

  // Forrest Gump (1994)
  13: [
    {
      name: "Chippewa Square",
      city: "Savannah",
      country: "USA",
      coordinates: [32.0835, -81.0998],
      scene: "Bus stop bench",
      description: "Forrest'ın hikayesini anlattığı ünlü otobüs durağı bankının bulunduğu park."
    },
    {
      name: "Monument Valley Navajo Tribal Park",
      city: "Monument Valley",
      country: "USA",
      coordinates: [36.9988, -110.0985],
      scene: "Running scenes",
      description: "Forrest'ın ünlü koşu sahnesinin çekildiği çarpıcı çöl manzarası."
    }
  ],

  // The Lord of the Rings: The Fellowship of the Ring (2001)
  120: [
    {
      name: "Hobbiton Movie Set",
      city: "Matamata",
      country: "New Zealand",
      coordinates: [-37.8813, 175.7750],
      scene: "Hobbiton",
      description: "Hobbit köyü Hobbiton'un çekildiği büyülü yeşil tepeler."
    },
    {
      name: "Remarkables Mountain Range",
      city: "Queenstown",
      country: "New Zealand",
      coordinates: [-45.0312, 168.6626],
      scene: "Various Middle-earth scenes",
      description: "Orta Dünya'nın çeşitli sahnelerinin çekildiği nefes kesici dağ manzaraları."
    }
  ],

  // Pulp Fiction (1994)
  680: [
    {
      name: "Hawthorne Grill",
      city: "Los Angeles",
      country: "USA",
      coordinates: [34.0522, -118.2437],
      scene: "Diner scenes",
      description: "Vincent ve Jules'un ünlü lokanta sahnelerinin çekildiği LA restorânları."
    },
    {
      name: "Jack Rabbit Slim's Set",
      city: "Hawthorne",
      country: "USA",
      coordinates: [33.9164, -118.3526],
      scene: "Jack Rabbit Slim's",
      description: "Vincent ve Mia'nın dans ettiği retro restoran sahnesinin çekildiği yer."
    }
  ],

  // The Dark Knight (2008)
  155: [
    {
      name: "Chicago Downtown",
      city: "Chicago",
      country: "USA",
      coordinates: [41.8781, -87.6298],
      scene: "Gotham City",
      description: "Gotham City olarak kullanılan şehrin gökdelen manzaraları ve sokak sahneleri."
    },
    {
      name: "Heinz Field",
      city: "Pittsburgh",
      country: "USA",
      coordinates: [40.4406, -79.9959],
      scene: "Stadium explosion",
      description: "Stadyum patlama sahnesinin çekildiği Heinz Field."
    }
  ],

  // Inception (2010)
  27205: [
    {
      name: "Paris Pont de Bir-Hakeim",
      city: "Paris",
      country: "France",
      coordinates: [48.8566, 2.3522],
      scene: "Folding city",
      description: "Şehrin katlanma sahnesinin çekildiği Pont de Bir-Hakeim köprüsü ve çevresi."
    },
    {
      name: "Tokyo Cityscape",
      city: "Tokyo",
      country: "Japan",
      coordinates: [35.6762, 139.6503],
      scene: "City scenes",
      description: "Rüya içinde rüya sahnelerinin çekildiği modern Tokyo manzaraları."
    }
  ],

  // The Matrix (1999)
  603: [
    {
      name: "Sydney CBD",
      city: "Sydney",
      country: "Australia", 
      coordinates: [-33.8688, 151.2093],
      scene: "Neo's apartment and office",
      description: "Neo'nun yaşadığı ve çalıştığı binaların çekildiği şehir merkezi."
    },
    {
      name: "Chicago Loop",
      city: "Chicago",
      country: "USA",
      coordinates: [41.8781, -87.6298],
      scene: "Additional city scenes", 
      description: "Matrix dünyasının şehir sahneleri için kullanılan ek lokasyonlar."
    }
  ],

  // Gladiator (2000)
  98: [
    {
      name: "Roman Colosseum",
      city: "Rome",
      country: "Italy",
      coordinates: [41.9028, 12.4964],
      scene: "Colosseum scenes",
      description: "Maximus'un gladyatör dövüşlerinin çekildiği tarihi Kolezyum."
    },
    {
      name: "Fort Ricasoli",
      city: "Malta",
      country: "Malta",
      coordinates: [35.9375, 14.3754],
      scene: "Gladiator school",
      description: "Gladyatör okulunun çekildiği Akdeniz adası."
    }
  ],

  // Jurassic Park (1993)
  329: [
    {
      name: "Kauai Island",
      city: "Kauai",
      country: "USA",
      coordinates: [22.0964, -159.5261],
      scene: "Isla Nublar",
      description: "Dinozor adası Isla Nublar'ın çekildiği Hawaii'nin cennet adası."
    },
    {
      name: "Oahu Mountains",
      city: "Oahu",
      country: "USA",
      coordinates: [21.4389, -158.0001],
      scene: "Helicopter scenes",
      description: "Ada üzerindeki helikopter sahnelerinin çekildiği volkanik dağlar."
    }
  ],

  // Back to the Future (1985)
  105: [
    {
      name: "Universal Studios Courthouse Square",
      city: "Hill Valley",
      country: "USA",
      coordinates: [34.1478, -118.1445],
      scene: "Town square",
      description: "Hill Valley kasabasının merkez meydanının çekildiği Courthouse Square."
    },
    {
      name: "Whittier High School",
      city: "Whittier",
      country: "USA",
      coordinates: [33.9792, -118.0328],
      scene: "High school",
      description: "Marty McFly'ın gittiği liseninçekildiği kampüs."
    }
  ],

  // E.T. the Extra-Terrestrial (1982)
  601: [
    {
      name: "Porter Ranch",
      city: "Los Angeles",
      country: "USA",
      coordinates: [34.1184, -118.3004],
      scene: "Elliott's house",
      description: "Elliott'ın ailesinin yaşadığı evin çekildiği banliyö mahallesi."
    },
    {
      name: "Culver City Streets",
      city: "Culver City",
      country: "USA",
      coordinates: [34.0211, -118.3965],
      scene: "Bicycle chase",
      description: "E.T. ile bisiklet kaçış sahnesinin çekildiği şehir sokakları."
    }
  ],

  // The Shining (1980)
  694: [
    {
      name: "Timberline Lodge",
      city: "Timberline Lodge, Oregon",
      country: "USA",
      coordinates: [45.3311, -121.7113],
      scene: "Overlook Hotel exterior",
      description: "Korku dolu Overlook Hotel'in dış çekimlerinin yapıldığı karlı dağ evi."
    },
    {
      name: "Going-to-the-Sun Road",
      city: "Glacier National Park",
      country: "USA",
      coordinates: [48.7596, -113.7870],
      scene: "Opening driving scene",
      description: "Filmin açılış sahnesindeki nefes kesici dağ yolu sürüşü."
    }
  ],

  // Amélie (2001)
  194: [
    {
      name: "Montmartre District",
      city: "Montmartre, Paris",
      country: "France",
      coordinates: [48.8846, 2.3318],
      scene: "Amélie's neighborhood",
      description: "Amélie'nin yaşadığı büyülü Montmartre mahallesi ve Sacré-Cœur Bazilikası."
    },
    {
      name: "Canal Saint-Martin Bridge",
      city: "Canal Saint-Martin",
      country: "France",
      coordinates: [48.8717, 2.3661],
      scene: "Stone skipping",
      description: "Amélie'nin taş sektirme sahnesinin çekildiği romantik kanal."
    }
  ],

  // The Grand Budapest Hotel (2014)
  120467: [
    {
      name: "Görlitzer Warenhaus",
      city: "Görlitz",
      country: "Germany",
      coordinates: [51.1581, 14.9888],
      scene: "Hotel exterior",
      description: "Grand Budapest Hotel'in dış görünümü için kullanılan tarihi şehir merkezi."
    },
    {
      name: "Dresden Historic Center",
      city: "Dresden",
      country: "Germany",
      coordinates: [51.0504, 13.7373],
      scene: "Interior scenes",
      description: "Otelin iç mekan sahnelerinin çekildiği barok mimari yapılar."
    }
  ],

  // Lost in Translation (2003)
  153: [
    {
      name: "Park Hyatt Tokyo Hotel",
      city: "Tokyo",
      country: "Japan",
      coordinates: [35.6762, 139.6503],
      scene: "Park Hyatt Tokyo",
      description: "Bob ve Charlotte'ın kaldığı lüks otelin bar ve lobisi."
    },
    {
      name: "Shibuya Crossing",
      city: "Shibuya",
      country: "Japan",
      coordinates: [35.6598, 139.7006],
      scene: "Crossing scene",
      description: "Dünyanın en kalabalık kavşağındaki kaybolmuşluk hissi."
    }
  ],

  // The Beach (2000)
  1535: [
    {
      name: "Maya Bay",
      city: "Phi Phi Islands",
      country: "Thailand",
      coordinates: [7.7407, 98.7784],
      scene: "The secret beach",
      description: "Maya Koyu'ndaki cennet plajının çekildiği kristal berraklığında sular."
    },
    {
      name: "Phi Phi Don Island",
      city: "Koh Phi Phi",
      country: "Thailand",
      coordinates: [7.7333, 98.7667],
      scene: "Island life",
      description: "Tropik ada yaşamının betimlendiği palmiye ağaçları ve beyaz kumlar."
    }
  ],

  // Slumdog Millionaire (2008)
  12405: [
    {
      name: "Dharavi Slum",
      city: "Mumbai",
      country: "India",
      coordinates: [19.0760, 72.8777],
      scene: "Dharavi slums",
      description: "Jamal'ın büyüdüğü gecekondu mahallelerinin çekildiği yoğun yaşam alanları."
    },
    {
      name: "Taj Mahal",
      city: "Agra",
      country: "India",
      coordinates: [27.1767, 78.0081],
      scene: "Taj Mahal scene",
      description: "Hint sinemasının simgesi olan beyaz mermer anıtın romantik sahneleri."
    }
  ],

  // Life of Pi (2012)
  87827: [
    {
      name: "French Quarter Pondicherry",
      city: "Pondicherry",
      country: "India",
      coordinates: [11.9416, 79.8083],
      scene: "Pi's hometown",
      description: "Pi'nin çocukluğunu geçirdiği renkli Fransız kolonisi şehri."
    },
    {
      name: "Taichung Water Tank Studio",
      city: "Taichung",
      country: "Taiwan",
      coordinates: [24.1477, 120.6736],
      scene: "Swimming pool scenes",
      description: "Okyanus sahneleri için kullanılan dev stüdyo havuzu."
    }
  ],

  // The Motorcycle Diaries (2004)
  5308: [
    {
      name: "Buenos Aires City Center",
      city: "Buenos Aires",
      country: "Argentina",
      coordinates: [-34.6118, -58.3960],
      scene: "Journey begins",
      description: "Che Guevara'nın efsanevi yolculuğunun başladığı tango şehri."
    },
    {
      name: "Machu Picchu Ruins",
      city: "Machu Picchu",
      country: "Peru",
      coordinates: [-13.1631, -72.5450],
      scene: "Ancient ruins",
      description: "Inca medeniyetinin gizemli kalıntılarında geçen dönüşüm sahneleri."
    }
  ],

  // Cinema Paradiso (1988)
  11216: [
    {
      name: "Cefalù Town Square",
      city: "Cefalù",
      country: "Italy",
      coordinates: [38.0394, 14.0213],
      scene: "Village square",
      description: "Küçük Sicilya kasabasındaki nostaljik sinema meydanı."
    },
    {
      name: "Palazzo Adriano Square",
      city: "Palazzo Adriano",
      country: "Italy",
      coordinates: [37.6756, 13.3614],
      scene: "Cinema Paradiso",
      description: "Efsanevi sinemanın çekildiği tarihi kasaba merkezi."
    }
  ],

  // Crouching Tiger, Hidden Dragon (2000)
  146: [
    {
      name: "Zhangjiajie National Forest Park",
      city: "Zhangjiajie",
      country: "China",
      coordinates: [29.1175, 110.4792],
      scene: "Bamboo forest fight",
      description: "Bambu ormanında geçen efsanevi dövüş sahnesinin çekildiği mistik dağlar."
    },
    {
      name: "Beijing Forbidden City",
      city: "Beijing",
      country: "China",
      coordinates: [39.9042, 116.4074],
      scene: "Forbidden City",
      description: "Yasak Şehir'deki saray entrikalarının çekildiği tarihi kompleks."
    }
  ],

  // Spirited Away (2001)
  129: [
    {
      name: "Jiufen Old Street",
      city: "Jiufen",
      country: "Taiwan",
      coordinates: [25.1097, 121.8444],
      scene: "Spirit world inspiration",
      description: "Ruh dünyasının çay evlerine ilham veren nostaljik madenci kasabası."
    },
    {
      name: "Dogo Onsen",
      city: "Dogo Onsen",
      country: "Japan",
      coordinates: [33.8478, 132.7861],
      scene: "Bathhouse inspiration",
      description: "Çilgin hamamın model alındığı geleneksel Japon kaplıcası."
    },
    {
      name: "Shima Onsen",
      city: "Gunma Prefecture",
      country: "Japan",
      coordinates: [36.6789, 138.9376],
      scene: "Traditional onsen town",
      description: "Film için ek ilham kaynağı olan geleneksel onsen (kaplıca) kasabası."
    }
  ],

  // The Secret Life of Walter Mitty (2013)
  116745: [
    {
      name: "Seyðisfjörður Harbor",
      city: "Seyðisfjörður",
      country: "Iceland",
      coordinates: [65.2627, -14.0014],
      scene: "Iceland scenes",
      description: "Walter'ın macerasının geçtiği büyüleyici fiyort manzaraları."
    },
    {
      name: "Stykkishólmur Town",
      city: "Stykkishólmur",
      country: "Iceland",
      coordinates: [65.0742, -22.7278],
      scene: "Greenland scenes",
      description: "Grönland olarak gösterilen renkli evlerin bulunduğu balıkçı kasabası."
    },
    {
      name: "Skógafoss Waterfall",
      city: "Skógar",
      country: "Iceland",
      coordinates: [63.5320, -19.5114],
      scene: "Skateboard scene",
      description: "Walter'ın uzun yol katettiği longboard sahnesi için kullanılan etkileyici şelale ve manzara."
    },
    {
      name: "Vatnajökull National Park",
      city: "Eastern Iceland",
      country: "Iceland",
      coordinates: [64.4168, -16.2189],
      scene: "Mountain scenes",
      description: "Sean Penn karakterinin fotoğraf çektiği buzul ve dağ sahneleri."
    }
  ],

  // Call Me by Your Name (2017)
  398818: [
    {
      name: "Villa Albergoni",
      city: "Crema",
      country: "Italy",
      coordinates: [45.3619, 9.6811],
      scene: "Elio's town",
      description: "Elio'nun ailesiyle yaşadığı İtalyan yazının geçtiği tarihi kasaba."
    },
    {
      name: "Bergamo Alta",
      city: "Bergamo",
      country: "Italy",
      coordinates: [45.6983, 9.6773],
      scene: "Train station",
      description: "Duygusal vedalaşma sahnesinin çekildiği tarihi tren istasyonu."
    },
    {
      name: "Piazza del Duomo",
      city: "Crema",
      country: "Italy",
      coordinates: [45.3628, 9.6874],
      scene: "Town square scenes",
      description: "Elio ve Oliver'ın bisikletle geçtikleri ve zaman geçirdikleri şehir meydanı."
    },
    {
      name: "Cascate del Serio",
      city: "Valbondione",
      country: "Italy",
      coordinates: [46.0358, 10.0204],
      scene: "Waterfall hike",
      description: "İkilinin yürüyüş sahnesinde gittikleri İtalya'nın en yüksek şelalesi."
    }
  ],

  // Mad Max: Fury Road (2015)
  76341: [
    {
      name: "Namib Desert Dunes",
      city: "Namib Desert",
      country: "Namibia",
      coordinates: [-24.7136, 15.9763],
      scene: "Desert chase",
      description: "Post-apokaliptik takip sahnesinin çekildiği dünyanın en eski çölü."
    },
    {
      name: "Swakopmund Coast",
      city: "Swakopmund",
      country: "Namibia",
      coordinates: [-22.6792, 14.5272],
      scene: "Citadel scenes",
      description: "Kale sahnelerinin çekildiği Atlantik kıyısındaki çöl şehri."
    },
    {
      name: "Sossusvlei",
      city: "Hardap Region",
      country: "Namibia",
      coordinates: [-24.7390, 15.3419],
      scene: "Red sand desert",
      description: "Furiosa ve savaş çocuklarının kaçış yolculuğunda görülen çarpıcı kırmızı kum tepeleri."
    },
    {
      name: "Spitzkoppe",
      city: "Damaraland",
      country: "Namibia",
      coordinates: [-21.8347, 15.1806],
      scene: "Rock formations",
      description: "Filmin dramatik kaya sahneleri için kullanılan 'Afrika'nın Matterhorn'u' olarak bilinen dağ."
    }
  ],

  // Her (2013)
  152601: [
    {
      name: "WaterMarke Tower",
      city: "Los Angeles",
      country: "USA",
      coordinates: [34.0522, -118.2437],
      scene: "Theodore's apartment",
      description: "Yapay zeka aşkının yaşandığı gelecekteki LA'in modern mimarisi."
    },
    {
      name: "Pudong District",
      city: "Shanghai",
      country: "China",
      coordinates: [31.2304, 121.4737],
      scene: "Futuristic city",
      description: "Gelecek şehrinin çekildiği gökdelenleri ve neon ışıkları."
    },
    {
      name: "Walt Disney Concert Hall",
      city: "Los Angeles",
      country: "USA",
      coordinates: [34.0553, -118.2497],
      scene: "Work scenes",
      description: "Theodore'un çalıştığı binanın yakınlarında bulunan fütüristik mimari yapı."
    },
    {
      name: "Lujiazui Financial District",
      city: "Shanghai",
      country: "China",
      coordinates: [31.2399, 121.5008],
      scene: "Skyline views",
      description: "Gelecek dünyasının panoramik görüntülerinin çekildiği modern gökdelen bölgesi."
    }
  ],

  // Moonrise Kingdom (2012)
  244786: [
    {
      name: "Conanicut Island",
      city: "Block Island",
      country: "USA",
      coordinates: [41.1681, -71.5801],
      scene: "New Penzance Island",
      description: "Genç aşıkların macerasının geçtiği New England'ın pastoral adası."
    },
    {
      name: "Fort Wetherill State Park",
      city: "Newport",
      country: "USA",
      coordinates: [41.4901, -71.3128],
      scene: "Camp scenes",
      description: "İzci kampının kurulduğu Atlantik kıyısındaki sakin kasaba."
    },
    {
      name: "Trinity Church",
      city: "Newport",
      country: "USA",
      coordinates: [41.4859, -71.3106],
      scene: "Church scene",
      description: "Filmde kilise olarak gösterilen ve çiftin düğün planladığı tarihi yapı."
    },
    {
      name: "Prudence Island",
      city: "Narragansett Bay",
      country: "USA",
      coordinates: [41.6203, -71.3212],
      scene: "Meadow scenes",
      description: "Sam ve Suzy'nin çayır sahnelerinin çekildiği Rhode Island kıyılarındaki ada."
    }
  ],

  // Parasite (2019)
  496243: [
    {
      name: "Ahyeon-dong",
      city: "Seoul",
      country: "South Korea",
      coordinates: [37.5665, 126.9780],
      scene: "Semi-basement house",
      description: "Kim ailesinin yaşadığı yarı-bodrum evin bulunduğu Gangbuk bölgesi."
    },
    {
      name: "Seongbuk-dong",
      city: "Jongno District",
      country: "South Korea",
      coordinates: [37.5735, 126.9788],
      scene: "Wealthy neighborhood",
      description: "Park ailesinin lüks evinin bulunduğu seçkin Gangnam bölgesi."
    },
    {
      name: "Doosan Apartment",
      city: "Seoul",
      country: "South Korea",
      coordinates: [37.5511, 126.9177],
      scene: "Flood scenes",
      description: "Sel baskını sahnesinin geçtiği Dongjak-gu semtindeki gerçek apartman kompleksi."
    },
    {
      name: "Sky Pizza",
      city: "Seoul",
      country: "South Korea",
      coordinates: [37.5818, 126.9235],
      scene: "Pizza shop scenes",
      description: "Filmde pizza dükkanı olarak gösterilen ve karakterlerin çalıştığı mekan."
    },
    {
      name: "Noryangjin Fish Market",
      city: "Seoul",
      country: "South Korea",
      coordinates: [37.5168, 126.9409],
      scene: "Job hunting",
      description: "Karakterlerin iş aradıkları sahnelerin çekildiği büyük balık pazarı."
    }
  ],

  // Mamma Mia! (2008)
  11631: [
    {
      city: "Skopelos",
      country: "Greece",
      coordinates: [39.1237, 23.7348],
      scene: "Villa Donna",
      description: "Donna'nın otelinin çekildiği Ege Denizi'ndeki cennet ada."
    },
    {
      city: "Skiathos",
      country: "Greece",
      coordinates: [39.1617, 23.4886],
      scene: "Wedding scenes",
      description: "ABBA şarkılarının yankılandığı beyaz kumlu plajlar ve mavi sular."
    }
  ],

  // The Darjeeling Limited (2007)
  4538: [
    {
      city: "Jodhpur",
      country: "India",
      coordinates: [26.2389, 73.0243],
      scene: "Blue city scenes",
      description: "Mavi şehir olarak bilinen Rajasthan'ın renkli sokaklarında geçen macera."
    },
    {
      city: "Udaipur",
      country: "India",
      coordinates: [24.5854, 73.7125],
      scene: "Palace hotel",
      description: "Göller şehrinin saray otellerinde geçen lüks tren seyahati."
    }
  ],

  // Vicky Cristina Barcelona (2008)
  10588: [
    {
      city: "Barcelona",
      country: "Spain",
      coordinates: [41.3851, 2.1734],
      scene: "Park Güell",
      description: "Gaudí'nin renkli mozaiklerinin bezediği aşk üçgeninin başladığı park."
    },
    {
      city: "San Sebastian",
      country: "Spain",
      coordinates: [43.3183, -1.9812],
      scene: "Beach scenes",
      description: "Romantik sahil kasabasında geçen tutkulu aşk sahneleri."
    }
  ],

  // Eat Pray Love (2010)
  17044: [
    {
      name: "Piazza Navona",
      city: "Rome",
      country: "Italy",
      coordinates: [41.9028, 12.4964],
      scene: "Eat - Italian cuisine",
      description: "İtalyan mutfağının tadına varılan tarihi Roma sokaklarında gastronomi yolculuğu."
    },
    {
      name: "Tegallalang Rice Terraces",
      city: "Ubud",
      country: "Indonesia",
      coordinates: [-8.5069, 115.2625],
      scene: "Love - Bali scenes",
      description: "Aşkın yeniden keşfedildiği Bali'nin ruhani pirinç tarlakları ve tapınakları."
    },
    {
      name: "Pura Tirta Empul",
      city: "Tampaksiring",
      country: "Indonesia",
      coordinates: [-8.4156, 115.3153],
      scene: "Pray - Temple scenes",
      description: "Liz'in ruhani yolculuğu sırasında ziyaret ettiği kutsal su tapınağı."
    },
    {
      name: "Asa Ram Ashram",
      city: "Pataudi",
      country: "India",
      coordinates: [28.3292, 76.7794],
      scene: "Pray - India scenes",
      description: "Karakterin meditasyon ve kendini keşfetme yolculuğunu sürdürdüğü aşram."
    },
    {
      name: "Santa Maria della Pace",
      city: "Rome",
      country: "Italy",
      coordinates: [41.9064, 12.4709],
      scene: "Pizza scene",
      description: "Liz'in 'İtalyanca kelime öğrenirken pizza yeme' sahnesinin çekildiği ünlü meydan."
    }
  ],

  // The Shape of Water (2017)
  399055: [
    {
      name: "Elgin Theatre",
      city: "Toronto",
      country: "Canada",
      coordinates: [43.6532, -79.3832],
      scene: "Laboratory scenes",
      description: "Soğuk Savaş döneminin gizli laboratuvarının kurulduğu retro şehir merkezi."
    },
    {
      name: "Massey Hall",
      city: "Hamilton",
      country: "Canada",
      coordinates: [43.2557, -79.8711],
      scene: "Elisa's apartment",
      description: "Elisa'nın yaşadığı nostaljik apartmanın bulunduğu sanayi şehri."
    },
    {
      name: "University of Toronto",
      city: "Toronto",
      country: "Canada",
      coordinates: [43.6629, -79.3957],
      scene: "Research facility",
      description: "Gizli araştırma tesisinin dış çekimlerinin yapıldığı üniversite kampüsü."
    },
    {
      name: "Liuna Station",
      city: "Hamilton",
      country: "Canada",
      coordinates: [43.2577, -79.8705],
      scene: "Command center",
      description: "Askeri komuta merkezinin çekildiği tarihi tren istasyonu."
    }
  ],

  // AFRİKA KITASI //

  // Out of Africa (1985)
  2118: [
    {
      name: "Karen Blixen Museum",
      city: "Nairobi",
      country: "Kenya",
      coordinates: [-1.2864, 36.8172],
      scene: "Karen Blixen's farm",
      description: "Karen Blixen'in gerçek çiftlik evi, şu anda müze olarak kullanılıyor. Film burada çekildi."
    },
    {
      name: "Masai Mara National Reserve",
      city: "Narok County",
      country: "Kenya",
      coordinates: [-1.5167, 35.1500],
      scene: "Safari scenes",
      description: "Filmin safari sahneleri için kullanılan gerçek milli park. 'Vahşi Doğanın İnsanları' sahnesi burada çekildi."
    }
  ],

  // AVRUPA KITASI //

  // The Sound of Music (1965)
  15121: [
    {
      name: "Mirabell Gardens",
      city: "Salzburg",
      country: "Austria",
      coordinates: [47.8058, 13.0426],
      scene: "Do-Re-Mi sequence",
      description: "Do-Re-Mi şarkısının bir kısmının çekildiği gerçek bahçeler. Von Trapp çocuklarının dans ettiği merdivenler burada bulunur."
    },
    {
      name: "Mondsee Cathedral",
      city: "Mondsee",
      country: "Austria",
      coordinates: [47.8548, 13.3489],
      scene: "Wedding scene",
      description: "Maria ve Kaptan Von Trapp'in düğün sahnesinin çekildiği gerçek katedral."
    }
  ],

  // Schindler's List (1993)
  424: [
    {
      name: "Oskar Schindler's Factory",
      city: "Krakow",
      country: "Poland",
      coordinates: [50.0495, 19.9608],
      scene: "Factory scenes",
      description: "Oskar Schindler'ın gerçek fabrikası, şu anda müze olarak hizmet veriyor. Filmin çoğu sahnesi bu gerçek lokasyonda çekildi."
    },
    {
      name: "Plaszow Concentration Camp Site",
      city: "Krakow",
      country: "Poland",
      coordinates: [50.0343, 19.9725],
      scene: "Camp scenes",
      description: "Gerçek toplama kampının bulunduğu alan, film için kullanıldı."
    }
  ],

  // RUSYA ve ASYA KITASI //

  // Lawrence of Arabia (1962)
  947: [
    {
      name: "Wadi Rum",
      city: "Wadi Rum",
      country: "Jordan",
      coordinates: [29.6283, 35.4239],
      scene: "Desert scenes",
      description: "Lawrence'ın gerçekten bulunduğu çöl. Filmde 'Rumm Vadisi' olarak gösterilen, gerçek lokasyonda çekilmiş epik sahneler."
    },
    {
      name: "Aqaba",
      city: "Aqaba",
      country: "Jordan",
      coordinates: [29.5133, 35.0033],
      scene: "Aqaba battle",
      description: "Lawrence'ın tarihte gerçekten fethettiği şehir. Film çekimlerinin bir kısmı bu gerçek lokasyonda yapıldı."
    }
  ],

  // The Last Emperor (1987)
  746: [
    {
      name: "Forbidden City",
      city: "Beijing",
      country: "China",
      coordinates: [39.9169, 116.3907],
      scene: "Imperial Palace",
      description: "Batılı bir film ekibinin çekim yapmasına izin verilen ilk film. İmparator Pu Yi'nin gerçekten yaşadığı saray."
    },
    {
      name: "The Summer Palace",
      city: "Beijing",
      country: "China",
      coordinates: [39.9986, 116.2748],
      scene: "Imperial retreat scenes",
      description: "İmparatorun yaz sarayının bulunduğu gerçek lokasyon. Filmdeki bahçe sahnelerinin çoğu burada çekildi."
    }
  ],

  // GÜNEY AMERİKA KITASI //

  // City of God (2002)
  598: [
    {
      name: "Cidade de Deus",
      city: "Rio de Janeiro",
      country: "Brazil",
      coordinates: [-22.9495, -43.3673],
      scene: "Favela scenes",
      description: "Filmin asıl konusunu oluşturan gerçek Rio favela'sı. Filme adını veren gerçek mahallede çekilen sahneler."
    },
    {
      name: "Copacabana Beach",
      city: "Rio de Janeiro",
      country: "Brazil",
      coordinates: [-22.9705, -43.1840],
      scene: "Beach scenes",
      description: "Filmdeki sahil sahnelerinin çekildiği dünyaca ünlü plaj. Karakterlerin kaçış hayallerini simgeleyen lokasyon."
    }
  ],

  // Motorcycle Diaries (2004) - Genişletilmiş
  5308: [
    {
      name: "Machu Picchu",
      city: "Cusco",
      country: "Peru",
      coordinates: [-13.1631, -72.5450],
      scene: "Machu Picchu scenes",
      description: "Che Guevara'nın gerçek ziyaret ettiği antik İnka şehri. Filmdeki dönüm noktası sahneleri burada çekildi."
    },
    {
      name: "San Pablo Leper Colony",
      city: "Iquitos",
      country: "Peru",
      coordinates: [-3.7491, -73.2538],
      scene: "Amazon leper colony",
      description: "Che'nin hayatını değiştiren cüzzamlılar kolonisinin bulunduğu gerçek Amazon Nehri lokasyonu."
    },
    {
      name: "Atacama Desert",
      city: "San Pedro de Atacama",
      country: "Chile",
      coordinates: [-23.4500, -68.2333],
      scene: "Desert crossing",
      description: "La Poderosa adlı motosikletle geçilen gerçek çöl manzarası. Dünyanın en kurak çöllerinden birinde yapılan çekimler."
    }
  ],

  // Central Station (1998)
  222: [
    {
      name: "Central do Brasil Station",
      city: "Rio de Janeiro",
      country: "Brazil",
      coordinates: [-22.9035, -43.1952],
      scene: "Opening scenes",
      description: "Filmin adını aldığı ve açılış sahnelerinin çekildiği gerçek tren istasyonu."
    },
    {
      name: "Bom Jesus da Lapa",
      city: "Bahia",
      country: "Brazil",
      coordinates: [-13.2506, -43.4187],
      scene: "Pilgrimage scenes",
      description: "Dora ve Josué'nin yolculuklarının son durağı olan hacı kasabasının gerçek lokasyonu."
    }
  ],

  // AVRUPA KITASI - Genişletilmiş //

  // Amelie (2001) - Genişletilmiş
  194: [
    {
      name: "Café des Deux Moulins",
      city: "Paris",
      country: "France",
      coordinates: [48.8847, 2.3322],
      scene: "Amélie's workplace",
      description: "Amélie'nin gerçekten çalıştığı kafe. Film sonrası turistik bir mekan haline gelen ve hala açık olan gerçek kafe."
    },
    {
      name: "Canal Saint-Martin",
      city: "Paris",
      country: "France",
      coordinates: [48.8717, 2.3661],
      scene: "Stone skipping",
      description: "Amélie'nin taş sektirme sahnesinin çekildiği gerçek kanal. Paris'in en romantik köşelerinden biri."
    },
    {
      name: "Gare du Nord",
      city: "Paris",
      country: "France",
      coordinates: [48.8809, 2.3553],
      scene: "Train station scenes",
      description: "Amélie'nin Nino'nun fotoğraf koleksiyonunu bulduğu gerçek tren istasyonu."
    }
  ],

  // In Bruges (2008) - Genişletilmiş
  8321: [
    {
      name: "Belfort Tower",
      city: "Bruges",
      country: "Belgium",
      coordinates: [51.2088, 3.2246],
      scene: "Climactic scenes",
      description: "Filmin dramatik final sahnelerinin çekildiği 83 metre yüksekliğindeki gerçek Ortaçağ çan kulesi."
    },
    {
      name: "Groeningemuseum",
      city: "Bruges",
      country: "Belgium",
      coordinates: [51.2042, 3.2264],
      scene: "Museum scene",
      description: "Ray'in sanat eserlerini incelediği sahnelerin çekildiği gerçek 15. yüzyıl sanat müzesi."
    },
    {
      name: "Rozenhoedkaai",
      city: "Bruges",
      country: "Belgium",
      coordinates: [51.2078, 3.2272],
      scene: "Canal scenes",
      description: "Filmin afişinde de kullanılan Bruges'ün en fotoğrafik kanal noktası. Film boyunca birçok sahnede görünen ikonik manzara."
    }
  ],

  // Roman Holiday (1953)
  804: [
    {
      name: "Trevi Fountain",
      city: "Rome",
      country: "Italy",
      coordinates: [41.9009, 12.4833],
      scene: "Haircut scene",
      description: "Audrey Hepburn'ün karakter değişiminin sembolü olan saç kesimi sahnesinin yakınlarındaki ikonik çeşme."
    },
    {
      name: "Spanish Steps",
      city: "Rome",
      country: "Italy",
      coordinates: [41.9058, 12.4823],
      scene: "Ice cream scene",
      description: "Prenses Anne ve Joe'nun dondurma yediği ünlü Roma merdivenlerinin gerçek lokasyonu."
    },
    {
      name: "Mouth of Truth",
      city: "Rome",
      country: "Italy",
      coordinates: [41.8886, 12.4810],
      scene: "Hand biting scene",
      description: "Gregory Peck'in doğaçlama olarak elini 'ısırdığı' ve Audrey Hepburn'ün doğal tepkisinin görüldüğü gerçek antik Roma maskesi."
    }
  ],

  // Before Sunrise (1995)
  76: [
    {
      name: "Zollamtssteg Bridge",
      city: "Vienna",
      country: "Austria",
      coordinates: [48.2130, 16.3808],
      scene: "First kiss scene",
      description: "Jesse ve Céline'in ilk öpüşme sahnesinin gerçekleştiği tarihi Tuna Kanalı köprüsü."
    },
    {
      name: "Café Sperl",
      city: "Vienna",
      country: "Austria",
      coordinates: [48.1996, 16.3613],
      scene: "Palm reading scene",
      description: "İkilinin avuç içi okuma oyununu oynadıkları 1880'den kalma tarihi Viyana kafesi. Orijinal dekorasyonuyla korunan gerçek mekan."
    },
    {
      name: "Maria Theresien Platz",
      city: "Vienna",
      country: "Austria",
      coordinates: [48.2047, 16.3615],
      scene: "Morning walk",
      description: "Jesse ve Céline'in sabah yürüyüşünde geçtikleri kraliçe heykeli ve müzelerle çevrili tarihi meydan."
    }
  ],

  // Grand Budapest Hotel (2014)
  120467: [
    {
      name: "Görlitz Department Store",
      city: "Görlitz",
      country: "Germany",
      coordinates: [51.1545, 14.9885],
      scene: "Hotel interior",
      description: "Filmin iç mekan çekimlerinin yapıldığı tarihi alışveriş merkezi binası."
    },
    {
      name: "Zwinger Palace",
      city: "Dresden",
      country: "Germany",
      coordinates: [51.0526, 13.7354],
      scene: "Museum scenes",
      description: "Değerli tablonun sergilendiği müze sahnelerinin çekildiği barok saray kompleksi."
    },
    {
      name: "Pfunds Molkerei",
      city: "Dresden",
      country: "Germany",
      coordinates: [51.0658, 13.7519],
      scene: "Mendl's bakery",
      description: "Filmde pastane olarak gösterilen, dünyanın en güzel süt dükkanı olarak bilinen mekan."
    }
  ],

  // Thelma & Louise (1991)
  1541: [
    {
      name: "Arches National Park",
      city: "Moab",
      country: "USA",
      coordinates: [38.7331, -109.5925],
      scene: "Final scene",
      description: "İkonik final sahnesinin çekildiği kanyonlar ve kemer şeklindeki kaya formasyonları."
    },
    {
      name: "Dead Horse Point",
      city: "Moab",
      country: "USA",
      coordinates: [38.4702, -109.7453],
      scene: "Grand Canyon view",
      description: "Grand Canyon olarak gösterilen ancak Utah'taki manzaranın kullanıldığı sahne."
    },
    {
      name: "Courthouse Towers",
      city: "Moab",
      country: "USA",
      coordinates: [38.7133, -109.5434],
      scene: "Desert driving",
      description: "İkilinin araba sürdüğü çöl yolu ve dramatik kaya kulelerinin görüldüğü alan."
    }
  ],

  // The Intouchables (2011)
  77338: [
    {
      name: "Hôtel des Invalides",
      city: "Paris",
      country: "France",
      coordinates: [48.8547, 2.3131],
      scene: "Paragliding scenes",
      description: "Philippe'in yamaç paraşütü yapma tutkusunu yansıtan sahnelerin çekildiği alan."
    },
    {
      name: "Château de Vaux-le-Vicomte",
      city: "Maincy",
      country: "France",
      coordinates: [48.5641, 2.7145],
      scene: "Philippe's mansion",
      description: "Zengin karakterin yaşadığı malikanenin dış çekimleri için kullanılan 17. yüzyıl şatosu."
    },
    {
      name: "Cabourg Beach",
      city: "Cabourg",
      country: "France",
      coordinates: [49.2936, 0.1195],
      scene: "Beach scenes",
      description: "Driss ve Philippe'in duygusal plaj sahnesinin çekildiği Normandiya sahili."
    }
  ]
};

// TMDb ID ile lokasyonları getir
export const getMovieLocations = (tmdbId) => {
  return knownMovieLocations[tmdbId] || [];
};

// Tüm lokasyonları flat liste olarak getir
export const getAllKnownLocations = () => {
  const allLocations = [];
  let locationId = 1;
  
  Object.entries(knownMovieLocations).forEach(([tmdbId, locations]) => {
    locations.forEach(location => {
      allLocations.push({
        id: locationId++,
        ...location,
        movieId: parseInt(tmdbId),
        tmdbId: parseInt(tmdbId),
        lat: location.coordinates[0],
        lng: location.coordinates[1]
      });
    });
  });
  
  return allLocations;
};

// Ülke bazında lokasyon sayısı
export const getLocationCountByCountry = () => {
  const countries = {};
  
  Object.values(knownMovieLocations).forEach(locations => {
    locations.forEach(location => {
      countries[location.country] = (countries[location.country] || 0) + 1;
    });
  });
  
  return countries;
};

// Marvel Cinematic Universe Locations
// The Avengers (2012) - TMDb ID: 24428
knownMovieLocations[24428] = [
  {
    name: "Tower City Center",
    city: "Cleveland",
    country: "USA",
    coordinates: [41.4993, -81.6944],
    scene: "Loki's speech to the crowd",
    description: "Public Square'de Loki'nin insanlara hitap ettiği ikonik sahne burada çekildi. Cleveland şehir merkezi New York'u temsil etti.",
    filmingDate: "2011-08-12",
    trivia: "Yüzlerce figuran katıldı ve sahne gerçek halk kalabalığı gibi çekildi."
  }
];

// Thor (2011) - TMDb ID: 10195
knownMovieLocations[10195] = [
  {
    name: "Toney Anaya Building",
    city: "Santa Fe",
    country: "USA",
    coordinates: [35.6870, -105.9378],
    scene: "Hospital exterior scenes",
    description: "Thor filmlerinde hastane dış çekimlerinin yapıldığı New Mexico eyalet binası.",
    filmingDate: "2010-04-15"
  }
];

// Captain America: The First Avenger (2011) - TMDb ID: 1771
knownMovieLocations[1771] = [
  {
    name: "Titanic Hotel at Stanley Dock",
    city: "Liverpool",
    country: "UK",
    coordinates: [53.4199, -2.9988],
    scene: "Pier 13 scenes",
    description: "Captain America'nın ilk filmi için Pier 13 sahnelerinin çekildiği tarihi Liverpool limanı.",
    filmingDate: "2010-09-20",
    trivia: "1940'lar atmosferi için özel set tasarımı yapıldı."
  }
];

// Iron Man 2 (2010) - TMDb ID: 10138
knownMovieLocations[10138] = [
  {
    name: "Randy's Donuts",
    city: "Inglewood",
    country: "USA",
    coordinates: [33.9425, -118.3414],
    scene: "Rooftop donut scene",
    description: "Tony Stark'ın ikonik donut üzerinde oturduğu sahne. Los Angeles'ın ünlü landmark'ı.",
    filmingDate: "2009-05-18",
    trivia: "Çekim için özel izin alındı ve donut tamamen restore edildi."
  }
];

// Iron Man 3 (2013) - TMDb ID: 68721
knownMovieLocations[68721] = [
  {
    name: "Dania Beach Bar & Grill",
    city: "Dania Beach",
    country: "USA",
    coordinates: [26.0517, -80.1439],
    scene: "Neptune's Net restaurant scene",
    description: "Florida'da çekilen restaurant sahnesi. Gerçekte Neptune's Net'i temsil ediyor.",
    filmingDate: "2012-06-10"
  }
];

// Thor: The Dark World (2013) - TMDb ID: 76338
knownMovieLocations[76338] = [
  {
    name: "Old Royal Naval College",
    city: "Greenwich",
    country: "UK",
    coordinates: [51.4826, -0.0077],
    scene: "University and Asgard scenes",
    description: "Greenwich'teki tarihi denizcilik koleji Thor'un üniversite sahneleri için kullanıldı.",
    filmingDate: "2012-09-15",
    trivia: "Christopher Wren'in tasarladığı barok mimari mükemmel Asgard atmosferi yarattı."
  }
];

// Black Panther (2018) - TMDb ID: 284054
knownMovieLocations[284054] = [
  {
    name: "Iguazu Falls",
    city: "Puerto Iguazu",
    country: "Argentina",
    coordinates: [-25.6953, -54.4367],
    scene: "Waterfall scenes in Wakanda",
    description: "Wakanda'nın muhteşem şelalelerini temsil eden gerçek Iguazu Şelaleleri. Arjantin-Brezilya sınırında.",
    filmingDate: "2017-04-20",
    trivia: "Dünyanın en büyük şelale sistemlerinden biri. 275 ayrı şelale bulunuyor."
  }
];

// Guardians of the Galaxy (2014) - TMDb ID: 118340
knownMovieLocations[118340] = [
  {
    name: "Liège-Guillemins Railway Station",
    city: "Liège",
    country: "Belgium",
    coordinates: [50.6244, 5.5667],
    scene: "Space station interior fight scenes",
    description: "Belçika'nın ultra-modern tren istasyonu uzay istasyonu olarak kullanıldı.",
    filmingDate: "2013-08-25",
    trivia: "Santiago Calatrava'nın tasarladığı futuristik mimari mükemmel sci-fi atmosferi yarattı."
  }
];

// Spider-Man: Homecoming (2017) - TMDb ID: 315635
knownMovieLocations[315635] = [
  {
    name: "Henry W. Grady High School",
    city: "Atlanta",
    country: "USA",
    coordinates: [33.7885, -84.3651],
    scene: "Peter Parker's school scenes",
    description: "Spider-Man'in lise sahnelerinin çekildiği Atlanta'daki okul. New York'taki Midtown High'ı temsil etti.",
    filmingDate: "2016-07-15"
  }
];

// The Incredible Hulk (2008) - TMDb ID: 1724
knownMovieLocations[1724] = [
  {
    name: "University of Toronto",
    city: "Toronto",
    country: "Canada",
    coordinates: [43.6629, -79.3957],
    scene: "Culver University campus",
    description: "Bruce Banner'ın çalıştığı üniversite kampüsü Toronto Üniversitesi'nde çekildi.",
    filmingDate: "2007-06-20",
    trivia: "Kampüsün Gothic Revival mimarisi mükemmel akademik atmosfer yarattı."
  }
];

// Captain America: Civil War (2016) - TMDb ID: 271110
knownMovieLocations[271110] = [
  {
    name: "Leipzig-Halle Airport",
    city: "Leipzig",
    country: "Germany",
    coordinates: [51.4239, 12.2364],
    scene: "Airport battle sequence",
    description: "Süper kahramanların büyük havaalanı savaşı sahnesinin çekildiği yer.",
    filmingDate: "2015-05-15",
    trivia: "Havaalanının bir bölümü özel olarak çekim için kapatıldı."
  }
];

// Avengers: Age of Ultron (2015) - TMDb ID: 99861
knownMovieLocations[99861] = [
  {
    name: "Fort Bard",
    city: "Bard",
    country: "Italy",
    coordinates: [45.6097, 7.7433],
    scene: "Opening Hydra base assault",
    description: "Filmin açılış sahnesi olan Hydra üssü saldırısının çekildiği İtalyan kalesi.",
    filmingDate: "2014-03-20"
  },
  {
    name: "Dover Castle",
    city: "Dover",
    country: "UK",
    coordinates: [51.1295, 1.3211],
    scene: "Additional Hydra base scenes",
    description: "Hydra üssü iç sahneleri için kullanılan tarihi İngiliz kalesi.",
    filmingDate: "2014-04-10"
  }
];

// Avengers: Infinity War (2018) - TMDb ID: 299536
knownMovieLocations[299536] = [
  {
    name: "Waverly Station",
    city: "Edinburgh",
    country: "Scotland",
    coordinates: [55.9520, -3.1883],
    scene: "Edinburgh battle scenes",
    description: "Wanda ve Vision'ın kaçış sahnelerinin çekildiği Edinburgh'un ana tren istasyonu.",
    filmingDate: "2017-04-25"
  },
  {
    name: "Cockburn Street",
    city: "Edinburgh",
    country: "Scotland",
    coordinates: [55.9495, -3.1906],
    scene: "Old Town chase scenes",
    description: "Edinburgh'un tarihi sokaklarında çekilen kovalamaca sahneleri.",
    filmingDate: "2017-04-26",
    trivia: "Harry Potter'ın Diagon Alley'ine ilham veren sokak."
  }
];

// Avengers: Endgame (2019) - TMDb ID: 299534
knownMovieLocations[299534] = [
  {
    name: "St Abbs",
    city: "Berwickshire",
    country: "Scotland",
    coordinates: [55.9167, -2.1333],
    scene: "New Asgard fishing village",
    description: "Thor'un yaşadığı Yeni Asgard balıkçı köyünün çekildiği İskoçya'nın doğu kıyısı.",
    filmingDate: "2018-06-15",
    trivia: "Gerçek balıkçı köyü, minimal CGI ile Asgard'a dönüştürüldü."
  }
];

// Mission: Impossible - The Final Reckoning (2025) - TMDb ID: 575264
knownMovieLocations[575264] = [
  {
    name: "Aurland Valley",
    city: "Aurland",
    country: "Norway",
    coordinates: [60.9059, 7.1833],
    scene: "Mountain action sequences",
    description: "Norveç'in dramatik fjord manzaraları arasında çekilen aksiyon sahneleri.",
    filmingDate: "2024-06-20"
  },
  {
    name: "Svalbard Archipelago",
    city: "Longyearbyen",
    country: "Norway",
    coordinates: [78.2232, 15.6267],
    scene: "Arctic fortress scenes",
    description: "Kutup bölgesindeki kalenin çekildiği dünyanın en kuzeyindeki yerleşim.",
    filmingDate: "2024-08-15",
    trivia: "Aynı lokasyon Superman filminde de kullanılacak."
  },
  {
    name: "Valletta",
    city: "Valletta",
    country: "Malta",
    coordinates: [35.8989, 14.5146],
    scene: "Mediterranean chase scenes",
    description: "Akdeniz'deki kovalamaca sahnelerinin çekildiği Malta'nın başkenti.",
    filmingDate: "2024-05-10"
  }
];

// Oppenheimer (2023) - TMDb ID: 872585
knownMovieLocations[872585] = [
  {
    name: "Los Alamos National Laboratory",
    city: "Los Alamos",
    country: "USA",
    coordinates: [35.8283, -106.5081],
    scene: "Manhattan Project scenes",
    description: "Atom bombasının geliştirildiği gerçek laboratuvar. Nolan gerçek lokasyonları kullandı.",
    filmingDate: "2022-03-15",
    trivia: "İlk atom bombasının tasarlandığı tarihi bina."
  },
  {
    name: "White Sands Proving Ground",
    city: "White Sands",
    country: "USA",
    coordinates: [33.2773, -106.4887],
    scene: "Trinity nuclear test",
    description: "İlk atom bombası testinin yapıldığı çöl alanı. Trinity testi sahnesi burada çekildi.",
    filmingDate: "2022-04-20"
  }
];

// John Wick: Chapter 4 (2023) - TMDb ID: 603692
knownMovieLocations[603692] = [
  {
    name: "Sacré-Cœur Basilica",
    city: "Paris",
    country: "France",
    coordinates: [48.8867, 2.3431],
    scene: "Montmartre stair fight",
    description: "John Wick'in Paris'teki ikonik merdiven kavgası sahnesinin çekildiği yer.",
    filmingDate: "2022-07-15",
    trivia: "222 basamaklı merdivende gerçek dublörlerle çekildi."
  },
  {
    name: "Kōtō-ku District",
    city: "Tokyo",
    country: "Japan",
    coordinates: [35.6762, 139.8172],
    scene: "Osaka Continental Hotel",
    description: "Tokyo'nun modern bölgesinde çekilen Osaka Continental Hotel sahneleri.",
    filmingDate: "2022-09-10"
  },
  {
    name: "Brandenburg Gate",
    city: "Berlin",
    country: "Germany",
    coordinates: [52.5163, 13.3777],
    scene: "Berlin action sequences",
    description: "Berlin'deki aksiyon sahnelerinin merkezi olan tarihi kapı.",
    filmingDate: "2022-06-25"
  }
];

// Indiana Jones and the Dial of Destiny (2023) - TMDb ID: 335977
knownMovieLocations[335977] = [
  {
    name: "North Yorkshire Moors",
    city: "Yorkshire",
    country: "UK",
    coordinates: [54.3781, -0.8413],
    scene: "Train chase sequence",
    description: "İngiliz kırsalında çekilen tren kovalamaca sahnesi.",
    filmingDate: "2021-09-15"
  },
  {
    name: "Temple of Segesta",
    city: "Sicily",
    country: "Italy",
    coordinates: [37.9417, 12.8347],
    scene: "Ancient temple scenes",
    description: "Antik tapınak sahnelerinin çekildiği Sicilya'daki Yunan tapınağı.",
    filmingDate: "2021-10-20"
  },
  {
    name: "Fez Medina",
    city: "Fez",
    country: "Morocco",
    coordinates: [34.0647, -4.9775],
    scene: "Moroccan marketplace",
    description: "Fas'taki pazar yeri sahneleri dünya mirası medina'da çekildi.",
    filmingDate: "2021-11-10"
  }
];

// Killers of the Flower Moon (2023) - TMDb ID: 466420
knownMovieLocations[466420] = [
  {
    name: "Osage County",
    city: "Pawhuska",
    country: "USA",
    coordinates: [36.6703, -96.3372],
    scene: "Osage Nation territory",
    description: "Osage Nation cinayetlerinin gerçekte yaşandığı Oklahoma bölgesi.",
    filmingDate: "2021-05-20",
    trivia: "Gerçek tarihsel olayların yaşandığı otantik lokasyon."
  }
];

// Creed III (2023) - TMDb ID: 677179
knownMovieLocations[677179] = [
  {
    name: "Venice Muscle Beach",
    city: "Los Angeles",
    country: "USA",
    coordinates: [33.9850, -118.4695],
    scene: "Outdoor training scenes",
    description: "Adonis'in açık havada antrenman yaptığı ünlü Venice Beach kas plajı.",
    filmingDate: "2022-01-15",
    trivia: "Arnold Schwarzenegger'in de antrenman yaptığı efsanevi spor merkezi."
  },
  {
    name: "State Farm Arena",
    city: "Atlanta",
    country: "USA",
    coordinates: [33.7573, -84.3963],
    scene: "Championship fight",
    description: "Büyük boks maçının çekildiği Atlanta'nın ana spor salonu.",
    filmingDate: "2022-03-20"
  }
];

// Superman (2025) - TMDb ID: 1207830
knownMovieLocations[1207830] = [
  {
    name: "Adventdalen Valley",
    city: "Svalbard",
    country: "Norway",
    coordinates: [78.2232, 15.6267],
    scene: "Fortress of Solitude exterior",
    description: "Superman'in Yalnızlık Kalesi'nin dış çekimlerinin yapıldığı Kutup vadisi.",
    filmingDate: "2024-08-20",
    trivia: "Mission: Impossible ile aynı lokasyon kullanıldı."
  }
];

// Paddington in Peru (2024) - TMDb ID: 1267036
knownMovieLocations[1267036] = [
  {
    name: "Machu Picchu",
    city: "Cusco",
    country: "Peru",
    coordinates: [-13.1631, -72.5450],
    scene: "Peruvian adventure scenes",
    description: "Paddington'ın Peru macerasının çekildiği İnka kalıntıları.",
    filmingDate: "2023-05-15",
    trivia: "UNESCO Dünya Mirası listesinde yer alan antik kent."
  },
  {
    name: "Camden Market",
    city: "London",
    country: "UK",
    coordinates: [51.5417, -0.1466],
    scene: "London market scenes",
    description: "Paddington'ın Londra pazarı sahneleri Camden'da çekildi.",
    filmingDate: "2023-02-10"
  }
];

// Happy Gilmore 2 (2025) - TMDb ID: 1311550
knownMovieLocations[1311550] = [
  {
    name: "Fiddler's Elbow Country Club",
    city: "Bedminster",
    country: "USA",
    coordinates: [40.6579, -74.6321],
    scene: "Golf tournament scenes",
    description: "Happy Gilmore'un golf turnuvası sahnelerinin çekildiği New Jersey kulübü.",
    filmingDate: "2024-09-15"
  }
];

// Christopher Nolan's The Odyssey (2026) - TMDb ID: 1309297
knownMovieLocations[1309297] = [
  {
    name: "Findlater Castle",
    city: "Cullen",
    country: "Scotland",
    coordinates: [57.6833, -2.8167],
    scene: "Ancient fortress scenes",
    description: "Odysseus'un yolculuğundaki antik kale sahneleri İskoçya'nın dramatik kıyılarında çekildi.",
    filmingDate: "2024-07-20",
    trivia: "14. yüzyıl kalıntıları Antik Yunan atmosferi için kullanıldı."
  },
  {
    name: "Essaouira",
    city: "Essaouira",
    country: "Morocco",
    coordinates: [31.5085, -9.7595],
    scene: "Mediterranean port scenes",
    description: "Akdeniz limanı sahneleri için kullanılan Fas'ın Atlantik kıyısındaki eski liman.",
    filmingDate: "2024-06-10"
  }
];

// Spider-Man: Brand New Day (2026) - TMDb ID: 1284167
knownMovieLocations[1284167] = [
  {
    name: "Glasgow City Centre",
    city: "Glasgow",
    country: "Scotland",
    coordinates: [55.8642, -4.2518],
    scene: "New York City streets",
    description: "Glasgow şehir merkezi New York sokakları olarak dönüştürüldü.",
    filmingDate: "2024-08-05",
    trivia: "Viktoria dönemi mimarisi Manhattan'ı mükemmel temsil etti."
  }
];

// Lara Croft: Tomb Raider (2001) - TMDb ID: 1593
knownMovieLocations[1593] = [
    {
      name: "Angkor Wat",
      city: "Siem Reap",
      country: "Cambodia",
      coordinates: [13.4125, 103.8670],
      scene: "Ancient temple exploration",
      description: "Lara Croft'un antik tapınak keşfi sahneleri. Angkor Wat kompleksinin muhteşem mimarisi filme eşsiz bir atmosfer kattı.",
      trivia: "Özellikle Ta Prohm tapınağında ağaçların tapınağı sarması çok etkileyici görüntüler oluşturdu."
    }
];

// The Last Samurai (2003) - TMDb ID: 616
knownMovieLocations[616] = [
    {
      name: "Himeji Castle",
      city: "Himeji",
      country: "Japan", 
      coordinates: [34.8394, 134.6939],
      scene: "Samurai training sequences",
      description: "Geleneksel Japon mimarisi ve samurai kültürünün gösterildiği muhteşem beyaz kale."
    },
    {
      name: "Chion-in Temple",
      city: "Kyoto",
      country: "Japan",
      coordinates: [35.0056, 135.7816], 
      scene: "Temple meditation scenes",
      description: "Kyoto'nun en büyük Budist tapınaklarından biri. Film'deki huzurlu meditasyon sahneleri burada çekildi."
    }
];

// Crazy Rich Asians (2018) - TMDb ID: 455207
knownMovieLocations[455207] = [
    {
      name: "Marina Bay Sands",
      city: "Singapore",
      country: "Singapore",
      coordinates: [1.2834, 103.8607],
      scene: "Luxury lifestyle scenes", 
      description: "Singapur'un en ikonik oteli. Çılgın zenginliğin sembolü olan infinity pool ve SkyPark."
    },
    {
      name: "Gardens by the Bay",
      city: "Singapore", 
      country: "Singapore",
      coordinates: [1.2816, 103.8636],
      scene: "Romantic garden walk",
      description: "Futuristik Supertree Grove ile ünlü botanik bahçe. Gece aydınlatması büyüleyici."
    },
    {
      name: "Raffles Hotel",
      city: "Singapore",
      country: "Singapore", 
      coordinates: [1.2953, 103.8545],
      scene: "Classic colonial scenes",
      description: "1887'den beri hizmet veren lüks otel. Singapur'un kolonyal dönem mirasını yansıtıyor."
    }
];

// Kong: Skull Island (2017) - TMDb ID: 293167
knownMovieLocations[293167] = [
    {
      name: "Trang An Landscape Complex",
      city: "Ninh Binh",
      country: "Vietnam",
      coordinates: [20.2500, 105.9167],
      scene: "Skull Island jungle scenes",
      description: "UNESCO Dünya Mirası olan karstik kalker dağları ve ormanlık alan. King Kong'un adası için mükemmel doğal dekor."
    }
];

// The Beach (2000) - TMDb ID: 1535
knownMovieLocations[1535] = [
    {
      name: "Maya Bay",
      city: "Koh Phi Phi Le",
      country: "Thailand",
      coordinates: [7.6764, 98.7689],
      scene: "Paradise beach scenes",
      description: "Leonardo DiCaprio'nun cennet arayışını gerçekleştirdiği muhteşem plaj. Filmin ardından turizm patlaması yaşandı.",
      trivia: "Çevre koruma nedeniyle 2018'de ziyaretçilere geçici olarak kapatıldı."
    }
];

// The Man with the Golden Gun (1974) - TMDb ID: 682
knownMovieLocations[682] = [
    {
      name: "James Bond Island (Khao Phing Kan)",
      city: "Phang Nga",
      country: "Thailand", 
      coordinates: [8.2742, 98.5019],
      scene: "Scaramanga's hideout",
      description: "James Bond'un kötü karakter Scaramanga ile karşılaştığı gizemli ada. Phang Nga körfezinin ikonik kalker kayalıkları."
    }
];

// Entrapment (1999) - TMDb ID: 9603
knownMovieLocations[9603] = [
    {
      name: "Petronas Twin Towers",
      city: "Kuala Lumpur",
      country: "Malaysia",
      coordinates: [3.1578, 101.7119],
      scene: "Tower heist sequence",
      description: "Catherine Zeta-Jones ve Sean Connery'nin lazer güvenlik sistemini aştığı ikonik gökdelen sahnesi.",
      trivia: "Kulelerin arasındaki köprü sahnesi filme gerilim kattı."
    }
];

// The Bourne Legacy (2012) - TMDb ID: 49040
knownMovieLocations[49040] = [
    {
      name: "Intramuros",
      city: "Manila",
      country: "Philippines",
      coordinates: [14.5906, 120.9754],
      scene: "Chase sequences",
      description: "Manila'nın tarihi kalesi çevresinde çekilen aksiyon sahneleri."
    },
    {
      name: "El Nido",
      city: "Palawan",
      country: "Philippines",
      coordinates: [11.1949, 119.4013],
      scene: "Final beach scenes", 
      description: "Filmin final sahnelerinin çekildiği cennet gibi ada. Kristal berraklığında sular ve beyaz kumsal."
    }
];

// Crouching Tiger, Hidden Dragon (2000) - TMDb ID: 146
knownMovieLocations[146] = [
    {
      name: "Anji Bamboo Forest",
      city: "Anji",
      country: "China",
      coordinates: [30.6354, 119.6795],
      scene: "Bamboo forest fight",
      description: "Ziyi Zhang ve Michelle Yeoh'un büyüleyici bambu ormanı dövüş sahnesi. Wuxia sinemasının en ikonik sahnelerinden."
    },
    {
      name: "Hongcun Village",
      city: "Anhui",
      country: "China", 
      coordinates: [30.1131, 117.9882],
      scene: "Traditional village scenes",
      description: "UNESCO Dünya Mirası olan geleneksel Çin köyü. Ming ve Qing hanedanı mimarisi."
    }
];

// In the Mood for Love (2000) - TMDb ID: 843
knownMovieLocations[843] = [
    {
      name: "Hong Kong Streets",
      city: "Hong Kong",
      country: "Hong Kong",
      coordinates: [22.3193, 114.1694],
      scene: "1960s nostalgic scenes",
      description: "Wong Kar-wai'nin ustalık eseri. 1960'lar Hong Kong'unun nostaljik sokakları ve apartmanları."
    },
    {
      name: "Angkor Wat",
      city: "Siem Reap", 
      country: "Cambodia",
      coordinates: [13.4125, 103.8670],
      scene: "Final confession scene",
      description: "Filmin sonunda Tony Leung'un sırlarını Angkor Wat'taki deliğe fısıldadığı unutulmaz sahne."
    }
];

// Black Rain (1989) - TMDb ID: 9552
knownMovieLocations[9552] = [
    {
      name: "Dotonbori District",
      city: "Osaka",
      country: "Japan",
      coordinates: [34.6686, 135.5023],
      scene: "Neon-lit night scenes",
      description: "Michael Douglas'ın Osaka'nın neon ışıklı gece hayatını keşfettiği eğlence bölgesi."
    },
    {
      name: "Osaka Castle",
      city: "Osaka",
      country: "Japan",
      coordinates: [34.6873, 135.5262],
      scene: "Traditional Japan contrast",
      description: "Modern Osaka ile geleneksel Japonya arasındaki kontrastı gösteren tarihi kale."
    }
];

// Lost in Translation (2003) - TMDb ID: 153
knownMovieLocations[153] = [
    {
      name: "Park Hyatt Tokyo",
      city: "Tokyo",
      country: "Japan",
      coordinates: [35.6940, 139.7036],
      scene: "Hotel bar scenes",
      description: "Bill Murray ve Scarlett Johansson'un tanıştığı lüks otel. New York Bar'ın Tokyo manzarası eşsiz."
    },
    {
      name: "Shibuya Crossing",
      city: "Tokyo", 
      country: "Japan",
      coordinates: [35.6598, 139.7006],
      scene: "Iconic Tokyo street scenes",
      description: "Dünyanın en kalabalık yaya geçidi. Tokyo'nun hızlı yaşam temposunu yansıtan ikonik lokasyon."
    }
];

// Doctor Strange (2016) - TMDb ID: 284052
knownMovieLocations[284052] = [
    {
      name: "Kathmandu",
      city: "Kathmandu",
      country: "Nepal",
      coordinates: [27.7172, 85.3240],
      scene: "Ancient One's sanctuary",
      description: "Stephen Strange'in büyücülük öğrendiği mistik şehir. 2015 depreminden sonra Nepal'i desteklemek için seçildi.",
      trivia: "Çekimler büyük deprem sonrası ülkenin turizmine katkı sağlamak amacıyla yapıldı."
    }
];

// Şehir bazında lokasyon sayısı  
export const getLocationCountByCity = () => {
  const cities = {};
  
  Object.values(knownMovieLocations).forEach(locations => {
    locations.forEach(location => {
      const key = `${location.city}, ${location.country}`;
      cities[key] = (cities[key] || 0) + 1;
    });
  });
  
  return cities;
};
