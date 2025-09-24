import React from "react";
import { useAppSelector } from "../hooks/redux";
import MovieList from "../components/MovieList";

const Favourites: React.FC = () => {
  const { favouriteMovies, isLoading } = useAppSelector(
    (state) => state.movies
  );

  return (
    <div className="favourites-page">
      <div className="page-header">
        <h1>Your Favourite Movies</h1>
        <p>Movies you've added to your favorites collection</p>
      </div>

      {/* Show loading state if needed */}
      {isLoading && <div className="loading-spinner"></div>}

      {/* Show favourite movies */}
      {!isLoading && (
        <MovieList
          movies={favouriteMovies}
          title="Favourite Movies"
          showCount={true}
          emptyMessage="No favourite movies yet"
          emptySubtitle="Start adding movies to your favourites by clicking the heart icon on any movie card!"
          className="favourites-list"
        />
      )}
    </div>
  );
};

export default Favourites;
