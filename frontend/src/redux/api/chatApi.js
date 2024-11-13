import apiSlice from "./apiSlice";
import { CHAT_URL } from "../constants";

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => ({
        url: CHAT_URL,
      }),
      providesTags: ["Chat"],
    }),
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `${CHAT_URL}/${conversationId}`,
      }),
      providesTags: (result, error, conversationId) => [
        result ? [{ type: "Chat", id: conversationId }] : [],
      ],
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, message }) => ({
        url: `${CHAT_URL}/${conversationId}`,
        method: "POST",
        body: message,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        result ? [{ type: "Chat", id: conversationId }] : [],
      ],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;
