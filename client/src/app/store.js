import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import authSlice from './slices/authSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authSlice
    },
    middleware: (getDefaulMiddleware) => getDefaulMiddleware().concat(apiSlice.middleware),
    devTools: true
});

setupListeners(store.dispatch);

export default store;