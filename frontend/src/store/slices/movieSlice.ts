import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MovieListItem, MovieDetail, MovieSearchResponse } from '../../types/movie.types';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const FAVOURITE_MOVIES_KEY = 'favouriteMovies';
const SEARCH_HISTORY_KEY = 'searchHistory';
const FETCHED_MOVIES_KEY = 'fetchedMovies';

// Helper functions for localStorage
const saveFavouritesToStorage = ( favourites: MovieListItem[] ) => {
    try {
        localStorage.setItem( FAVOURITE_MOVIES_KEY, JSON.stringify( favourites ) );
    } catch ( error ) {
        console.error( 'Failed to save favourites to localStorage:', error );
    }
};

const loadFavouritesFromStorage = (): MovieListItem[] => {
    try {
        const stored = localStorage.getItem( FAVOURITE_MOVIES_KEY );
        if ( stored ) {
            return JSON.parse( stored ).sort( ( a: MovieListItem, b: MovieListItem ) =>
                a.Year.localeCompare( b.Year )
            );
        }
    } catch ( error ) {
        console.error( 'Failed to load favourites from localStorage:', error );
    }
    // Initialize empty array in localStorage if none exists
    saveFavouritesToStorage( [] );
    return [];
};

const saveSearchHistoryToStorage = ( history: string[] ) => {
    try {
        localStorage.setItem( SEARCH_HISTORY_KEY, JSON.stringify( history ) );
    } catch ( error ) {
        console.error( 'Failed to save search history to localStorage:', error );
    }
};

const loadSearchHistoryFromStorage = (): string[] => {
    try {
        const stored = localStorage.getItem( SEARCH_HISTORY_KEY );
        if ( stored ) {
            return JSON.parse( stored );
        }
    } catch ( error ) {
        console.error( 'Failed to load search history from localStorage:', error );
    }
    // Initialize empty array in localStorage if none exists
    saveSearchHistoryToStorage( [] );
    return [];
};

const saveFetchedMoviesToStorage = ( fetchedMovies: { [key: string]: MovieDetail; } ) => {
    try {
        localStorage.setItem( FETCHED_MOVIES_KEY, JSON.stringify( fetchedMovies ) );
    } catch ( error ) {
        console.error( 'Failed to save fetched movies to localStorage:', error );
    }
};

const loadFetchedMoviesFromStorage = (): { [key: string]: MovieDetail; } => {
    try {
        const stored = localStorage.getItem( FETCHED_MOVIES_KEY );
        if ( stored ) {
            return JSON.parse( stored );
        }
    } catch ( error ) {
        console.error( 'Failed to load fetched movies from localStorage:', error );
    }
    // Initialize empty object in localStorage if none exists
    saveFetchedMoviesToStorage( {} );
    return {};
};

// Async thunks for API calls
export const searchMovies = createAsyncThunk(
    'movies/searchMovies',
    async ( searchQuery: string, { rejectWithValue } ) => {
        try {
            const response = await axios.get<MovieSearchResponse>(
                `${API_BASE_URL}/movies/search?q=${encodeURIComponent( searchQuery )}`
            );
            return response.data;
        } catch ( error: any ) {
            return rejectWithValue( error.response?.data?.message || 'Failed to search movies' );
        }
    }
);

export const fetchMovieDetail = createAsyncThunk(
    'movies/fetchMovieDetail',
    async ( imdbID: string, { getState, rejectWithValue } ) => {
        try {
            const state = getState() as { movies: MovieState; };
            const cachedMovie = state.movies.fetchedMovies[imdbID];

            // Return cached movie if it exists
            if ( cachedMovie ) {
                return cachedMovie;
            }

            // Fetch from API if not cached
            const response = await axios.get<MovieDetail>( `${API_BASE_URL}/movies/${imdbID}` );
            return response.data;
        } catch ( error: any ) {
            return rejectWithValue( error.response?.data?.message || 'Failed to fetch movie details' );
        }
    }
);

interface MovieState {
    searchResults: MovieListItem[];
    favouriteMovies: MovieListItem[];
    selectedMovie: MovieDetail | null;
    fetchedMovies: { [key: string]: MovieDetail; };
    searchQuery: string;
    totalResults: string;
    isLoading: boolean;
    isLoadingDetail: boolean;
    error: string | null;
    searchHistory: string[];

}

const initialState: MovieState = {
    searchResults: [],
    favouriteMovies: loadFavouritesFromStorage(), // Load from localStorage on initialization
    selectedMovie: null,
    fetchedMovies: loadFetchedMoviesFromStorage(),
    searchQuery: '',
    totalResults: '0',
    isLoading: false,
    isLoadingDetail: false,
    error: null,
    searchHistory: loadSearchHistoryFromStorage(), // Load from localStorage on initialization
};

