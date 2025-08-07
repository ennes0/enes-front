import axios from 'axios';

class TMDbService {
  constructor() {
    this.apiKey = process.env.REACT_APP_TMDB_API_KEY || 'demo_key';
    this.accessToken = process.env.REACT_APP_TMDB_ACCESS_TOKEN;
    this.baseUrl = 'https://api.themoviedb.org/3';
    this.imageBaseUrl = 'https://image.tmdb.org/t/p';
    
    // Debug: environment değişkenlerini kontrol et
    console.log('🔧 ENV Check:');
    console.log('- API Key:', this.apiKey);
    console.log('- Access Token:', this.accessToken ? 'Present' : 'Missing');
    console.log('- Access Token Length:', this.accessToken?.length || 0);
    
    // Bearer token varsa onu kullan, yoksa api_key kullan
    this.useBearer = !!this.accessToken;
    
    if (!this.accessToken && !process.env.REACT_APP_TMDB_API_KEY) {
      console.warn('⚠️  TMDb API credentials not found. Using demo mode with limited data.');
      console.warn('📝 Please add REACT_APP_TMDB_ACCESS_TOKEN or REACT_APP_TMDB_API_KEY to your .env file');
      console.warn('🔗 Get your credentials from: https://www.themoviedb.org/settings/api');
    }
    
    console.log('🎬 TMDb Service initialized with:', this.useBearer ? 'Bearer token' : 'API key');
  }

  // Request konfigürasyonu oluştur (Bearer token veya API key)
  getRequestConfig(params = {}) {
    console.log('🔧 Request Config - Using Bearer:', this.useBearer);
    
    if (this.useBearer) {
      const config = {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        params: params
      };
      console.log('📡 Bearer Token Request Config:', { 
        hasAuth: !!config.headers.Authorization,
        params: config.params 
      });
      return config;
    } else {
      const config = {
        params: {
          api_key: this.apiKey,
          ...params
        }
      };
      console.log('🔑 API Key Request Config:', config.params);
      return config;
    }
  }

  async getMovieDetails(movieId) {
    try {
      const configEn = this.getRequestConfig({
        language: 'en-US',
        append_to_response: 'credits,images,videos,keywords'
      });
      
      const responseEn = await axios.get(`${this.baseUrl}/movie/${movieId}`, configEn);
      const movieEn = responseEn.data;

      const configTr = this.getRequestConfig({
        language: 'tr-TR',
        append_to_response: 'credits,images,videos,keywords'
      });
      
      const responseTr = await axios.get(`${this.baseUrl}/movie/${movieId}`, configTr);
      const movieTr = responseTr.data;

      const movie = {
        ...movieEn,
        title: movieTr.title || movieEn.title,
        overview: movieTr.overview || movieEn.overview,
        genres: movieTr.genres || movieEn.genres
      };

      console.log(`🎬 Raw TMDb data for ${movie.title}:`, {
        budget: movie.budget,
        revenue: movie.revenue,
        budget_type: typeof movie.budget,
        revenue_type: typeof movie.revenue,
        en_budget: movieEn.budget,
        en_revenue: movieEn.revenue,
        tr_budget: movieTr.budget,
        tr_revenue: movieTr.revenue
      });
      
      const director = movie.credits?.crew?.find(person => person.job === 'Director');

      // Yönetmen fotoğrafı için person details çek (eğer director varsa)
      let directorPhoto = null;
      if (director?.id) {
        try {
          const directorResponse = await axios.get(`${this.baseUrl}/person/${director.id}`, 
            this.getRequestConfig({ language: 'tr-TR' })
          );
          directorPhoto = directorResponse.data.profile_path 
            ? `${this.imageBaseUrl}/w500${directorResponse.data.profile_path}` 
            : null;
          console.log(`🎭 Director photo fetched for ${director.name}:`, directorPhoto ? 'Found' : 'Not found');
        } catch (directorError) {
          console.log(`⚠️ Could not fetch director photo for ${director?.name}`);
        }
      }

      // Film görsellerini ayrı bir API call ile çek
      let movieImages = [];
      try {
        const imagesResponse = await axios.get(
          `${this.baseUrl}/movie/${movieId}/images`, 
          this.getRequestConfig()
        );
        console.log(`� Images API response for ${movie.title}:`, imagesResponse.data);
        
        movieImages = imagesResponse.data?.backdrops?.slice(0, 5).map(image => ({
          url: `${this.imageBaseUrl}/w1280${image.file_path}`,
          width: image.width,
          height: image.height,
          aspectRatio: image.aspect_ratio
        })) || [];
        
        console.log(`🖼️ Processed ${movieImages.length} movie images for ${movie.title}:`, movieImages);
      } catch (imageError) {
        console.log(`⚠️ Could not fetch images for ${movie.title}:`, imageError.message);
      }

      console.log(`💰 Budget: $${movie.budget}, Revenue: $${movie.revenue}`);

      const result = {
        id: movie.id,
        tmdbId: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        year: new Date(movie.release_date).getFullYear(),
        rating: Math.round(movie.vote_average * 10) / 10,
        runtime: movie.runtime,
        poster: movie.poster_path ? `${this.imageBaseUrl}/w500${movie.poster_path}` : null,
        backdrop: movie.backdrop_path ? `${this.imageBaseUrl}/w1280${movie.backdrop_path}` : null,
        description: movie.overview || 'Açıklama bulunamadı.',
        director: director?.name || 'Bilinmiyor',
        directorId: director?.id || null,
        directorPhoto: directorPhoto,
        images: movieImages,
        genre: movie.genres?.map(g => g.name) || [],
        language: movie.spoken_languages?.[0]?.english_name || 'English',
        budget: movie.budget || 0,
        revenue: movie.revenue || 0,
        popularity: movie.popularity || 0,
        voteCount: movie.vote_count || 0,
        productionCompanies: movie.production_companies?.map(c => c.name) || [],
        productionCountries: movie.production_countries?.map(c => c.name) || [],
        keywords: movie.keywords?.keywords?.map(k => k.name) || [],
        cast: movie.credits?.cast?.slice(0, 10).map(actor => ({
          name: actor.name,
          character: actor.character,
          profile_path: actor.profile_path ? `${this.imageBaseUrl}/w185${actor.profile_path}` : null
        })) || []
      };
      
      console.log(`💰 Budget & Revenue for ${movie.title}:`, {
        budget: movie.budget,
        revenue: movie.revenue,
        formatted_budget: movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A',
        formatted_revenue: movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'
      });

      return result;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      return null;
    }
  }

