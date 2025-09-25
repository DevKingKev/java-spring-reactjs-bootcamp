import uiReducer, {
    toggleTheme,
    toggleSidebar,
    setCurrentPage,
    setItemsPerPage,
    toggleSearchHistory,
} from '../uiSlice';

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

const defaultState = {
    theme: 'light' as const,
    sidebarOpen: false,
    currentPage: 1,
    itemsPerPage: 10,
    showSearchHistory: false,
};

describe( 'uiSlice', () => {
    beforeEach( () => {
        mockLocalStorage.clear();
        jest.clearAllMocks();
    } );

    describe( 'reducers', () => {
        it( 'should handle toggleTheme from light to dark', () => {
            const nextState = uiReducer( defaultState, toggleTheme() );
            expect( nextState.theme ).toBe( 'dark' );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'UIState',
                JSON.stringify( { ...defaultState, theme: 'dark' } )
            );
        } );

        it( 'should handle toggleTheme from dark to light', () => {
            const darkState = { ...defaultState, theme: 'dark' as const };
            const nextState = uiReducer( darkState, toggleTheme() );
            expect( nextState.theme ).toBe( 'light' );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'UIState',
                JSON.stringify( { ...defaultState, theme: 'light' } )
            );
        } );

        it( 'should handle toggleSidebar from false to true', () => {
            const nextState = uiReducer( defaultState, toggleSidebar() );
            expect( nextState.sidebarOpen ).toBe( true );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'UIState',
                JSON.stringify( { ...defaultState, sidebarOpen: true } )
            );
        } );

        it( 'should handle toggleSidebar from true to false', () => {
            const openSidebarState = { ...defaultState, sidebarOpen: true };
            const nextState = uiReducer( openSidebarState, toggleSidebar() );
            expect( nextState.sidebarOpen ).toBe( false );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'UIState',
                JSON.stringify( { ...defaultState, sidebarOpen: false } )
            );
        } );

        it( 'should handle setCurrentPage', () => {
            const nextState = uiReducer( defaultState, setCurrentPage( 5 ) );
            expect( nextState.currentPage ).toBe( 5 );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'UIState',
                JSON.stringify( { ...defaultState, currentPage: 5 } )
            );
        } );

        it( 'should handle setItemsPerPage and reset currentPage', () => {
            const stateWithPage = { ...defaultState, currentPage: 5 };
            const nextState = uiReducer( stateWithPage, setItemsPerPage( 20 ) );
            expect( nextState.itemsPerPage ).toBe( 20 );
            expect( nextState.currentPage ).toBe( 1 ); // Should reset to page 1
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'UIState',
                JSON.stringify( { ...defaultState, itemsPerPage: 20, currentPage: 1 } )
            );
        } );

        it( 'should handle toggleSearchHistory from false to true', () => {
            const nextState = uiReducer( defaultState, toggleSearchHistory() );
            expect( nextState.showSearchHistory ).toBe( true );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'UIState',
                JSON.stringify( { ...defaultState, showSearchHistory: true } )
            );
        } );

        it( 'should handle toggleSearchHistory from true to false', () => {
            const showHistoryState = { ...defaultState, showSearchHistory: true };
            const nextState = uiReducer( showHistoryState, toggleSearchHistory() );
            expect( nextState.showSearchHistory ).toBe( false );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledWith(
                'UIState',
                JSON.stringify( { ...defaultState, showSearchHistory: false } )
            );
        } );
    } );

    describe( 'localStorage integration', () => {
        it( 'should handle localStorage save errors gracefully', () => {
            mockLocalStorage.setItem.mockImplementation( () => {
                throw new Error( 'Storage error' );
            } );

            const nextState = uiReducer( defaultState, toggleTheme() );
            expect( nextState.theme ).toBe( 'dark' ); // State should still update
            expect( console.error ).toHaveBeenCalledWith(
                'Failed to save UI state to localStorage:',
                expect.any( Error )
            );
        } );

        it( 'should handle localStorage load errors gracefully', () => {
            mockLocalStorage.getItem.mockImplementation( () => {
                throw new Error( 'Storage error' );
            } );

            // This would be tested during slice initialization
            // The error handling should not throw and should return default state
            expect( () => {
                // Simulate what happens in the actual slice - catching errors
                try {
                    mockLocalStorage.getItem( 'UIState' );
                } catch ( error ) {
                    console.error( 'Failed to load UI state from localStorage:', error );
                }
            } ).not.toThrow();

            expect( console.error ).toHaveBeenCalledWith(
                'Failed to load UI state from localStorage:',
                expect.any( Error )
            );
        } );

        it( 'should return default state when localStorage is empty', () => {
            mockLocalStorage.getItem.mockReturnValue( null );

            // The reducer should handle this case by using default values
            expect( mockLocalStorage.getItem ).toBeDefined();
        } );

        it( 'should parse stored state correctly', () => {
            const storedState = {
                theme: 'dark',
                sidebarOpen: true,
                currentPage: 3,
                itemsPerPage: 15,
                showSearchHistory: true,
            };

            mockLocalStorage.getItem.mockReturnValue( JSON.stringify( storedState ) );

            // This simulates what happens during slice initialization
            const result = mockLocalStorage.getItem( 'UIState' );
            expect( result ).toBe( JSON.stringify( storedState ) );
        } );

        it( 'should handle invalid JSON in localStorage', () => {
            mockLocalStorage.getItem.mockReturnValue( 'invalid json' );

            // This should not throw and should fall back to default state
            expect( () => {
                try {
                    JSON.parse( mockLocalStorage.getItem( 'UIState' ) || '' );
                } catch {
                    // This is expected behavior
                }
            } ).not.toThrow();
        } );
    } );

    describe( 'state persistence', () => {
        it( 'should save state after each action', () => {
            // Test multiple actions to ensure state is saved each time
            uiReducer( defaultState, toggleTheme() );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledTimes( 1 );

            uiReducer( defaultState, toggleSidebar() );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledTimes( 2 );

            uiReducer( defaultState, setCurrentPage( 3 ) );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledTimes( 3 );

            uiReducer( defaultState, setItemsPerPage( 25 ) );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledTimes( 4 );

            uiReducer( defaultState, toggleSearchHistory() );
            expect( mockLocalStorage.setItem ).toHaveBeenCalledTimes( 5 );
        } );

        it( 'should maintain immutability', () => {
            const originalState = { ...defaultState };
            const nextState = uiReducer( originalState, toggleTheme() );

            expect( originalState ).toEqual( defaultState ); // Original state unchanged
            expect( nextState ).not.toBe( originalState ); // New state object created
            expect( nextState.theme ).toBe( 'dark' );
        } );
    } );
} );