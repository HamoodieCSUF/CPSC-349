import React from 'react';
import movieService from '../services/movieService';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const posterPath = movieService.getImageUrl(movie.poster_path);
  const releaseDate = movie.release_date || 'Unknown';
  const rating = movie.vote_average ? movie.vote_average.toFixed(2) : 'N/A';

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
  };

  return (
    <div className="movie-card">
      <img 
        src={posterPath} 
        alt={movie.title} 
        className="movie-poster"
        onError={handleImageError}
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-date">Release Date: {releaseDate}</div>
        <div className="movie-rating">Rating: {rating}</div>
      </div>
    </div>
  );
};

export default MovieCard;