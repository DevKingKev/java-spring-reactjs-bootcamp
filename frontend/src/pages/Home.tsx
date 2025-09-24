import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import SearchForm from "../components/SearchForm";
import MovieList from "../components/MovieList";

const Home: React.FC = () => {
  const { searchHistory, searchResults, isLoading, error } = useAppSelector(
    (state) => state.movies
  );

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Movie Search</h1>
        <p>Discover and explore movies, series, and more!</p>
        <SearchForm
          placeholder="What movie are you looking for?"
          autoFocus={false}
          redirectToSearch={false}
        />
      </div>

      {/* Show search results if any */}
      {searchResults.length > 0 && (
        <MovieList
          movies={searchResults}
          title="Search Results"
          showCount={true}
          className="home-results"
          showSearchQuery={true}
        />
      )}

      {/* Show loading state */}
      {isLoading && <div className="loading-spinner"></div>}

      {/* Show error state */}
      {error && <div className="error-message">❌ {error}</div>}

      {searchHistory.length > 0 && (
        <div className="recent-searches">
          <h2>Recent Searches</h2>
          <div className="search-history-list">
            {searchHistory.slice(0, 5).map((query, index) => (
              <p key={index}>
                <Link
                  to={`/search?q=${encodeURIComponent(query)}`}
                  className="search-history-item">
                  {query}
                </Link>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