const movieSlice = createSlice( {
    name: 'movies',
    initialState,
    reducers: {
        setSearchQuery: ( state, action: PayloadAction<string> ) => {
            state.searchQuery = action.payload;
        },
        clearSearchResults: ( state ) => {
            state.searchResults = [];
            state.totalResults = '0';
            state.error = null;
        },
        clearSelectedMovie: ( state ) => {
            state.selectedMovie = null;
            state.error = null;
        },
        addToSearchHistory: ( state, action: PayloadAction<string> ) => {
            const query = action.payload.trim();
            if ( query && !state.searchHistory.includes( query ) ) {
                const updatedHistory = [query, ...state.searchHistory].slice( 0, 20 );
                state.searchHistory = updatedHistory;

                // Save to localStorage
                saveSearchHistoryToStorage( updatedHistory );
            }
        },
        clearError: ( state ) => {
            state.error = null;
        },
        addToFavourites: ( state, action: PayloadAction<MovieListItem> ) => {
            const movie = action.payload;
            const isAlreadyFavourite = state.favouriteMovies.some( fav => fav.imdbID === movie.imdbID );
            if ( !isAlreadyFavourite ) {
                // Add movie and sort by year
                const updatedFavourites = [...state.favouriteMovies, movie].sort( ( a, b ) =>
                    a.Year.localeCompare( b.Year )
                );
                state.favouriteMovies = updatedFavourites;

                // Save to localStorage
                saveFavouritesToStorage( updatedFavourites );
            }
        },
        removeFromFavourites: ( state, action: PayloadAction<string> ) => {
            const imdbID = action.payload;
            const updatedFavourites = state.favouriteMovies.filter( movie => movie.imdbID !== imdbID );
            state.favouriteMovies = updatedFavourites;

            // Save to localStorage
            saveFavouritesToStorage( updatedFavourites );
        },
        toggleFavourite: ( state, action: PayloadAction<MovieListItem> ) => {
            const movie = action.payload;
            const existingIndex = state.favouriteMovies.findIndex( fav => fav.imdbID === movie.imdbID );
            let updatedFavourites: MovieListItem[];

            if ( existingIndex >= 0 ) {
                // Remove from favourites
                updatedFavourites = state.favouriteMovies.filter( ( _, index ) => index !== existingIndex );
            } else {
                // Add to favourites and sort by year
                updatedFavourites = [...state.favouriteMovies, movie].sort( ( a, b ) =>
                    a.Year.localeCompare( b.Year )
                );
            }

            state.favouriteMovies = updatedFavourites;

            // Save to localStorage
            saveFavouritesToStorage( updatedFavourites );
        },
    },
    extraReducers: ( builder ) => {
        // Search movies
        builder
            .addCase( searchMovies.pending, ( state ) => {
                state.isLoading = true;
                state.error = null;
            } )
            .addCase( searchMovies.fulfilled, ( state, action ) => {
                state.isLoading = false;
                // Fix: Use capitalised Response and Search from API
                if ( action.payload.Response === 'True' ) {
                    // Remove duplicates based on imdbID
                    const uniqueMovies = action.payload.Search?.reduce( ( acc: MovieListItem[], movie: MovieListItem ) => {
                        const exists = acc.find( existingMovie => existingMovie.imdbID === movie.imdbID );
                        if ( !exists ) {
                            acc.push( movie );
                        }
                        return acc;
                    }, [] ) || [];

                    state.searchResults = uniqueMovies;
                    state.totalResults = uniqueMovies.length.toString();
                } else {
                    state.searchResults = [];
                    state.totalResults = '0';
                    state.error = 'No movies found';
                }
            } )
            .addCase( searchMovies.rejected, ( state, action ) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.searchResults = [];
                state.totalResults = '0';
            } );

        // Fetch movie detail
        builder
            .addCase( fetchMovieDetail.pending, ( state ) => {
                state.isLoadingDetail = true;
                state.error = null;
            } )
            .addCase( fetchMovieDetail.fulfilled, ( state, action ) => {
                state.isLoadingDetail = false;
                state.selectedMovie = action.payload;

                // Store in fetchedMovies cache
                state.fetchedMovies[action.payload.imdbID] = action.payload;

                // Save to localStorage
                saveFetchedMoviesToStorage( state.fetchedMovies );
            } )
            .addCase( fetchMovieDetail.rejected, ( state, action ) => {
                state.isLoadingDetail = false;
                state.error = action.payload as string;
                state.selectedMovie = null;
            } );
    },
} );

export const {
    setSearchQuery,
    clearSearchResults,
    clearSelectedMovie,
    addToSearchHistory,
    clearError,
    addToFavourites,
    removeFromFavourites,
    toggleFavourite,
} = movieSlice.actions;

export default movieSlice.reducer;