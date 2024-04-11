import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    names: [] // This array will store objects containing names and locations.
};

const nameSlice = createSlice({
    name: 'names',
    initialState,
    reducers: {
        // Reducer for adding a new name and location to the names array.
        // The action's payload should contain the name and location to be added.
        addName: (state, action) => {
            
            // Directly mutates the state thanks to Immer library used internally by Redux Toolkit.
            state.names.push({
                name: action.payload.name,
                location: action.payload.location
            });
        },
        // Reducer for clearing all names and locations from the state.
        clearAll: (state) => {
            state.names = [];
        }
    }
});

export const { addName, clearAll } = nameSlice.actions;

export default nameSlice.reducer;
