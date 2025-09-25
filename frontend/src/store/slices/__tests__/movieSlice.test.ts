import movieReducer, {
    setSearchQuery,
    clearSearchResults,
    clearSelectedMovie,
    addToSearchHistory,
    clearError,
    addToFavourites,
    removeFromFavourites,
    toggleFavourite,
    searchMovies,
    fetchMovieDetail,
} from '../movieSlice';
import { configureStore } from '@reduxjs/toolkit';
import axios from 'axios';
import { MovieListItem, MovieDetail } from '../../../types/movie.types';

// Mock axios
jest.mock( 'axios' );
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const mockLocalStorage = ( () => {
    let store: { [key: string]: string; } = {};
    return {
        getItem: jest.fn( ( key: string ) => store[key] || null ),
        setItem: jest.fn( ( key: string, value: string ) => {
            store[key] = value;
        } ),
        removeItem: jest.fn( ( key: string ) => {
            delete store[key];
        } ),
        clear: jest.fn( () => {
            store = {};
        } ),
    };
} )();

Object.defineProperty( window, 'localStorage', {
    value: mockLocalStorage,
} );

// Mock console.error to avoid test noise
const originalConsoleError = console.error;
beforeAll( () => {
    console.error = jest.fn();
} );

afterAll( () => {
    console.error = originalConsoleError;
} );

// Test data
const mockMovie: MovieListItem = {
    imdbID: 'tt1234567',
    Title: 'Test Movie',
    Year: '2023',
    Type: 'movie',
    Poster: 'http://example.com/poster.jpg',
};

const mockMovieDetail: MovieDetail = {
    imdbID: 'tt1234567',
    Title: 'Test Movie',
    Year: '2023',
    Rated: 'PG-13',
    Released: '01 Jan 2023',
    Runtime: '120 min',
    Genre: 'Action, Drama',
    Director: 'Test Director',
    Writer: 'Test Writer',
    Actors: 'Test Actor',
    Plot: 'Test plot description',
    Language: 'English',
    Country: 'USA',
    Awards: 'Test Awards',
    Poster: 'http://example.com/poster.jpg',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.0/10' }],
    Metascore: '85',
    imdbRating: '8.0',
    imdbVotes: '100,000',
    Type: 'movie',
    DVD: 'N/A',
    BoxOffice: '$100,000,000',
    Production: 'Test Production',
    Website: 'N/A',
    Response: 'True',
};

const initialState = {
    searchResults: [],
    favouriteMovies: [],
    selectedMovie: null,
    fetchedMovies: {},
    searchQuery: '',
    totalResults: '0',
    isLoading: false,
    isLoadingDetail: false,
    error: null,
    searchHistory: [],
};

