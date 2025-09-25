import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Favourites from "../Favourites";
import movieReducer from "../../store/slices/movieSlice";
import uiReducer from "../../store/slices/uiSlice";

const mockMovies = [
  {
    Title: "Favourite Movie 1",
    Year: "2023",
    imdbID: "tt1111111",
    Type: "movie" as const,
    Poster: "https://example.com/poster1.jpg",
  },
  {
    Title: "Favourite Movie 2",
    Year: "2022",
    imdbID: "tt2222222",
    Type: "movie" as const,
    Poster: "https://example.com/poster2.jpg",
  },
];

const createMockStore = (favouriteMovies: any[] = [], isLoading = false) => {
  return configureStore({
    reducer: {
      movies: movieReducer,
      ui: uiReducer,
    },
    preloadedState: {
      movies: {
        searchResults: [],
        favouriteMovies,
        selectedMovie: null,
        fetchedMovies: {},
        searchQuery: "",
        totalResults: "0",
        isLoading,
        isLoadingDetail: false,
        error: null,
        searchHistory: [],
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

test("renders favourites page header", () => {
  const store = createMockStore();
  renderWithProviders(<Favourites />, store);

  expect(screen.getByText("Your Favourite Movies")).toBeInTheDocument();
  expect(
    screen.getByText("Movies you've added to your favorites collection")
  ).toBeInTheDocument();
});

test("shows loading spinner when loading", () => {
  const store = createMockStore([], true);
  renderWithProviders(<Favourites />, store);

  const loadingElement = document.querySelector(".loading-spinner");
  expect(loadingElement).toBeInTheDocument();
});

test("renders empty message when no favourite movies", () => {
  const store = createMockStore([]);
  renderWithProviders(<Favourites />, store);

  expect(screen.getByText("No favourite movies yet")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Start adding movies to your favourites by clicking the heart icon on any movie card!"
    )
  ).toBeInTheDocument();
});

test("renders favourite movies when available", () => {
  const store = createMockStore(mockMovies);
  renderWithProviders(<Favourites />, store);

  expect(screen.getByText("Favourite Movie 1")).toBeInTheDocument();
  expect(screen.getByText("Favourite Movie 2")).toBeInTheDocument();
});
