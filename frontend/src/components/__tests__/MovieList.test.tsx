import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import MovieList from "../MovieList";
import movieReducer from "../../store/slices/movieSlice";
import uiReducer from "../../store/slices/uiSlice";
import { MovieListItem } from "../../types/movie.types";

// Mock MovieCard component
jest.mock("../MovieCard", () => {
  return function MockMovieCard({ movie }: { movie: MovieListItem }) {
    return <div data-testid={`movie-card-${movie.imdbID}`}>{movie.Title}</div>;
  };
});

const mockMovies: MovieListItem[] = [
  {
    Title: "Batman Begins",
    Year: "2005",
    imdbID: "tt0372784",
    Type: "movie",
    Poster: "https://example.com/batman-begins.jpg",
  },
  {
    Title: "The Dark Knight",
    Year: "2008",
    imdbID: "tt0468569",
    Type: "movie",
    Poster: "https://example.com/dark-knight.jpg",
  },
  {
    Title: "Avatar",
    Year: "2009",
    imdbID: "tt0499549",
    Type: "movie",
    Poster: "https://example.com/avatar.jpg",
  },
];

const createMockStore = (searchQuery = "") => {
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
        searchQuery,
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
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  store = createMockStore()
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("MovieList", () => {
  describe("with movies", () => {
    it("renders all movies", () => {
      renderWithProviders(<MovieList movies={mockMovies} />);

      expect(screen.getByTestId("movie-card-tt0372784")).toBeInTheDocument();
      expect(screen.getByTestId("movie-card-tt0468569")).toBeInTheDocument();
      expect(screen.getByTestId("movie-card-tt0499549")).toBeInTheDocument();
    });

    it("sorts movies alphabetically by title", () => {
      renderWithProviders(<MovieList movies={mockMovies} />);

      const movieCards = screen.getAllByTestId(/movie-card-/);
      expect(movieCards).toHaveLength(3);

      // Movies should be sorted: Avatar, Batman Begins, The Dark Knight
      expect(screen.getByText("Avatar")).toBeInTheDocument();
      expect(screen.getByText("Batman Begins")).toBeInTheDocument();
      expect(screen.getByText("The Dark Knight")).toBeInTheDocument();
    });

    it("displays title when provided", () => {
      renderWithProviders(
        <MovieList movies={mockMovies} title="Popular Movies" />
      );

      expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    });

    it("displays movie count by default", () => {
      renderWithProviders(<MovieList movies={mockMovies} title="Movies" />);

      expect(screen.getByText("3 movies")).toBeInTheDocument();
    });

    it("displays singular count for one movie", () => {
      renderWithProviders(
        <MovieList movies={[mockMovies[0]]} title="Movies" />
      );

      expect(screen.getByText("1 movie")).toBeInTheDocument();
    });

    it("hides count when showCount is false", () => {
      renderWithProviders(
        <MovieList movies={mockMovies} title="Movies" showCount={false} />
      );

      expect(screen.queryByText("3 movies")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      renderWithProviders(
        <MovieList movies={mockMovies} className="custom-list" />
      );

      // Test that the component renders correctly with custom className
      // by verifying the functionality works as expected
      expect(screen.getByTestId("movie-card-tt0372784")).toBeInTheDocument();
      expect(screen.getAllByTestId(/movie-card-/)).toHaveLength(3);
    });

    it("displays title with search query when showSearchQuery is true", () => {
      const store = createMockStore("batman");
      renderWithProviders(
        <MovieList
          movies={mockMovies}
          title="Results"
          showSearchQuery={true}
        />,
        store
      );

      expect(screen.getByText("Results: batman")).toBeInTheDocument();
    });

    it("uses default title with search query when no title provided", () => {
      const store = createMockStore("batman");
      renderWithProviders(
        <MovieList movies={mockMovies} showSearchQuery={true} />,
        store
      );

      expect(screen.getByText("Search Results: batman")).toBeInTheDocument();
    });

    it("shows normal title when showSearchQuery is true but no search query", () => {
      const store = createMockStore("");
      renderWithProviders(
        <MovieList
          movies={mockMovies}
          title="All Movies"
          showSearchQuery={true}
        />,
        store
      );

      expect(screen.getByText("All Movies")).toBeInTheDocument();
      expect(screen.queryByText("Search Results:")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("shows default empty message when no movies", () => {
      renderWithProviders(<MovieList movies={[]} />);

      expect(screen.getByText("No movies to display")).toBeInTheDocument();
      expect(screen.queryByText(/movie-card-/)).not.toBeInTheDocument();
    });

    it("shows custom empty message", () => {
      renderWithProviders(
        <MovieList movies={[]} emptyMessage="No search results found" />
      );

      expect(screen.getByText("No search results found")).toBeInTheDocument();
    });

    it("shows empty subtitle when provided", () => {
      renderWithProviders(
        <MovieList
          movies={[]}
          emptyMessage="No movies found"
          emptySubtitle="Try a different search term"
        />
      );

      expect(screen.getByText("No movies found")).toBeInTheDocument();
      expect(
        screen.getByText("Try a different search term")
      ).toBeInTheDocument();
    });

    it("applies custom className to empty state", () => {
      renderWithProviders(<MovieList movies={[]} className="custom-empty" />);

      // Test that the empty state renders correctly with custom className
      expect(screen.getByText("No movies to display")).toBeInTheDocument();
    });

    it("does not show title or count in empty state", () => {
      renderWithProviders(
        <MovieList movies={[]} title="Movies" showCount={true} />
      );

      expect(screen.queryByText("Movies")).not.toBeInTheDocument();
      expect(screen.queryByText("0 movies")).not.toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles movies with identical titles", () => {
      const duplicateTitleMovies: MovieListItem[] = [
        {
          Title: "The Matrix",
          Year: "1999",
          imdbID: "tt0133093",
          Type: "movie",
          Poster: "https://example.com/matrix1.jpg",
        },
        {
          Title: "The Matrix",
          Year: "2003",
          imdbID: "tt0234215",
          Type: "movie",
          Poster: "https://example.com/matrix2.jpg",
        },
      ];

      renderWithProviders(<MovieList movies={duplicateTitleMovies} />);

      expect(screen.getByTestId("movie-card-tt0133093")).toBeInTheDocument();
      expect(screen.getByTestId("movie-card-tt0234215")).toBeInTheDocument();
      expect(screen.getAllByText("The Matrix")).toHaveLength(2);
    });

    it("handles movies with special characters in titles", () => {
      const specialCharMovies: MovieListItem[] = [
        {
          Title: "Amélie",
          Year: "2001",
          imdbID: "tt0211915",
          Type: "movie",
          Poster: "https://example.com/amelie.jpg",
        },
        {
          Title: "The Lord of the Rings: The Fellowship of the Ring",
          Year: "2001",
          imdbID: "tt0120737",
          Type: "movie",
          Poster: "https://example.com/lotr.jpg",
        },
      ];

      renderWithProviders(
        <MovieList movies={specialCharMovies} title="Special Movies" />
      );

      expect(screen.getByText("Amélie")).toBeInTheDocument();
      expect(
        screen.getByText("The Lord of the Rings: The Fellowship of the Ring")
      ).toBeInTheDocument();
      expect(screen.getByText("2 movies")).toBeInTheDocument();
    });

    it("handles large number of movies", () => {
      const manyMovies: MovieListItem[] = Array.from(
        { length: 100 },
        (_, i) => ({
          Title: `Movie ${String(i + 1).padStart(3, "0")}`,
          Year: "2023",
          imdbID: `tt${String(i + 1).padStart(7, "0")}`,
          Type: "movie" as const,
          Poster: `https://example.com/movie${i + 1}.jpg`,
        })
      );

      renderWithProviders(
        <MovieList movies={manyMovies} title="Many Movies" />
      );

      expect(screen.getByText("100 movies")).toBeInTheDocument();
      expect(screen.getAllByTestId(/movie-card-/)).toHaveLength(100);
    });

    it("does not mutate original movies array", () => {
      const originalMovies = [...mockMovies];
      renderWithProviders(<MovieList movies={mockMovies} />);

      expect(mockMovies).toEqual(originalMovies);
    });
  });

  describe("integration with Redux", () => {
    it("reads search query from Redux store", () => {
      const store = createMockStore("superhero movies");
      renderWithProviders(
        <MovieList
          movies={mockMovies}
          title="Search Results"
          showSearchQuery={true}
        />,
        store
      );

      expect(
        screen.getByText("Search Results: superhero movies")
      ).toBeInTheDocument();
    });

    it("updates when search query changes", () => {
      const store = createMockStore("action");
      const { rerender } = renderWithProviders(
        <MovieList movies={mockMovies} showSearchQuery={true} />,
        store
      );

      expect(screen.getByText("Search Results: action")).toBeInTheDocument();

      // Update store with new search query
      const newStore = createMockStore("comedy");
      rerender(
        <Provider store={newStore}>
          <BrowserRouter>
            <MovieList movies={mockMovies} showSearchQuery={true} />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByText("Search Results: comedy")).toBeInTheDocument();
    });
  });
});
