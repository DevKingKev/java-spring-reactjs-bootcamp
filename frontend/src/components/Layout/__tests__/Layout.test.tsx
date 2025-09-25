import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Layout from "../Layout";
import movieReducer from "../../../store/slices/movieSlice";
import uiReducer from "../../../store/slices/uiSlice";

const createMockStore = (uiState = {}) => {
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
        theme: "light",
        sidebarOpen: false,
        currentPage: 1,
        itemsPerPage: 10,
        showSearchHistory: false,
        ...uiState,
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

test("renders header with logo and navigation", () => {
  const store = createMockStore();
  renderWithProviders(<Layout />, store);

  expect(screen.getByText("🎬 Movie Search")).toBeInTheDocument();
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Search")).toBeInTheDocument();
  expect(screen.getByText("Favourites")).toBeInTheDocument();
  expect(screen.getByText("History")).toBeInTheDocument();
});

test("renders light theme toggle button", () => {
  const store = createMockStore({ theme: "light" });
  renderWithProviders(<Layout />, store);

  const themeButton = screen.getByText("🌙");
  expect(themeButton).toBeInTheDocument();
});

test("renders dark theme toggle button", () => {
  const store = createMockStore({ theme: "dark" });
  renderWithProviders(<Layout />, store);

  const themeButton = screen.getByText("☀️");
  expect(themeButton).toBeInTheDocument();
});

test("renders sidebar when sidebarOpen is true", () => {
  const store = createMockStore({ sidebarOpen: true });
  renderWithProviders(<Layout />, store);

  expect(screen.getByText("🏠 Home")).toBeInTheDocument();
  expect(screen.getByText("🔍 Search")).toBeInTheDocument();
  expect(screen.getByText("❤️ Favorites")).toBeInTheDocument();
  expect(screen.getByText("📋 History")).toBeInTheDocument();
});

test("does not render sidebar when sidebarOpen is false", () => {
  const store = createMockStore({ sidebarOpen: false });
  renderWithProviders(<Layout />, store);

  expect(screen.queryByText("🏠 Home")).not.toBeInTheDocument();
  expect(screen.queryByText("🔍 Search")).not.toBeInTheDocument();
  expect(screen.queryByText("❤️ Favorites")).not.toBeInTheDocument();
  expect(screen.queryByText("📋 History")).not.toBeInTheDocument();
});

test("applies theme class to app container", () => {
  const store = createMockStore({ theme: "dark" });
  const { container } = renderWithProviders(<Layout />, store);

  expect(container.firstChild).toHaveClass("app", "dark");
});
