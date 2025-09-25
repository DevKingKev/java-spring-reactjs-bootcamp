import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Home from "../Home";
import movieReducer from "../../store/slices/movieSlice";
import uiReducer from "../../store/slices/uiSlice";

const mockMovies = [
  {
    Title: "Test Movie 1",
    Year: "2023",
    imdbID: "tt1111111",
    Type: "movie" as const,
    Poster: "https://example.com/poster1.jpg",
  },
  {
    Title: "Test Movie 2",
    Year: "2022",
    imdbID: "tt2222222",
    Type: "movie" as const,
    Poster: "https://example.com/poster2.jpg",
  },
];

const mockSearchHistory = ["Batman", "Superman", "Spider-Man"];

const createMockStore = (options: any = {}) => {
  const {
    searchResults = [],
    searchHistory = [],
    isLoading = false,
    error = null,
  } = options;

  return configureStore({
    reducer: {
      movies: movieReducer,
      ui: uiReducer,
    },
    preloadedState: {
      movies: {
        searchResults,
        favouriteMovies: [],
        selectedMovie: null,
        fetchedMovies: {},
        searchQuery: "",
        totalResults: "0",
        isLoading,
        isLoadingDetail: false,
        error,
        searchHistory,
      },
      ui: {
        theme: "light",
        sidebarOpen: false,
        currentPage: 1,
        itemsPerPage: 10,
        showSearchHistory: false,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, store: any) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

test("renders home page hero section", () => {
  const store = createMockStore();
  renderWithProviders(<Home />, store);

  expect(screen.getByText("Welcome to Movie Search")).toBeInTheDocument();
  expect(
    screen.getByText("Discover and explore movies, series, and more!")
  ).toBeInTheDocument();
  expect(
    screen.getByPlaceholderText("What movie are you looking for?")
  ).toBeInTheDocument();
});

test("shows loading spinner when loading", () => {
  const store = createMockStore({ isLoading: true });
  renderWithProviders(<Home />, store);

  const loadingElement = document.querySelector(".loading-spinner");
  expect(loadingElement).toBeInTheDocument();
});

test("shows search results when available", () => {
  const store = createMockStore({ searchResults: mockMovies });
  renderWithProviders(<Home />, store);

  expect(screen.getByText("Search Results")).toBeInTheDocument();
  expect(screen.getByText("Test Movie 1")).toBeInTheDocument();
  expect(screen.getByText("Test Movie 2")).toBeInTheDocument();
});

test("shows error message when there is an error", () => {
  const store = createMockStore({ error: "Something went wrong" });
  renderWithProviders(<Home />, store);

  expect(screen.getByText("❌ Something went wrong")).toBeInTheDocument();
});

test("shows recent searches when search history exists", () => {
  const store = createMockStore({ searchHistory: mockSearchHistory });
  renderWithProviders(<Home />, store);

  expect(screen.getByText("Recent Searches")).toBeInTheDocument();
  expect(screen.getByText("Batman")).toBeInTheDocument();
  expect(screen.getByText("Superman")).toBeInTheDocument();
  expect(screen.getByText("Spider-Man")).toBeInTheDocument();
});

test("does not show recent searches when search history is empty", () => {
  const store = createMockStore({ searchHistory: [] });
  renderWithProviders(<Home />, store);

  expect(screen.queryByText("Recent Searches")).not.toBeInTheDocument();
});

test("limits recent searches to 10 items", () => {
  const longSearchHistory = Array.from(
    { length: 15 },
    (_, i) => `Movie ${i + 1}`
  );
  const store = createMockStore({ searchHistory: longSearchHistory });
  renderWithProviders(<Home />, store);

  expect(screen.getByText("Movie 1")).toBeInTheDocument();
  expect(screen.getByText("Movie 10")).toBeInTheDocument();
  expect(screen.queryByText("Movie 11")).not.toBeInTheDocument();
});
