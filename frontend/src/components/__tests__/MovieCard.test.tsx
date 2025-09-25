import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import MovieCard from "../MovieCard";
import movieReducer from "../../store/slices/movieSlice";
import uiReducer from "../../store/slices/uiSlice";
import { MovieListItem } from "../../types/movie.types";

// Mock store for testing
const createMockStore = () => {
  return configureStore({
    reducer: {
      movies: movieReducer,
      ui: uiReducer,
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
      ui: {
        theme: "light" as const,
        sidebarOpen: false,
        currentPage: 1,
        itemsPerPage: 10,
        showSearchHistory: false,
      },
    },
  });
};

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

const mockMovie: MovieListItem = {
  imdbID: "tt1234567",
  Title: "Test Movie",
  Year: "2023",
  Type: "movie",
  Poster: "https://example.com/poster.jpg",
};

describe("MovieCard", () => {
  test("renders movie title and year", () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("movie")).toBeInTheDocument();
  });

  test("renders movie poster with correct alt text", () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    const poster = screen.getByAltText("Test Movie");
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute("src", "https://example.com/poster.jpg");
  });

  test("renders placeholder when poster is not available", () => {
    const movieWithoutPoster = { ...mockMovie, Poster: "N/A" };

    render(
      <TestWrapper>
        <MovieCard movie={movieWithoutPoster} />
      </TestWrapper>
    );

    expect(screen.getByText("🎬")).toBeInTheDocument();
  });

  test("creates correct link to movie details page", () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    const movieLink = screen.getByRole("link");
    expect(movieLink).toHaveAttribute("href", "/movie/tt1234567");
  });

  test("renders favourite actions component", () => {
    render(
      <TestWrapper>
        <MovieCard movie={mockMovie} />
      </TestWrapper>
    );

    // Check if favourite button is rendered (heart icon)
    expect(screen.getByText("🤍")).toBeInTheDocument();
  });
});
