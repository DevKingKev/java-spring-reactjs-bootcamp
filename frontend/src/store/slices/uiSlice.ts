import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    currentPage: number;
    itemsPerPage: number;
    showSearchHistory: boolean;
}

const initialState: UiState = {
    theme: 'light',
    sidebarOpen: false,
    currentPage: 1,
    itemsPerPage: 10,
    showSearchHistory: false,
};

const uiSlice = createSlice( {
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: ( state ) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        toggleSidebar: ( state ) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setCurrentPage: ( state, action: PayloadAction<number> ) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: ( state, action: PayloadAction<number> ) => {
            state.itemsPerPage = action.payload;
            state.currentPage = 1; // Reset to first page when changing items per page
        },
        toggleSearchHistory: ( state ) => {
            state.showSearchHistory = !state.showSearchHistory;
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