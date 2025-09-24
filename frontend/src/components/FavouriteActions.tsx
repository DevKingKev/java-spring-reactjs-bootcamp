import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  toggleFavourite,
  addToFavourites,
  removeFromFavourites,
} from "../store/slices/movieSlice";
import { MovieListItem } from "../types/movie.types";

interface FavouriteActionsProps {
  movie: MovieListItem;
  showLabel?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "icon" | "button";
}

const FavouriteActions: React.FC<FavouriteActionsProps> = ({
  movie,
  showLabel = false,
  size = "medium",
  variant = "icon",
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const favouriteMovies = useSelector(
    (state: RootState) => state.movies.favouriteMovies
  );

  const isFavourite = favouriteMovies.some(
    (fav) => fav.imdbID === movie.imdbID
  );

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if used inside a Link
    e.stopPropagation(); // Stop event bubbling
    dispatch(toggleFavourite(movie));
  };

  const handleAddToFavourites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToFavourites(movie));
  };

  const handleRemoveFromFavourites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeFromFavourites(movie.imdbID));
  };

  // Size classes for styling
  const sizeClasses = {
    small: "favourite-btn-small",
    medium: "favourite-btn-medium",
    large: "favourite-btn-large",
  };

  if (variant === "button") {
    return (
      <div className="favourite-actions">
        {isFavourite ? (
          <button
            onClick={handleRemoveFromFavourites}
            className={`favourite-btn remove-favourite ${sizeClasses[size]}`}
            title="Remove from favourites">
            ❤️ {showLabel && "Remove from Favourites"}
          </button>
        ) : (
          <button
            onClick={handleAddToFavourites}
            className={`favourite-btn add-favourite ${sizeClasses[size]}`}
            title="Add to favourites">
            🤍 {showLabel && "Add to Favourites"}
          </button>
        )}
      </div>
    );
  }

  // Default icon variant
  return (
    <div className="favourite-actions">
      <button
        onClick={handleToggleFavourite}
        className={`favourite-toggle ${sizeClasses[size]} ${
          isFavourite ? "is-favourite" : "not-favourite"
        }`}
        title={isFavourite ? "Remove from favourites" : "Add to favourites"}
        aria-label={
          isFavourite ? "Remove from favourites" : "Add to favourites"
        }>
        {isFavourite ? "❤️" : "🤍"}
        {showLabel && (
          <span className="favourite-label">
            {isFavourite ? "Favourited" : "Add to Favourites"}
          </span>
        )}
      </button>
    </div>
  );
};

export default FavouriteActions;
