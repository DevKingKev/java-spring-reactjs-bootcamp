import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import {
  setSearchQuery,
  searchMovies,
  addToSearchHistory,
} from "../store/slices/movieSlice";

const History: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchHistory } = useAppSelector((state) => state.movies);

  const handleSearchHistoryClick = (query: string) => {
    // Add to search history to trigger reordering (move to front)
    dispatch(addToSearchHistory(query));
    dispatch(setSearchQuery(query));
    dispatch(searchMovies(query));
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <h1>Search History</h1>
        <p>Your recent movie searches</p>
      </div>

      {searchHistory.length === 0 ? (
        <div className="empty-state">
          <h2>📜 No search history yet</h2>
          <p>Start searching for movies to build your search history!</p>
          <Link to="/search" className="search-link">
            🔍 Start Searching
          </Link>
        </div>
      ) : (
        <div className="history-content">
          <div className="history-stats">
            <span className="search-count">
              {searchHistory.length} search
              {searchHistory.length !== 1 ? "es" : ""}
            </span>
          </div>

          <div className="history-list">
            {searchHistory.map((query, index) => (
              <div key={`${query}-${index}`} className="history-item">
                <div className="history-item-content">
                  <div className="search-info">
                    <span className="search-query">{query}</span>
                    <span className="search-index">#{index + 1}</span>
                  </div>
                  <div className="search-actions">
                    <Link
                      to="/search"
                      onClick={() => handleSearchHistoryClick(query)}
                      className="search-again-btn">
                      🔍 Search Again
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
