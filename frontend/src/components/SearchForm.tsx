import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  searchMovies,
  setSearchQuery,
  addToSearchHistory,
} from "../store/slices/movieSlice";

interface SearchFormProps {
  placeholder?: string;
  redirectToSearch?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
  showButton?: boolean;
  autoFocus?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  placeholder = "Search for movies, series, episodes...",
  redirectToSearch = true,
  onSearch,
  className = "",
  showButton = true,
  autoFocus = false,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [localQuery, setLocalQuery] = useState("");

  const { isLoading } = useAppSelector((state) => state.movies);

  const queryParam = searchParams.get("q") || "";

  // Sync with URL params (mainly for Search page)
  useEffect(() => {
    if (queryParam && redirectToSearch) {
      setLocalQuery(queryParam);
    }
  }, [queryParam, redirectToSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = localQuery.trim();

    if (trimmedQuery) {
      // Add to search history
      dispatch(addToSearchHistory(trimmedQuery));

      if (redirectToSearch) {
        // Navigate to search page with query param
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      } else {
        // Execute search directly (for Search page)
        dispatch(setSearchQuery(trimmedQuery));
        dispatch(searchMovies(trimmedQuery));
      }

      // Call custom onSearch handler if provided
      if (onSearch) {
        onSearch(trimmedQuery);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSearch} className={`search-form ${className}`}>
      <div className="search-input-group">
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
          autoFocus={autoFocus}
        />
        {showButton && (
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? "🔄" : "🔍"}
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchForm;
