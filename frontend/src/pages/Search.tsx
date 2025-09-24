import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  searchMovies,
  setSearchQuery,
  addToSearchHistory,
} from "../store/slices/movieSlice";
import MovieCard from "../components/MovieCard";

const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localQuery, setLocalQuery] = useState("");

  const { searchResults, isLoading, error } = useAppSelector(
    (state) => state.movies
  );

  const queryParam = searchParams.get("q") || "";

  useEffect(() => {
    if (queryParam) {
      setLocalQuery(queryParam);
      dispatch(setSearchQuery(queryParam));
      dispatch(searchMovies(queryParam));
      dispatch(addToSearchHistory(queryParam));
    }
  }, [queryParam, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search for movies, series, episodes..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? "🔄" : "🔍"}
          </button>
        </div>
      </form>

      {error && <div className="error-message">❌ {error}</div>}

      {searchResults.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <h2>Search Results</h2>
            <span className="results-count">
              Found {searchResults.length} results
            </span>
          </div>

          <div className="movie-grid">
            {searchResults.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {!isLoading && !error && searchResults.length === 0 && queryParam && (
        <div className="no-results">
          <h3>No movies found for "{queryParam}"</h3>
          <p>Try searching with different keywords.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
