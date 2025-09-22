import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MovieListItem, MovieDetail, MovieSearchResponse } from '../../types/movie.types';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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
    async ( imdbID: string, { rejectWithValue } ) => {
        try {
            const response = await axios.get<MovieDetail>( `${API_BASE_URL}/movies/${imdbID}` );
            return response.data;
        } catch ( error: any ) {
            return rejectWithValue( error.response?.data?.message || 'Failed to fetch movie details' );
        }
    }
);

interface MovieState {
    searchResults: MovieListItem[];
    selectedMovie: MovieDetail | null;
    searchQuery: string;
    totalResults: string;
    isLoading: boolean;
    isLoadingDetail: boolean;
    error: string | null;
    searchHistory: string[];
}

const initialState: MovieState = {
    searchResults: [],
    selectedMovie: null,
    searchQuery: '',
    totalResults: '0',
    isLoading: false,
    isLoadingDetail: false,
    error: null,
    searchHistory: [],
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
                state.searchHistory = [query, ...state.searchHistory].slice( 0, 10 );
            }
        },
        clearError: ( state ) => {
            state.error = null;
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
                    state.searchResults = action.payload.Search || [];
                    state.totalResults = action.payload.totalResults;
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
} = movieSlice.actions;

export default movieSlice.reducer;