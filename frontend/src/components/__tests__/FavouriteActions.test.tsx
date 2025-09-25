import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import FavouriteActions from "../FavouriteActions";
import movieReducer from "../../store/slices/movieSlice";

const mockMovie = {
  Title: "Test Movie",
  Year: "2023",
  imdbID: "tt1234567",
  Type: "movie" as const,
  Poster: "https://example.com/poster.jpg",
};

const createMockStore = (favouriteMovies: any[] = []) => {
  return configureStore({
    reducer: {
      movies: movieReducer,
    },
    preloadedState: {
      movies: {
        searchResults: [],
        favouriteMovies,
        selectedMovie: null,
        fetchedMovies: {},
        searchQuery: "",
        totalResults: "0",
        isLoading: false,
        isLoadingDetail: false,
        error: null,
        searchHistory: [],
      },
    },
  });
};

const renderWithStore = (component: React.ReactElement, store: any) => {
  return render(<Provider store={store}>{component}</Provider>);
};

test("renders add to favourites button when movie is not favourited", () => {
  const store = createMockStore([]);
  renderWithStore(<FavouriteActions movie={mockMovie} />, store);

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("🤍");
  expect(button).toHaveAttribute("title", "Add to favourites");
});

test("renders remove from favourites button when movie is favourited", () => {
  const store = createMockStore([mockMovie]);
  renderWithStore(<FavouriteActions movie={mockMovie} />, store);

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("❤️");
  expect(button).toHaveAttribute("title", "Remove from favourites");
});

test("shows label when showLabel prop is true", () => {
  const store = createMockStore([]);
  renderWithStore(
    <FavouriteActions movie={mockMovie} showLabel={true} />,
    store
  );

  expect(screen.getByText("Add to Favourites")).toBeInTheDocument();
});

test("renders button variant correctly", () => {
  const store = createMockStore([]);
  renderWithStore(
    <FavouriteActions movie={mockMovie} variant="button" />,
    store
  );

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("🤍");
  expect(button).toHaveClass("add-favourite");
});

test("applies correct size class", () => {
  const store = createMockStore([]);
  renderWithStore(<FavouriteActions movie={mockMovie} size="large" />, store);

  const button = screen.getByRole("button");
  expect(button).toHaveClass("favourite-btn-large");
});
