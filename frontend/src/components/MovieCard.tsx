import React from "react";
import { Link } from "react-router-dom";
import { MovieListItem } from "../types/movie.types";
import FavouriteActions from "./FavouriteActions";

interface MovieCardProps {
  movie: MovieListItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.imdbID}`} className="movie-link">
        <div className="movie-poster">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <img src={movie.Poster} alt={movie.Title} />
          ) : (
            <div className="poster-placeholder">🎬</div>
          )}
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.Title}</h3>
          <p className="movie-year">{movie.Year}</p>
          <span className="movie-type">{movie.Type}</span>
        </div>
      </Link>
      <FavouriteActions movie={movie} size="medium" />
    </div>
  );
};

export default MovieCard;
