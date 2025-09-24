import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const UI_STATE_KEY = 'UIState';

interface UiState {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    currentPage: number;
    itemsPerPage: number;
    showSearchHistory: boolean;
}

// Helper functions for localStorage
const saveUiStateToStorage = ( uiState: UiState ) => {
    try {
        localStorage.setItem( UI_STATE_KEY, JSON.stringify( uiState ) );
    } catch ( error ) {
        console.error( 'Failed to save UI state to localStorage:', error );
    }
};

const loadUiStateFromStorage = (): UiState => {
    try {
        const stored = localStorage.getItem( UI_STATE_KEY );
        if ( stored ) {
            return JSON.parse( stored );
        }
    } catch ( error ) {
        console.error( 'Failed to load UI state from localStorage:', error );
    }
    // Return default state if nothing found or error occurred
    return {
        theme: 'light',
        sidebarOpen: false,
        currentPage: 1,
        itemsPerPage: 10,
        showSearchHistory: false,
    };
};

const initialState: UiState = loadUiStateFromStorage();

const uiSlice = createSlice( {
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: ( state ) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            saveUiStateToStorage( state );
        },
        toggleSidebar: ( state ) => {
            state.sidebarOpen = !state.sidebarOpen;
            saveUiStateToStorage( state );
        },
        setCurrentPage: ( state, action: PayloadAction<number> ) => {
            state.currentPage = action.payload;
            saveUiStateToStorage( state );
        },
        setItemsPerPage: ( state, action: PayloadAction<number> ) => {
            state.itemsPerPage = action.payload;
            state.currentPage = 1; // Reset to first page when changing items per page
            saveUiStateToStorage( state );
        },
        toggleSearchHistory: ( state ) => {
            state.showSearchHistory = !state.showSearchHistory;
            saveUiStateToStorage( state );
        },
    },
} );

export const {
    toggleTheme,
    toggleSidebar,
    setCurrentPage,
    setItemsPerPage,
    toggleSearchHistory,
} = uiSlice.actions;

export default uiSlice.reducer;