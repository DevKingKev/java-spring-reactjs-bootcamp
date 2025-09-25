import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MovieCard from "../MovieCard";
import movieReducer from "../../store/slices/movieSlice";

const mockStore = configureStore({
  reducer: {
    movies: movieReducer,
  },
  preloadedState: {
    movies: {
      searchResults: [],
      favouriteMovies: [],
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

const mockMovie = {
  Title: "Test Movie",
  Year: "2023",
  imdbID: "tt1234567",
  Type: "movie" as const,
  Poster: "https://example.com/poster.jpg",
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

test("renders movie card with title and year", () => {
  renderWithProviders(<MovieCard movie={mockMovie} />);

  expect(screen.getByText("Test Movie")).toBeInTheDocument();
  expect(screen.getByText("2023")).toBeInTheDocument();
});

test("renders movie poster when available", () => {
  renderWithProviders(<MovieCard movie={mockMovie} />);

  const poster = screen.getByRole("img");
  expect(poster).toHaveAttribute("src", "https://example.com/poster.jpg");
  expect(poster).toHaveAttribute("alt", "Test Movie");
});

test("renders placeholder when poster is not available", () => {
  const movieWithoutPoster = { ...mockMovie, Poster: "N/A" };
  renderWithProviders(<MovieCard movie={movieWithoutPoster} />);

  expect(screen.getByText("🎬")).toBeInTheDocument();
});

test("creates correct link to movie details", () => {
  renderWithProviders(<MovieCard movie={mockMovie} />);

  const link = screen.getByRole("link");
  expect(link).toHaveAttribute("href", "/movie/tt1234567");
});
