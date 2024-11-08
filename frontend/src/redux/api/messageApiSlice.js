import apiSlice from "./apiSlice";
import { MESSAGES_URL } from "../constants";

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGES_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Message"],
    }),

    getMessages: builder.query({
      query: (conversationId) => ({
        url: `${MESSAGES_URL}/${conversationId}`,
      }),
      providesTags: ["Message"],
      keepUnusedDataFor: 5,
    }),
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `${MESSAGES_URL}/${messageId}`,
        method: "DELETE",
      }),
    }),
    updateMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGES_URL}/${data.messageId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Message"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} = messageApiSlice;
