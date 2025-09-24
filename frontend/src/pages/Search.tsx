import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  searchMovies,
  setSearchQuery,
  addToSearchHistory,
} from "../store/slices/movieSlice";
import MovieList from "../components/MovieList";
import SearchForm from "../components/SearchForm";

const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { searchResults, isLoading, error } = useAppSelector(
    (state) => state.movies
  );

  const queryParam = searchParams.get("q") || "";

  useEffect(() => {
    if (queryParam) {
      dispatch(setSearchQuery(queryParam));
      dispatch(searchMovies(queryParam));
      dispatch(addToSearchHistory(queryParam));
    }
  }, [queryParam, dispatch]);

  return (
    <div className="search-page">
      <SearchForm
        redirectToSearch={false}
        onSearch={() => {}} // Search logic is handled in useEffect
      />

      {error && <div className="error-message">❌ {error}</div>}

      {searchResults.length > 0 && (
        <MovieList
          movies={searchResults}
          title="Search Results"
          showCount={true}
          showSearchQuery={true}
        />
      )}

      {!isLoading && !error && searchResults.length === 0 && queryParam && (
        <MovieList
          movies={[]}
          emptyMessage={`No movies found for "${queryParam}"`}
          emptySubtitle="Try searching with different keywords."
        />
      )}
    </div>
  );
};

export default Search;
