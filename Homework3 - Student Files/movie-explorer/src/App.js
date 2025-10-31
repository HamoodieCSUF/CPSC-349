import React, { useState, useEffect, useCallback } from 'react';
import MovieCard from './components/MovieCard';
import movieService from './services/movieService';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [isSearchMode, setIsSearchMode] = useState(false);

  const loadMovies = useCallback(async (page = 1, sort = 'popularity.desc') => {
    try {
      setLoading(true);
      setError('');
      
      const data = await movieService.fetchMovies(page, sort);
      setMovies(data.movies);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMovies = useCallback(async (query, page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const data = await movieService.searchMovies(query, page);
      
      if (data.movies.length === 0) {
        setError(`No movies found for "${query}"`);
        setMovies([]);
      } else {
        const sortedMovies = movieService.sortMovies(data.movies, sortBy);
        setMovies(sortedMovies);
      }
      
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  // Debounce search functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      
      if (trimmedQuery) {
        setIsSearchMode(true);
        setCurrentPage(1);
        searchMovies(trimmedQuery, 1);
      } else {
        setIsSearchMode(false);
        setCurrentPage(1);
        loadMovies(1, sortBy);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchMovies, loadMovies, sortBy]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
    
    if (isSearchMode && searchQuery.trim()) {
      searchMovies(searchQuery.trim(), 1);
    } else {
      loadMovies(1, newSortBy);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      
      if (isSearchMode && searchQuery.trim()) {
        searchMovies(searchQuery.trim(), newPage);
      } else {
        loadMovies(newPage, sortBy);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      
      if (isSearchMode && searchQuery.trim()) {
        searchMovies(searchQuery.trim(), newPage);
      } else {
        loadMovies(newPage, sortBy);
      }
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Movie Explorer</h1>
      </header>

      <div className="controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </div>

        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value || 'popularity.desc')}
          >
            <option value="">Sort By</option>
            <option value="release_date.desc">Release Date (Desc)</option>
            <option value="release_date.asc">Release Date (Asc)</option>
            <option value="vote_average.desc">Rating (Desc)</option>
            <option value="vote_average.asc">Rating (Asc)</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="loading">Loading movies...</div>
      )}

      {error && (
        <div className="error-message">{error}</div>
      )}

      {!loading && !error && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <div className="pagination">
        <button 
          className="pagination-btn" 
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span className="page-info">Page {currentPage} of {totalPages}</span>
        <button 
          className="pagination-btn" 
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
