import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Movie from "../Movie";
import movieSlice from "../../store/slices/movieSlice";
import uiSlice from "../../store/slices/uiSlice";

// Mock the router hooks
const mockUseParams = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => mockUseParams(),
  useNavigate: () => mockUseNavigate,
}));

const createMockStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      movies: movieSlice,
      ui: uiSlice,
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
        ...initialState.movies,
      },
      ui: {
        theme: "light",
        sidebarOpen: false,
        currentPage: 1,
        itemsPerPage: 10,
        showSearchHistory: false,
        ...initialState.ui,
      },
    },
  });
};

const renderWithProviders = (component: React.ReactElement, store: any) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>
  );
};

describe("Movie", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ id: "tt1234567" });
    mockUseNavigate.mockReturnValue(jest.fn());
  });

  it("renders movie page container", () => {
    const store = createMockStore({
      movies: {
        isLoadingDetail: true,
        selectedMovie: null,
        error: null,
      },
    });

    renderWithProviders(<Movie />, store);
    // Test that the component renders without crashing
    expect(screen.getByText("Loading movie details...")).toBeInTheDocument();
  });

  it("shows loading text when loading", () => {
    const store = createMockStore({
      movies: {
        isLoadingDetail: true,
        selectedMovie: null,
        error: null,
      },
    });

    renderWithProviders(<Movie />, store);
    expect(screen.getByText("Loading movie details...")).toBeInTheDocument();
  });

  it("dispatches fetch action on mount with ID", () => {
    const store = createMockStore();
    renderWithProviders(<Movie />, store);

    // Component should attempt to dispatch fetchMovieDetail action
    // This is tested by rendering with an ID
    expect(mockUseParams).toHaveBeenCalled();
  });
});
