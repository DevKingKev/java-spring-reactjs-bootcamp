import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import History from "../History";
import movieReducer from "../../store/slices/movieSlice";
import uiReducer from "../../store/slices/uiSlice";

const mockSearchHistory = ["Batman", "Superman", "Spider-Man"];

const createMockStore = (searchHistory: string[] = []) => {
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

test("renders history page header", () => {
  const store = createMockStore();
  renderWithProviders(<History />, store);

  expect(screen.getByText("Search History")).toBeInTheDocument();
  expect(screen.getByText("Your recent movie searches")).toBeInTheDocument();
});

test("shows empty state when no search history", () => {
  const store = createMockStore([]);
  renderWithProviders(<History />, store);

  expect(screen.getByText("📜 No search history yet")).toBeInTheDocument();
  expect(
    screen.getByText("Start searching for movies to build your search history!")
  ).toBeInTheDocument();
  expect(screen.getByText("🔍 Start Searching")).toBeInTheDocument();
});

test("displays search count with plural form", () => {
  const store = createMockStore(mockSearchHistory);
  renderWithProviders(<History />, store);

  expect(screen.getByText("3 searches")).toBeInTheDocument();
});

test("displays search count with singular form", () => {
  const store = createMockStore(["Batman"]);
  renderWithProviders(<History />, store);

  expect(screen.getByText("1 search")).toBeInTheDocument();
});

test("renders search history items", () => {
  const store = createMockStore(mockSearchHistory);
  renderWithProviders(<History />, store);

  expect(screen.getByText("Batman")).toBeInTheDocument();
  expect(screen.getByText("Superman")).toBeInTheDocument();
  expect(screen.getByText("Spider-Man")).toBeInTheDocument();
});

test("renders search again buttons for each history item", () => {
  const store = createMockStore(mockSearchHistory);
  renderWithProviders(<History />, store);

  const searchAgainButtons = screen.getAllByText("🔍 Search Again");
  expect(searchAgainButtons).toHaveLength(3);
});

test("displays correct search index numbers", () => {
  const store = createMockStore(mockSearchHistory);
  renderWithProviders(<History />, store);

  expect(screen.getByText("#1")).toBeInTheDocument();
  expect(screen.getByText("#2")).toBeInTheDocument();
  expect(screen.getByText("#3")).toBeInTheDocument();
});
