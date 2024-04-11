import { configureStore } from '@reduxjs/toolkit';
import nameReducer from '../reducers/nameReducer';

// Create a Redux store that holds the complete state tree of the app.
// 'configureStore' enhances the store with development tools and middleware by default.
const store = configureStore({
    // Here, the 'names' slice of the state is managed by 'nameReducer',
    // which handles actions defined in the nameReducer file.
    reducer: {
        names: nameReducer
    }
});

export default store;
