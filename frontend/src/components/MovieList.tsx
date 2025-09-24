import React from "react";
import { useAppSelector } from "../hooks/redux";
import { MovieListItem } from "../types/movie.types";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: MovieListItem[];
  title?: string;
  showCount?: boolean;
  emptyMessage?: string;
  emptySubtitle?: string;
  className?: string;
  showSearchQuery?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  title,
  showCount = true,
  emptyMessage = "No movies to display",
  emptySubtitle,
  className = "",
  showSearchQuery = false,
}) => {
  const { searchQuery } = useAppSelector((state) => state.movies);

  // Generate title with search query if enabled
  const displayTitle =
    showSearchQuery && searchQuery
      ? `${title || "Search Results"}: ${searchQuery}`
      : title;

  if (movies.length === 0) {
    return (
      <div className={`no-results ${className}`}>
        <h3>{emptyMessage}</h3>
        {emptySubtitle && <p>{emptySubtitle}</p>}
      </div>
    );
  }

  return (
    <div className={`movie-list ${className}`}>
      {displayTitle && (
        <div className="results-header">
          <h2>{displayTitle}</h2>
          {showCount && (
            <span className="results-count">
              {movies.length === 1 ? "1 movie" : `${movies.length} movies`}
            </span>
          )}
        </div>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
