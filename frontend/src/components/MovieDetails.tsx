import React from "react";
import { MovieDetail } from "../types/movie.types";
import FavouriteActions from "./FavouriteActions";

interface MovieDetailsProps {
  movie: MovieDetail;
  isLoading?: boolean;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="loading-spinner"></div>;
  }

  // Convert MovieDetail to MovieListItem for FavouriteActions
  const movieListItem = {
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Type: movie.Type,
    Poster: movie.Poster,
  };

  return (
    <div className="movie-details">
      <div className="movie-details-container">
        <div className="movie-poster-section">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="movie-poster-large"
            />
          ) : (
            <div className="poster-placeholder-large">🎬</div>
          )}
        </div>

        <div className="movie-info-section">
          <div className="movie-header">
            <div className="movie-title-section">
              <h1 className="movie-title-large">{movie.Title}</h1>
              <div className="movie-meta">
                <span className="movie-year-large">{movie.Year}</span>
                <span className="movie-rating">{movie.Rated}</span>
                <span className="movie-runtime">{movie.Runtime}</span>
              </div>
            </div>
            <div className="movie-actions">
              <FavouriteActions
                movie={movieListItem}
                variant="button"
                showLabel={true}
                size="large"
              />
            </div>
          </div>

          <div className="movie-details-grid">
            <div className="detail-section">
              <h3>Plot</h3>
              <p className="movie-plot">{movie.Plot}</p>
            </div>

            <div className="detail-section">
              <h3>Genre</h3>
              <div className="genre-tags">
                {movie.Genre?.split(", ").map((genre, index) => (
                  <span key={index} className="genre-tag">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Director</h3>
              <p>{movie.Director}</p>
            </div>

            <div className="detail-section">
              <h3>Cast</h3>
              <p>{movie.Actors}</p>
            </div>

            <div className="detail-section">
              <h3>Writer</h3>
              <p>{movie.Writer}</p>
            </div>

            {movie.imdbRating && movie.imdbRating !== "N/A" && (
              <div className="detail-section">
                <h3>IMDb Rating</h3>
                <div className="rating-display">
                  <span className="rating-score">⭐ {movie.imdbRating}</span>
                  <span className="rating-votes">
                    ({movie.imdbVotes} votes)
                  </span>
                </div>
              </div>
            )}

            {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
              <div className="detail-section">
                <h3>Box Office</h3>
                <p>{movie.BoxOffice}</p>
              </div>
            )}

            <div className="detail-section">
              <h3>Release Date</h3>
              <p>{movie.Released}</p>
            </div>

            <div className="detail-section">
              <h3>Language</h3>
              <p>{movie.Language}</p>
            </div>

            <div className="detail-section">
              <h3>Country</h3>
              <p>{movie.Country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