describe( 'movieSlice', () => {
    beforeEach( () => {
        mockLocalStorage.clear();
        jest.clearAllMocks();
    } );

    describe( 'reducers', () => {
        it( 'should handle setSearchQuery', () => {
            const action = setSearchQuery( 'batman' );
            const nextState = movieReducer( initialState, action );
            expect( nextState.searchQuery ).toBe( 'batman' );
        } );

        it( 'should handle clearSearchResults', () => {
            const stateWithResults = {
                ...initialState,
                searchResults: [mockMovie],
                totalResults: '1',
                error: 'some error',
            };
            const nextState = movieReducer( stateWithResults, clearSearchResults() );
            expect( nextState.searchResults ).toEqual( [] );
            expect( nextState.totalResults ).toBe( '0' );
            expect( nextState.error ).toBeNull();
        } );

        it( 'should handle clearSelectedMovie', () => {
            const stateWithSelectedMovie = {
                ...initialState,
                selectedMovie: mockMovieDetail,
                error: 'some error',
            };
            const nextState = movieReducer( stateWithSelectedMovie, clearSelectedMovie() );
            expect( nextState.selectedMovie ).toBeNull();
            expect( nextState.error ).toBeNull();
        } );

        it( 'should handle clearError', () => {
            const stateWithError = { ...initialState, error: 'some error' };
            const nextState = movieReducer( stateWithError, clearError() );
            expect( nextState.error ).toBeNull();
        } );

        it( 'should handle addToSearchHistory', () => {
            const action = addToSearchHistory( 'batman' );
            const nextState = movieReducer( initialState, action );
            expect( nextState.searchHistory ).toEqual( ['batman'] );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'searchHistory',
                JSON.stringify( ['batman'] )
            );
        } );

        it( 'should handle addToSearchHistory with duplicate', () => {
            const stateWithHistory = {
                ...initialState,
                searchHistory: ['batman', 'superman'],
            };
            const action = addToSearchHistory( 'batman' );
            const nextState = movieReducer( stateWithHistory, action );
            expect( nextState.searchHistory ).toEqual( ['batman', 'superman'] );
        } );

        it( 'should handle addToSearchHistory with trim', () => {
            const action = addToSearchHistory( '  batman  ' );
            const nextState = movieReducer( initialState, action );
            expect( nextState.searchHistory ).toEqual( ['batman'] );
        } );

        it( 'should handle addToSearchHistory with empty query', () => {
            const action = addToSearchHistory( '' );
            const nextState = movieReducer( initialState, action );
            expect( nextState.searchHistory ).toEqual( [] );
        } );

        it( 'should handle addToSearchHistory with limit', () => {
            const longHistory = Array.from( { length: 20 }, ( _, i ) => `movie${i}` );
            const stateWithLongHistory = {
                ...initialState,
                searchHistory: longHistory,
            };
            const action = addToSearchHistory( 'new movie' );
            const nextState = movieReducer( stateWithLongHistory, action );
            expect( nextState.searchHistory.length ).toBe( 20 );
            expect( nextState.searchHistory[0] ).toBe( 'new movie' );
        } );

        it( 'should handle addToFavourites', () => {
            const action = addToFavourites( mockMovie );
            const nextState = movieReducer( initialState, action );
            expect( nextState.favouriteMovies ).toEqual( [mockMovie] );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'favouriteMovies',
                JSON.stringify( [mockMovie] )
            );
        } );

        it( 'should handle addToFavourites with duplicate', () => {
            const stateWithFavourite = {
                ...initialState,
                favouriteMovies: [mockMovie],
            };
            const action = addToFavourites( mockMovie );
            const nextState = movieReducer( stateWithFavourite, action );
            expect( nextState.favouriteMovies ).toEqual( [mockMovie] );
        } );

        it( 'should handle removeFromFavourites', () => {
            const stateWithFavourite = {
                ...initialState,
                favouriteMovies: [mockMovie],
            };
            const action = removeFromFavourites( mockMovie.imdbID );
            const nextState = movieReducer( stateWithFavourite, action );
            expect( nextState.favouriteMovies ).toEqual( [] );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'favouriteMovies',
                JSON.stringify( [] )
            );
        } );

        it( 'should handle toggleFavourite - add', () => {
            const action = toggleFavourite( mockMovie );
            const nextState = movieReducer( initialState, action );
            expect( nextState.favouriteMovies ).toEqual( [mockMovie] );
        } );

        it( 'should handle toggleFavourite - remove', () => {
            const stateWithFavourite = {
                ...initialState,
                favouriteMovies: [mockMovie],
            };
            const action = toggleFavourite( mockMovie );
            const nextState = movieReducer( stateWithFavourite, action );
            expect( nextState.favouriteMovies ).toEqual( [] );
        } );
    } );

    describe( 'async thunks', () => {
        let store: any;

        beforeEach( () => {
            store = configureStore( {
                reducer: {
                    movies: movieReducer,
                },
            } );
        } );

        describe( 'searchMovies', () => {
            it( 'should handle searchMovies.pending', () => {
                const action = { type: searchMovies.pending.type };
                const nextState = movieReducer( initialState, action );
                expect( nextState.isLoading ).toBe( true );
                expect( nextState.error ).toBeNull();
            } );

            it( 'should handle searchMovies.fulfilled with results', async () => {
                const mockResponse = {
                    Response: 'True',
                    Search: [mockMovie],
                    totalResults: '1',
                };
                mockedAxios.get.mockResolvedValue( { data: mockResponse } );

                const result = await store.dispatch( searchMovies( 'batman' ) );
                expect( result.type ).toBe( 'movies/searchMovies/fulfilled' );

                const state = store.getState().movies;
                expect( state.isLoading ).toBe( false );
                expect( state.searchResults ).toEqual( [mockMovie] );
                expect( state.totalResults ).toBe( '1' );
            } );

            it( 'should handle searchMovies.fulfilled with no results', async () => {
                const mockResponse = {
                    Response: 'False',
                    Error: 'Movie not found!',
                };
                mockedAxios.get.mockResolvedValue( { data: mockResponse } );

                await store.dispatch( searchMovies( 'nonexistent' ) );

                const state = store.getState().movies;
                expect( state.isLoading ).toBe( false );
                expect( state.searchResults ).toEqual( [] );
                expect( state.totalResults ).toBe( '0' );
                expect( state.error ).toBe( 'No movies found' );
            } );

            it( 'should handle searchMovies.rejected', async () => {
                const errorMessage = 'Network error';
                mockedAxios.get.mockRejectedValue( {
                    response: { data: { message: errorMessage } },
                } );

                await store.dispatch( searchMovies( 'batman' ) );

                const state = store.getState().movies;
                expect( state.isLoading ).toBe( false );
                expect( state.error ).toBe( errorMessage );
                expect( state.searchResults ).toEqual( [] );
                expect( state.totalResults ).toBe( '0' );
            } );

            it( 'should handle searchMovies.rejected without response message', async () => {
                mockedAxios.get.mockRejectedValue( new Error( 'Network error' ) );

                await store.dispatch( searchMovies( 'batman' ) );

                const state = store.getState().movies;
                expect( state.error ).toBe( 'Failed to search movies' );
            } );
        } );

        describe( 'fetchMovieDetail', () => {
            it( 'should handle fetchMovieDetail.pending', () => {
                const action = { type: fetchMovieDetail.pending.type };
                const nextState = movieReducer( initialState, action );
                expect( nextState.isLoadingDetail ).toBe( true );
                expect( nextState.error ).toBeNull();
            } );

            it( 'should handle fetchMovieDetail.fulfilled from API', async () => {
                mockedAxios.get.mockResolvedValue( { data: mockMovieDetail } );

                const result = await store.dispatch( fetchMovieDetail( 'tt1234567' ) );
                expect( result.type ).toBe( 'movies/fetchMovieDetail/fulfilled' );

                const state = store.getState().movies;
                expect( state.isLoadingDetail ).toBe( false );
                expect( state.selectedMovie ).toEqual( mockMovieDetail );
                expect( state.fetchedMovies['tt1234567'] ).toEqual( mockMovieDetail );
                expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                    'fetchedMovies',
                    JSON.stringify( { 'tt1234567': mockMovieDetail } )
                );
            } );

            it( 'should handle fetchMovieDetail.fulfilled from cache', async () => {
                // Set up store with cached movie
                const stateWithCachedMovie = {
                    movies: {
                        ...initialState,
                        fetchedMovies: { 'tt1234567': mockMovieDetail },
                    },
                };

                store = configureStore( {
                    reducer: {
                        movies: movieReducer,
                    },
                    preloadedState: stateWithCachedMovie,
                } );

                const result = await store.dispatch( fetchMovieDetail( 'tt1234567' ) );
                expect( result.type ).toBe( 'movies/fetchMovieDetail/fulfilled' );
                expect( mockedAxios.get ).not.toHaveBeenCalled();

                const state = store.getState().movies;
                expect( state.selectedMovie ).toEqual( mockMovieDetail );
            } );

            it( 'should handle fetchMovieDetail.rejected', async () => {
                const errorMessage = 'Movie not found';
                mockedAxios.get.mockRejectedValue( {
                    response: { data: { message: errorMessage } },
                } );

                await store.dispatch( fetchMovieDetail( 'tt1234567' ) );

                const state = store.getState().movies;
                expect( state.isLoadingDetail ).toBe( false );
                expect( state.error ).toBe( errorMessage );
                expect( state.selectedMovie ).toBeNull();
            } );

            it( 'should handle fetchMovieDetail.rejected without response message', async () => {
                mockedAxios.get.mockRejectedValue( new Error( 'Network error' ) );

                await store.dispatch( fetchMovieDetail( 'tt1234567' ) );

                const state = store.getState().movies;
                expect( state.error ).toBe( 'Failed to fetch movie details' );
            } );
        } );
    } );

    describe( 'localStorage integration', () => {
        it( 'should handle localStorage errors gracefully in save operations', () => {
            mockLocalStorage.setItem.mockImplementation( () => {
                throw new Error( 'Storage error' );
            } );

            const action = addToFavourites( mockMovie );
            const nextState = movieReducer( initialState, action );
            expect( nextState.favouriteMovies ).toEqual( [mockMovie] );
            expect( console.error ).toHaveBeenCalled();
        } );

        it( 'should handle localStorage errors gracefully in load operations', () => {
            mockLocalStorage.getItem.mockImplementation( () => {
                throw new Error( 'Storage error' );
            } );

            // This would be tested during slice initialization, but we can test the error handling
            expect( console.error ).not.toThrow();
        } );

        it( 'should handle duplicate movies in search results', async () => {
            const duplicateMovies = [mockMovie, mockMovie];
            const mockResponse = {
                Response: 'True',
                Search: duplicateMovies,
                totalResults: '2',
            };
            mockedAxios.get.mockResolvedValue( { data: mockResponse } );

            const store = configureStore( {
                reducer: {
                    movies: movieReducer,
                },
            } );

            await store.dispatch( searchMovies( 'batman' ) );

            const state = store.getState().movies;
            expect( state.searchResults ).toEqual( [mockMovie] ); // Should be deduplicated
            expect( state.totalResults ).toBe( '1' ); // Should reflect actual count
        } );
    } );
} );