  // Popüler filmleri getir
  async getPopularMovies(page = 1) {
    try {
      const config = this.getRequestConfig({
        language: 'tr-TR',
        page: page
      });
      
      const response = await axios.get(`${this.baseUrl}/movie/popular`, config);
      
      return response.data.results.map(movie => this.formatMovieData(movie));
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  }

  // Film ara
  async searchMovies(query, page = 1) {
    try {
      const config = this.getRequestConfig({
        language: 'tr-TR',
        query: encodeURIComponent(query),
        page: page
      });
      
      const response = await axios.get(`${this.baseUrl}/search/movie`, config);
      
      return response.data.results.map(movie => this.formatMovieData(movie));
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  // Film verisini formatla
  formatMovieData(movie) {
    return {
      id: movie.id,
      tmdbId: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
      rating: Math.round(movie.vote_average * 10) / 10,
      poster: movie.poster_path ? `${this.imageBaseUrl}/w500${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${this.imageBaseUrl}/w1280${movie.backdrop_path}` : null,
      description: movie.overview || 'Açıklama bulunamadı.',
      genre: movie.genre_ids || [], // Bu daha sonra genre mapping ile çözülecek
      language: movie.original_language?.toUpperCase() || 'EN',
      popularity: movie.popularity,
      voteCount: movie.vote_count
    };
  }

  // Genre ID'lerini isimlere çevir
  async getGenres() {
    try {
      const config = this.getRequestConfig({
        language: 'tr-TR'
      });
      
      const response = await axios.get(`${this.baseUrl}/genre/movie/list`, config);
      
      const genreMap = {};
      response.data.genres.forEach(genre => {
        genreMap[genre.id] = genre.name;
      });
      
      return genreMap;
    } catch (error) {
      console.error('Error fetching genres:', error);
      return {};
    }
  }

  // Belirli filmlerin detaylarını toplu getir
  async getBatchMovieDetails(movieIds) {
    const movies = [];
    const genreMap = await this.getGenres();
    
    for (const movieId of movieIds) {
      try {
        const movie = await this.getMovieDetails(movieId);
        if (movie) {
          // Genre ID'lerini isimlere çevir
          if (Array.isArray(movie.genre) && movie.genre.length > 0 && typeof movie.genre[0] === 'number') {
            movie.genre = movie.genre.map(genreId => genreMap[genreId] || 'Diğer');
          }
          movies.push(movie);
        }
        
        // Rate limiting için kısa bekleme
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing movie ID ${movieId}:`, error);
      }
    }
    
    return movies;
  }

  // Image URL builder
  getImageUrl(path, size = 'w500') {
    if (!path) return null;
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  // TMDb'den çekim lokasyonu ipuçları çıkar
  extractLocationHints(movie) {
    const locationKeywords = [
      'new york', 'paris', 'london', 'tokyo', 'istanbul', 'rome', 'berlin',
      'los angeles', 'chicago', 'sydney', 'bangkok', 'dubai', 'moscow',
      'prague', 'vienna', 'budapest', 'amsterdam', 'barcelona', 'milan'
    ];
    
    const hints = [];
    
    // Production countries'den
    if (movie.productionCountries) {
      hints.push(...movie.productionCountries);
    }
    
    // Keywords'den
    if (movie.keywords) {
      const locationKeys = movie.keywords.filter(keyword =>
        locationKeywords.some(location =>
          keyword.toLowerCase().includes(location)
        )
      );
      hints.push(...locationKeys);
    }
    
    // Film title'dan
    locationKeywords.forEach(location => {
      if (movie.title.toLowerCase().includes(location) || 
          movie.originalTitle?.toLowerCase().includes(location)) {
        hints.push(location);
      }
    });
    
    return [...new Set(hints)]; // Duplicate'leri kaldır
  }
}

export default new TMDbService();
