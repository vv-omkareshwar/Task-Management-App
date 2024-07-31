// store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { TypedUseSelectorHook } from 'react-redux';

// Define the state interface
interface AppState {
    triggerFetch: boolean;
}

// Define the initial state
const initialState: AppState = {
    triggerFetch: true,
};

// Create a slice for the app state
const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTriggerFetch(state, action: PayloadAction<boolean>) {
            state.triggerFetch = action.payload;
        },
    },
});

// Export the actions
export const { setTriggerFetch } = appSlice.actions;

// Configure the store
const store = configureStore({
    reducer: {
        app: appSlice.reducer,
    },
});

// Define types for the dispatch and selector hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks for dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
