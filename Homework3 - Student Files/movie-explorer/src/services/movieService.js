const API_KEY = '3ff29cc594e79e74dc510cf71dca0c95';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

class MovieService {
  async fetchMovies(page = 1, sortBy = 'popularity.desc') {
    try {
      const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        movies: data.results,
        totalPages: data.total_pages,
        currentPage: data.page
      };
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error('Failed to load movies. Please check your internet connection and try again.');
    }
  }

  async searchMovies(query, page = 1) {
    try {
      const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
        movies: data.results,
        totalPages: data.total_pages,
        currentPage: data.page
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw new Error('Failed to search movies. Please try again.');
    }
  }

  sortMovies(movies, sortBy) {
    const sortedMovies = [...movies];
    
    switch(sortBy) {
      case 'release_date.desc':
        return sortedMovies.sort((a, b) => new Date(b.release_date || '1900-01-01') - new Date(a.release_date || '1900-01-01'));
      case 'release_date.asc':
        return sortedMovies.sort((a, b) => new Date(a.release_date || '1900-01-01') - new Date(b.release_date || '1900-01-01'));
      case 'vote_average.desc':
        return sortedMovies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'vote_average.asc':
        return sortedMovies.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
      default:
        return sortedMovies;
    }
  }

  getImageUrl(posterPath) {
    return posterPath 
      ? `${IMG_BASE_URL}${posterPath}` 
      : 'https://via.placeholder.com/500x750?text=No+Image';
  }
}

const movieService = new MovieService();
export default movieService;