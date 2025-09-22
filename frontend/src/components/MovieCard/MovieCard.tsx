import React from 'react';
import { Link } from 'react-router-dom';
import { MovieListItem } from '../../types/movie.types';

interface MovieCardProps {
  movie: MovieListItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.imdbID}`} className="movie-link">
        <div className="movie-poster">
          {movie.poster && movie.poster !== 'N/A' ? (
            <img src={movie.poster} alt={movie.title} />
          ) : (
            <div className="poster-placeholder">
              🎬
            </div>
          )}
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">{movie.year}</p>
          <span className="movie-type">{movie.type}</span>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;