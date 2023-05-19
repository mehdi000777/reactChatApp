import { createSlice } from "@reduxjs/toolkit";


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null
    },
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        logOut: (state, action) => {
            state.token = null;
            state.user = null;
        }
    }
})

export const selectCurrentToken = (state) => state.auth.token;

export const selectCurrentUser = (state) => state.auth.user;

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;