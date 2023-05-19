import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from '../api/apiSlice';

const messageAdapter = createEntityAdapter();

const initialState = messageAdapter.getInitialState();

const messageApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMessages: builder.mutation({
            query: ({ userId }) => ({
                url: `/messages/${userId}`,
                method: 'GET'
            }),
            transformResponse: responseData => {
                const loadedMessages = responseData.messages.map(message => {
                    message.id = message._id
                    return message
                });
                return messageAdapter.setAll(initialState, loadedMessages)
            },
        })
    })
})

export const { useGetMessagesMutation } = messageApiSlice;

export const selectMessagesResult = messageApiSlice.endpoints.getMessages.select();

const selectMessagesData = createSelector(
    selectMessagesResult,
    messagesResult => messagesResult.data
)

export const {
    selectAll: selectAllMessages,
    selectById: selectMessageById,
    selectIds: selectMessageIds
} = messageAdapter.getSelectors(state => selectMessagesData(state) ?? initialState)