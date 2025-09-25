import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import SearchForm from "../SearchForm";
import movieReducer from "../../store/slices/movieSlice";
import uiReducer from "../../store/slices/uiSlice";

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

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createMockStore();
  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

// Mock the navigation and search actions
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams()],
}));

describe("SearchForm", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders search input with correct placeholder", () => {
    render(
      <TestWrapper>
        <SearchForm placeholder="Search for movies..." />
      </TestWrapper>
    );

    const searchInput = screen.getByPlaceholderText("Search for movies...");
    expect(searchInput).toBeInTheDocument();
  });

  test("renders search button when showButton is true", () => {
    render(
      <TestWrapper>
        <SearchForm showButton={true} />
      </TestWrapper>
    );

    const searchButton = screen.getByRole("button", { name: /🔍/ });
    expect(searchButton).toBeInTheDocument();
  });

  test("does not render search button when showButton is false", () => {
    render(
      <TestWrapper>
        <SearchForm showButton={false} />
      </TestWrapper>
    );

    const searchButton = screen.queryByRole("button");
    expect(searchButton).not.toBeInTheDocument();
  });

  test("updates input value when user types", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SearchForm />
      </TestWrapper>
    );

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "Batman");

    expect(searchInput).toHaveValue("Batman");
  });

  test("calls onSearch callback when provided", async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SearchForm onSearch={mockOnSearch} redirectToSearch={false} />
      </TestWrapper>
    );

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "Superman");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("Superman");
    });
  });

  test("navigates to search page when redirectToSearch is true", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SearchForm redirectToSearch={true} />
      </TestWrapper>
    );

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "Spiderman");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/search?q=Spiderman");
    });
  });

  test("does not submit empty search query", async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SearchForm onSearch={mockOnSearch} />
      </TestWrapper>
    );

    await user.keyboard("{Enter}");

    expect(mockOnSearch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("trims whitespace from search query", async () => {
    const mockOnSearch = jest.fn();
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <SearchForm onSearch={mockOnSearch} redirectToSearch={false} />
      </TestWrapper>
    );

    const searchInput = screen.getByRole("textbox");
    await user.type(searchInput, "  Batman  ");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith("Batman");
    });
  });
});
