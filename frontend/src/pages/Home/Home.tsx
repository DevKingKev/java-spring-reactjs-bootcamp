import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

const Home: React.FC = () => {
  const { searchHistory } = useAppSelector((state) => state.movies);

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Movie Search</h1>
        <p>Discover and explore movies, series, and more!</p>
        <Link to="/search" className="cta-button">
          Start Searching
        </Link>
      </div>

      {searchHistory.length > 0 && (
        <div className="recent-searches">
          <h2>Recent Searches</h2>
          <div className="search-history-list">
            {searchHistory.slice(0, 5).map((query, index) => (
              <Link
                key={index}
                to={`/search?q=${encodeURIComponent(query)}`}
                className="search-history-item"
              >
                {query}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;