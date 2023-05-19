import { apiSlice } from "../api/apiSlice";
import { logOut, setCredentials } from './authSlice';

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        register: builder.mutation({
            query: credentials => ({
                url: '/auth/register',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        login: builder.mutation({
            query: credentials => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const { accessToken, user } = data;
                    dispatch(setCredentials({ accessToken, user }));
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        sendLogout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut());
                    localStorage.removeItem('firstLogin');
                    setTimeout(() => {
                        apiSlice.util.resetApiState();
                    }, 1000)
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useRefreshMutation,
    useSendLogoutMutation
} = authApiSlice;