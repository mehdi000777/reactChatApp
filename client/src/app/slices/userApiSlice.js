import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from '../api/apiSlice';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState();

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/messages/users',
            transformResponse: responseData => {
                const loadedUsers = responseData.users.map(user => {
                    user.id = user._id
                    return user
                });
                return userAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        })
    })
})

export const { useGetUsersQuery } = userApiSlice;

export const selectUsersResult = userApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = userAdapter.getSelectors(state => selectUsersData(state) ?? initialState)