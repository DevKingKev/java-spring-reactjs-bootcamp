import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import SearchForm from "../SearchForm";
import movieReducer from "../../store/slices/movieSlice";
import uiReducer from "../../store/slices/uiSlice";

const createMockStore = (isLoading = false) => {
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

test("renders search input with default placeholder", () => {
  const store = createMockStore();
  renderWithProviders(<SearchForm />, store);

  const input = screen.getByPlaceholderText(
    "Search for movies, series, episodes..."
  );
  expect(input).toBeInTheDocument();
});

test("renders search input with custom placeholder", () => {
  const store = createMockStore();
  renderWithProviders(<SearchForm placeholder="Custom placeholder" />, store);

  const input = screen.getByPlaceholderText("Custom placeholder");
  expect(input).toBeInTheDocument();
});

test("renders search button by default", () => {
  const store = createMockStore();
  renderWithProviders(<SearchForm />, store);

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("🔍");
});

test("hides search button when showButton is false", () => {
  const store = createMockStore();
  renderWithProviders(<SearchForm showButton={false} />, store);

  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("shows loading state on button when isLoading is true", () => {
  const store = createMockStore(true);
  renderWithProviders(<SearchForm />, store);

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("🔄");
  expect(button).toBeDisabled();
});

test("updates input value when typing", () => {
  const store = createMockStore();
  renderWithProviders(<SearchForm />, store);

  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "Batman" } });

  expect(input).toHaveValue("Batman");
});

test("calls onSearch handler when provided", () => {
  const mockOnSearch = jest.fn();
  const store = createMockStore();
  renderWithProviders(
    <SearchForm onSearch={mockOnSearch} redirectToSearch={false} />,
    store
  );

  const input = screen.getByRole("textbox");

  fireEvent.change(input, { target: { value: "Batman" } });
  fireEvent.submit(input);

  expect(mockOnSearch).toHaveBeenCalledWith("Batman");
});

test("renders with custom className and maintains functionality", () => {
  const mockOnSearch = jest.fn();
  const store = createMockStore();
  renderWithProviders(
    <SearchForm
      className="custom-class"
      onSearch={mockOnSearch}
      redirectToSearch={false}
    />,
    store
  );

  // Test that the component with custom className still functions correctly
  const input = screen.getByRole("textbox");
  expect(input).toBeInTheDocument();

  // Test functionality to ensure the custom className doesn't break anything
  fireEvent.change(input, { target: { value: "test query" } });
  fireEvent.submit(input);

  expect(mockOnSearch).toHaveBeenCalledWith("test query");
});
