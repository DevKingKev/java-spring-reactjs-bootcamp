import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import MovieDetails from "../MovieDetails";
import movieSlice from "../../store/slices/movieSlice";
import uiSlice from "../../store/slices/uiSlice";
import { MovieDetail } from "../../types/movie.types";

const createMockStore = () => {
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

const mockMovieDetail: MovieDetail = {
  imdbID: "tt1234567",
  Title: "Test Movie",
  Year: "2023",
  Type: "movie",
  Poster: "https://example.com/poster.jpg",
  Rated: "PG-13",
  Released: "01 Jan 2023",
  Runtime: "120 min",
  Genre: "Action, Adventure, Drama",
  Director: "John Director",
  Writer: "Jane Writer",
  Actors: "Actor One, Actor Two, Actor Three",
  Plot: "This is a test movie plot that describes the storyline.",
  Language: "English",
  Country: "USA",
  Awards: "Won 1 Oscar",
  Metascore: "75",
  imdbRating: "7.5",
  imdbVotes: "100,000",
  BoxOffice: "$100,000,000",
  Production: "Test Studios",
  Website: "https://testmovie.com",
  Response: "True",
  Ratings: [
    { Source: "Internet Movie Database", Value: "7.5/10" },
    { Source: "Rotten Tomatoes", Value: "75%" },
  ],
  DVD: "01 Jun 2023",
};

describe("MovieDetails", () => {
  it("renders loading state when isLoading is true", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={true} />,
      store
    );

    // When loading, it should not render the movie content
    expect(screen.queryByText("Test Movie")).not.toBeInTheDocument();
    expect(screen.queryByText("Plot")).not.toBeInTheDocument();
  });

  it("renders movie details when not loading", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("PG-13")).toBeInTheDocument();
    expect(screen.getByText("120 min")).toBeInTheDocument();
  });

  it("displays movie poster when available", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    const posterImg = screen.getByAltText("Test Movie");
    expect(posterImg).toBeInTheDocument();
    expect(posterImg).toHaveAttribute("src", "https://example.com/poster.jpg");
    expect(posterImg).toHaveClass("movie-poster-large");
  });

  it("displays placeholder when poster is not available", () => {
    const store = createMockStore();
    const movieWithoutPoster = { ...mockMovieDetail, Poster: "N/A" };
    renderWithProviders(
      <MovieDetails movie={movieWithoutPoster} isLoading={false} />,
      store
    );

    expect(screen.getByText("🎬")).toBeInTheDocument();
  });

  it("displays plot information", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("Plot")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is a test movie plot that describes the storyline."
      )
    ).toBeInTheDocument();
  });

  it("displays genre tags", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("Genre")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Adventure")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
  });

  it("displays director and cast information", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("Director")).toBeInTheDocument();
    expect(screen.getByText("John Director")).toBeInTheDocument();
    expect(screen.getByText("Cast")).toBeInTheDocument();
    expect(
      screen.getByText("Actor One, Actor Two, Actor Three")
    ).toBeInTheDocument();
  });

  it("displays writer when available", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("Writer")).toBeInTheDocument();
    expect(screen.getByText("Jane Writer")).toBeInTheDocument();
  });

  it("hides writer when not available", () => {
    const store = createMockStore();
    const movieWithoutWriter = { ...mockMovieDetail, Writer: "N/A" };
    renderWithProviders(
      <MovieDetails movie={movieWithoutWriter} isLoading={false} />,
      store
    );

    expect(screen.queryByText("Writer")).not.toBeInTheDocument();
  });

  it("displays IMDB rating when available", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("IMDb Rating")).toBeInTheDocument();
    expect(screen.getByText("⭐ 7.5")).toBeInTheDocument();
    expect(screen.getByText("(100,000 votes)")).toBeInTheDocument();
  });

  it("hides IMDB rating when not available", () => {
    const store = createMockStore();
    const movieWithoutRating = { ...mockMovieDetail, imdbRating: "N/A" };
    renderWithProviders(
      <MovieDetails movie={movieWithoutRating} isLoading={false} />,
      store
    );

    expect(screen.queryByText("IMDb Rating")).not.toBeInTheDocument();
  });

  it("displays box office when available", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("Box Office")).toBeInTheDocument();
    expect(screen.getByText("$100,000,000")).toBeInTheDocument();
  });

  it("hides box office when not available", () => {
    const store = createMockStore();
    const movieWithoutBoxOffice = { ...mockMovieDetail, BoxOffice: "N/A" };
    renderWithProviders(
      <MovieDetails movie={movieWithoutBoxOffice} isLoading={false} />,
      store
    );

    expect(screen.queryByText("Box Office")).not.toBeInTheDocument();
  });

  it("displays release date when available", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("Release Date")).toBeInTheDocument();
    expect(screen.getByText("01 Jan 2023")).toBeInTheDocument();
  });

  it("displays language and country information", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("includes FavouriteActions component", () => {
    const store = createMockStore();
    renderWithProviders(
      <MovieDetails movie={mockMovieDetail} isLoading={false} />,
      store
    );

    // Check if the favourite button is rendered (FavouriteActions component)
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
