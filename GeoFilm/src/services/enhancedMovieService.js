import tmdbService from './tmdbService';
import { getMovieLocations, getAllKnownLocations } from '../data/knownMovieLocations';

class EnhancedMovieService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 dakika cache
  }

  // Başlangıçta sadece temel lokasyon verilerini getir (API çağrısı yok)
  getBasicLocationsData() {
    console.log('📍 Loading basic locations data (no API calls)...');
    
    // Bilinen lokasyonları olan filmler
    const knownMovieIds = [
      // Mevcut filmler
      37724, // Skyfall
      313369, // La La Land  
      27205, // Inception
      155, // The Dark Knight
      289, // Casablanca
      194, // Amélie
      603, // The Matrix
      153, // Lost in Translation
      59436, // Midnight in Paris
      
      // Yeni popüler filmler
      11, // Star Wars: A New Hope
      238, // The Godfather
      278, // The Shawshank Redemption
      680, // Pulp Fiction
      13, // Forrest Gump
      769, // GoodFellas
      424, // Schindler's List
      872, // Toy Story
      497, // The Green Mile
      550, // Fight Club
      
      // Action/Adventure
      19995, // Avatar
      597, // Titanic
      24428, // The Avengers
      118340, // Guardians of the Galaxy
      120, // The Lord of the Rings: The Fellowship of the Ring
      121, // The Lord of the Rings: The Two Towers
      122, // The Lord of the Rings: The Return of the King
      1891, // The Empire Strikes Back
      1892, // Return of the Jedi
      
      // Yeni çıkan popüler filmler
      299536, // Avengers: Infinity War
      299534, // Avengers: Endgame (Fixed ID)
      335983, // Venom
      447365, // Guardians of the Galaxy Vol. 3
      526896, // Morbius
      436270, // Black Adam
      505642, // Black Panther: Wakanda Forever
      
      // Marvel Extended Universe
      10195, // Thor
      1771, // Captain America: The First Avenger
      10138, // Iron Man 2
      68721, // Iron Man 3
      76338, // Thor: The Dark World
      284054, // Black Panther
      315635, // Spider-Man: Homecoming
      1724, // The Incredible Hulk
      271110, // Captain America: Civil War
      99861, // Avengers: Age of Ultron
      
      // Recent Major Films (2023-2025)
      575264, // Mission: Impossible - The Final Reckoning
      872585, // Oppenheimer
      603692, // John Wick: Chapter 4
      335977, // Indiana Jones and the Dial of Destiny
      466420, // Killers of the Flower Moon
      677179, // Creed III
      1207830, // Superman (2025)
      1267036, // Paddington in Peru
      1311550, // Happy Gilmore 2
      1309297, // Christopher Nolan's The Odyssey
      1284167, // Spider-Man: Brand New Day
      
      // Asian Cinema Classics
      1593, // Lara Croft: Tomb Raider
      616, // The Last Samurai
      455207, // Crazy Rich Asians
      293167, // Kong: Skull Island
      1535, // The Beach
      682, // The Man with the Golden Gun
      9603, // Entrapment
      49040, // The Bourne Legacy
      146, // Crouching Tiger, Hidden Dragon
      843, // In the Mood for Love
      9552, // Black Rain
      153, // Lost in Translation (already exists)
      284052, // Doctor Strange
      
      // Türk filmleri (eğer TMDb'de varsa)
      // Bu ID'leri kontrol etmek gerekecek
    ];

    // Her film ID'si için lokasyonları getir
    const allLocations = [];
    knownMovieIds.forEach(movieId => {
      const locations = getMovieLocations(movieId);
      locations.forEach((location, index) => {
        allLocations.push({
          id: `${movieId}_${index}`,
          ...location,
          lat: location.coordinates[0],
          lng: location.coordinates[1],
          movieId: movieId,
          // Temel film bilgileri (API'dan değil, static)
          movieTitle: this.getBasicMovieInfo(movieId).title,
          movieYear: this.getBasicMovieInfo(movieId).year,
          moviePoster: null // Başlangıçta yok, tıklandığında gelecek
        });
      });
    });

    console.log(`📍 Loaded ${allLocations.length} locations for ${knownMovieIds.length} movies`);
    return allLocations;
  }

  // Temel film bilgileri (hardcoded, API'sız)
  getBasicMovieInfo(movieId) {
    const basicInfo = {
      // Mevcut filmler
      37724: { title: 'Skyfall', year: 2012 },
      313369: { title: 'La La Land', year: 2016 },
      27205: { title: 'Inception', year: 2010 },
      155: { title: 'The Dark Knight', year: 2008 },
      289: { title: 'Casablanca', year: 1942 },
      194: { title: 'Amélie', year: 2001 },
      603: { title: 'The Matrix', year: 1999 },
      153: { title: 'Lost in Translation', year: 2003 },
      59436: { title: 'Midnight in Paris', year: 2011 },
      
      // Klasik filmler
      11: { title: 'Star Wars: A New Hope', year: 1977 },
      238: { title: 'The Godfather', year: 1972 },
      278: { title: 'The Shawshank Redemption', year: 1994 },
      680: { title: 'Pulp Fiction', year: 1994 },
      13: { title: 'Forrest Gump', year: 1994 },
      769: { title: 'GoodFellas', year: 1990 },
      424: { title: 'Schindler\'s List', year: 1993 },
      872: { title: 'Toy Story', year: 1995 },
      497: { title: 'The Green Mile', year: 1999 },
      550: { title: 'Fight Club', year: 1999 },
      
      // Büyük yapımlar
      19995: { title: 'Avatar', year: 2009 },
      597: { title: 'Titanic', year: 1997 },
      24428: { title: 'The Avengers', year: 2012 },
      118340: { title: 'Guardians of the Galaxy', year: 2014 },
      120: { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
      121: { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
      122: { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
      1891: { title: 'The Empire Strikes Back', year: 1980 },
      1892: { title: 'Return of the Jedi', year: 1983 },
      
      // Yeni Marvel filmleri
      299536: { title: 'Avengers: Infinity War', year: 2018 },
      299537: { title: 'Avengers: Endgame', year: 2019 },
      335983: { title: 'Venom', year: 2018 },
      447365: { title: 'Guardians of the Galaxy Vol. 3', year: 2023 },
      526896: { title: 'Morbius', year: 2022 },
      436270: { title: 'Black Adam', year: 2022 },
      505642: { title: 'Black Panther: Wakanda Forever', year: 2022 },
      
      // Asian Cinema Classics
      1593: { title: 'Lara Croft: Tomb Raider', year: 2001 },
      616: { title: 'The Last Samurai', year: 2003 },
      455207: { title: 'Crazy Rich Asians', year: 2018 },
      293167: { title: 'Kong: Skull Island', year: 2017 },
      1535: { title: 'The Beach', year: 2000 },
      682: { title: 'The Man with the Golden Gun', year: 1974 },
      9603: { title: 'Entrapment', year: 1999 },
      49040: { title: 'The Bourne Legacy', year: 2012 },
      146: { title: 'Crouching Tiger, Hidden Dragon', year: 2000 },
      843: { title: 'In the Mood for Love', year: 2000 },
      9552: { title: 'Black Rain', year: 1989 },
      284052: { title: 'Doctor Strange', year: 2016 }
    };
    return basicInfo[movieId] || { title: 'Unknown Movie', year: 'Unknown' };
  }

  // Marker'a tıklandığında tek film için detaylı veri çek
  async getMovieDetails(movieId) {
    const cacheKey = `movie_${movieId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`🎬 Using cached data for movie ${movieId}`);
      return cached.data;
    }

    try {
      console.log(`🎬 Fetching detailed data for movie ${movieId} from TMDb...`);
      const movieData = await tmdbService.getMovieDetails(movieId);
      
      // Cache'e kaydet
      this.cache.set(cacheKey, {
        data: movieData,
        timestamp: Date.now()
      });

      console.log(`✅ Successfully loaded movie details for: ${movieData.title}`);
      return movieData;

    } catch (error) {
      console.error(`❌ Error fetching movie ${movieId}:`, error);
      
      // Fallback olarak temel bilgileri döndür
      const basicInfo = this.getBasicMovieInfo(movieId);
      return {
        id: movieId,
        tmdbId: movieId,
        title: basicInfo.title,
        year: basicInfo.year,
        director: 'Bilinmiyor',
        rating: 0,
        description: 'Film detayları yüklenemedi.',
        images: [],
        genre: [],
        budget: 0,
        revenue: 0
      };
    }
  }
  async getEnhancedMoviesData() {
    const cacheKey = 'enhanced_movies';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log('� Using cached movie data');
      return cached.data;
    }

    try {
      // Bilinen lokasyonları olan filmler
      const knownMovieIds = [
        37724, // Skyfall
        313369, // La La Land  
        27205, // Inception
        155, // The Dark Knight
        289, // Casablanca
        194, // Amélie
        603, // The Matrix
        153, // Lost in Translation
        59436, // Midnight in Paris
      ];

      console.log('🎬 Fetching enhanced movie data from TMDb...');
      const movies = await tmdbService.getBatchMovieDetails(knownMovieIds);
      
      // Her filme lokasyon verilerini ekle
      const enhancedMovies = movies.map(movie => {
        const locations = getMovieLocations(movie.tmdbId);
        return {
          ...movie,
          locations: locations.map((location, index) => ({
            id: `${movie.tmdbId}_${index}`,
            ...location,
            lat: location.coordinates[0],
            lng: location.coordinates[1],
            movieId: movie.tmdbId,
            movieTitle: movie.title,
            moviePoster: movie.poster
          }))
        };
      });

      const result = enhancedMovies.filter(movie => movie.locations.length > 0);
      
      // API'den gelen veri detaylarını logla
      console.log('🎬 TMDb API Response Details:');
      result.forEach((movie, index) => {
        console.log(`📽️ Movie ${index + 1}:`, {
          title: movie.title,
          tmdbId: movie.tmdbId,
          year: movie.year,
          director: movie.director,
          rating: movie.rating,
          poster: movie.poster,
          locationCount: movie.locations.length
        });
        
        console.log(`📍 Locations for "${movie.title}":`);
        movie.locations.forEach((location, locIndex) => {
          console.log(`  ${locIndex + 1}. ${location.name} (${location.city}, ${location.country})`);
          console.log(`     Scene: ${location.scene}`);
          console.log(`     Coordinates: [${location.lat}, ${location.lng}]`);
        });
        console.log('─'.repeat(40));
      });
      
      // Cache'e kaydet
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      console.log(`✅ Enhanced ${result.length} movies with ${result.reduce((sum, m) => sum + m.locations.length, 0)} locations`);
      return result;

    } catch (error) {
      console.error('❌ Error getting enhanced movies data:', error);
      
      // API'den veri alınamadığında boş dizi döndür
      console.log('⚠️ Could not fetch from API, returning empty data');
      return [];
    }
  }

  // Fallback static data (TMDb erişimi yoksa)
  getFallbackData() {
    console.log('📦 Using fallback movie data...');
    console.log('🔧 Fallback data will include director photos and images');
    
    const fallbackMovies = [
      {
        id: 37724,
        tmdbId: 37724,
        title: "Skyfall",
        year: 2012,
        director: "Sam Mendes",
        directorPhoto: "https://image.tmdb.org/t/p/w500/8lHOeJCFRJbkHaYsrWr4PVXRXec.jpg",
        rating: 7.8,
        runtime: 143,
        poster: "https://image.tmdb.org/t/p/w500/b9VYy7yIFbU1UJ0dKHm6VhSFjrc.jpg",
        description: "James Bond'un geçmişi gün yüzüne çıkarken, M'in de geçmişi onu tehdit eder. Bond, Skyfall'un sırlarını çözmek için mücadele eder.",
        genre: ["Action", "Adventure", "Thriller"],
        language: "English",
        images: {
          backdrops: [
            { url: "https://image.tmdb.org/t/p/w1280/lbctonEnewCYZ4FYoTZhs8cidAl.jpg" },
            { url: "https://image.tmdb.org/t/p/w1280/2hm3A9GDQCEKhgP5dCDDUND6LqO.jpg" },
            { url: "https://image.tmdb.org/t/p/w1280/qS9R8bqLIhzpLBKH8gU6eLFeICG.jpg" }
          ],
          posters: [
            { url: "https://image.tmdb.org/t/p/w500/b9VYy7yIFbU1UJ0dKHm6VhSFjrc.jpg" },
            { url: "https://image.tmdb.org/t/p/w500/uhaJUNda0I5BF8y2ToTBAAGOKZ2.jpg" }
          ]
        }
      },
      {
        id: 313369,
        tmdbId: 313369,
        title: "La La Land", 
        year: 2016,
        director: "Damien Chazelle",
        directorPhoto: "https://image.tmdb.org/t/p/w500/14kDNmR7cmoGgX1qgcJG0yp6Zn.jpg",
        rating: 8.0,
        runtime: 128,
        poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg", 
        description: "Los Angeles'ta yaşayan iki sanatçının aşk hikayesi. Sebastian ve Mia'nın hayallerini gerçekleştirme mücadelesi.",
        genre: ["Comedy", "Drama", "Musical"],
        language: "English",
        images: {
          backdrops: [
            { url: "https://image.tmdb.org/t/p/w1280/fp6x5lNSKMhMxoGgx8z04sMpZTz.jpg" },
            { url: "https://image.tmdb.org/t/p/w1280/ylXCdC106IKiarftHkcacasaAcb.jpg" },
            { url: "https://image.tmdb.org/t/p/w1280/4PgAn0NqcFfRrpaDdKD4Mq2lNNT.jpg" }
          ],
          posters: [
            { url: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg" },
            { url: "https://image.tmdb.org/t/p/w500/y5lG7TBpeYf6EHdS6tyyWl9NtsX.jpg" }
          ]
        }
      },
      {
        id: 27205,
        tmdbId: 27205,
        title: "Inception",
        year: 2010,
        director: "Christopher Nolan", 
        directorPhoto: "https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
        rating: 8.8,
        runtime: 148,
        poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        description: "Dom Cobb, rüyalara girerek insanların bilinçaltındaki sırları çalan yetenekli bir hırsızdır.",
        genre: ["Action", "Sci-Fi", "Thriller"],
        language: "English",
        images: {
          backdrops: [
            { url: "https://image.tmdb.org/t/p/w1280/8IB2e4r4oVhHnANbnm7O3Tj6tF8.jpg" },
            { url: "https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg" },
            { url: "https://image.tmdb.org/t/p/w1280/4PgAn0NqcFfRrpaDdKD4Mq2lNNT.jpg" }
          ],
          posters: [
            { url: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg" },
            { url: "https://image.tmdb.org/t/p/w500/wqtaHWOEZ3rXDJ8c6ZZShulbo18.jpg" }
          ]
        }
      },
      {
        id: 155,
        tmdbId: 155,
        title: "The Dark Knight",
        year: 2008,
        director: "Christopher Nolan",
        directorPhoto: "https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg",
        rating: 9.0,
        runtime: 152,
        poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        description: "Batman, Lieutenant Gordon ve District Attorney Harvey Dent ile birlikte Gotham şehrini suçlulardan temizlemeye çalışır.",
        genre: ["Action", "Crime", "Drama"],
        language: "English",
        images: {
          backdrops: [
            { url: "https://image.tmdb.org/t/p/w1280/dqK9Hag1054tghRQSqLSfrkvQnA.jpg" },
            { url: "https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg" },
            { url: "https://image.tmdb.org/t/p/w1280/eevJuFMgT7Ba81bCeDWKLjQfC8n.jpg" }
          ],
          posters: [
            { url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
            { url: "https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg" }
          ]
        }
      }
    ];

    const processedFallbackData = fallbackMovies.map(movie => ({
      ...movie,
      locations: getMovieLocations(movie.tmdbId).map((location, index) => ({
        id: `${movie.tmdbId}_${index}`,
        ...location,
        lat: location.coordinates[0],
        lng: location.coordinates[1],
        movieId: movie.tmdbId,
        movieTitle: movie.title,
        moviePoster: movie.poster
      }))
    })).filter(movie => movie.locations.length > 0);

    // Fallback data debug
    console.log('🎭 Fallback Data Details:');
    processedFallbackData.forEach(movie => {
      console.log(`📽️ ${movie.title}:`, {
        directorPhoto: movie.directorPhoto ? 'Has photo' : 'No photo',
        imagesBackdrops: movie.images?.backdrops?.length || 0,
        imagesPosters: movie.images?.posters?.length || 0,
        locationCount: movie.locations.length
      });
    });
    console.log('─'.repeat(50));

    return processedFallbackData;
  }

  // Tek film detayı getir
  async getMovieWithLocations(tmdbId) {
    try {
      const movie = await tmdbService.getMovieDetails(tmdbId);
      if (!movie) return null;

      const locations = getMovieLocations(tmdbId);
      return {
        ...movie,
        locations: locations.map((location, index) => ({
          id: `${tmdbId}_${index}`,
          ...location,
          lat: location.coordinates[0], 
          lng: location.coordinates[1],
          movieId: tmdbId,
          movieTitle: movie.title,
          moviePoster: movie.poster
        }))
      };
    } catch (error) {
      console.error(`Error getting movie ${tmdbId}:`, error);
      return null;
    }
  }

  // Tüm lokasyonları flat liste olarak getir (harita için)
  async getAllLocations() {
    console.log('🗺️ Getting all locations for map display...');
    const movies = await this.getEnhancedMoviesData();
    const allLocations = [];
    
    console.log('🔄 Processing locations from movies...');
    movies.forEach(movie => {
      console.log(`📽️ Processing locations for: ${movie.title}`);
      movie.locations.forEach(location => {
        const enrichedLocation = {
          ...location,
          movie: {
            id: movie.id,
            title: movie.title,
            year: movie.year,
            director: movie.director,
            directorPhoto: movie.directorPhoto, // 👈 Bu eksikti!
            rating: movie.rating,
            poster: movie.poster,
            genre: movie.genre,
            description: movie.description,
            runtime: movie.runtime,
            language: movie.language,
            images: movie.images // 👈 Bu da eksikti!
          }
        };
        
        console.log(`  📍 Added location: ${location.name} (${location.city}, ${location.country})`);
        console.log(`     Movie Data: ${movie.title} (${movie.year}) - Rating: ${movie.rating}`);
        console.log(`     Director Photo: ${movie.directorPhoto ? 'Available' : 'Missing'}`);
        console.log(`     Images: ${movie.images?.backdrops?.length || 0} backdrops, ${movie.images?.posters?.length || 0} posters`);
        
        allLocations.push(enrichedLocation);
      });
    });

    console.log(`🌍 Total locations prepared for map: ${allLocations.length}`);
    console.log('📊 Location distribution:');
    const countryCount = {};
    allLocations.forEach(loc => {
      countryCount[loc.country] = (countryCount[loc.country] || 0) + 1;
    });
    Object.entries(countryCount).forEach(([country, count]) => {
      console.log(`  ${country}: ${count} locations`);
    });
    console.log('═'.repeat(60));
    
    return allLocations;
  }

  // Popüler filmleri TMDb'den getir (ek filmler için)
  async getPopularMovies(page = 1) {
    try {
      return await tmdbService.getPopularMovies(page);
    } catch (error) {
      console.error('Error getting popular movies:', error);
      return [];
    }
  }

  // Film ara
  async searchMovies(query) {
    try {
      return await tmdbService.searchMovies(query);
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  // İstatistikler
  async getStatistics() {
    const movies = await this.getAllLocations();
    const countries = new Set();
    const cities = new Set();
    
    movies.forEach(location => {
      countries.add(location.country);
      cities.add(`${location.city}, ${location.country}`);
    });

    return {
      totalMovies: (await this.getEnhancedMoviesData()).length,
      totalLocations: movies.length,
      totalCountries: countries.size,
      totalCities: cities.size,
      topCountries: this.getTopCountries(movies),
      topCities: this.getTopCities(movies)
    };
  }

  getTopCountries(locations) {
    const countryCount = {};
    locations.forEach(location => {
      countryCount[location.country] = (countryCount[location.country] || 0) + 1;
    });
    
    return Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));
  }

  getTopCities(locations) {
    const cityCount = {}; 
    locations.forEach(location => {
      const key = `${location.city}, ${location.country}`;
      cityCount[key] = (cityCount[key] || 0) + 1;
    });
    
    return Object.entries(cityCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));
  }

  // Cache temizle
  clearCache() {
    this.cache.clear();
  }
}

export default new EnhancedMovieService();
