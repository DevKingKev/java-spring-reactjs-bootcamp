import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Search from "../Search";
import movieReducer from "../../store/slices/movieSlice";
import uiReducer from "../../store/slices/uiSlice";

const createMockStore = (options: any = {}) => {
  const { searchResults = [], isLoading = false, error = null } = options;

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
  return render(<Provider store={store}>{component}</Provider>);
};

test("renders search form", () => {
  const store = createMockStore();
  renderWithProviders(
    <MemoryRouter initialEntries={["/search"]}>
      <Search />
    </MemoryRouter>,
    store
  );

  expect(screen.getByRole("textbox")).toBeInTheDocument();
});

test("shows loading spinner when loading", () => {
  const store = createMockStore({ isLoading: true });
  renderWithProviders(
    <MemoryRouter initialEntries={["/search"]}>
      <Search />
    </MemoryRouter>,
    store
  );

  const loadingElement = document.querySelector(".loading-spinner");
  expect(loadingElement).toBeInTheDocument();
});

test("shows error message when there is an error", () => {
  const store = createMockStore({ error: "Search failed" });
  renderWithProviders(
    <MemoryRouter initialEntries={["/search"]}>
      <Search />
    </MemoryRouter>,
    store
  );

  expect(screen.getByText("❌ Search failed")).toBeInTheDocument();
});
