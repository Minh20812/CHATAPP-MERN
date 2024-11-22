import apiSlice from "./apiSlice";
import { CONVERSATIONS_URL } from "../constants";

export const conversationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendConversation: builder.mutation({
      query: (data) => ({
        url: `${CONVERSATIONS_URL}/send`,
        method: "POST",
        body: data,
      }),
    }),

    getAllConversations: builder.query({
      query: () => ({
        url: `${CONVERSATIONS_URL}/conversations`,
      }),
      providesTags: ["Conversations"],
    }),

    deleteConversation: builder.mutation({
      query: (conversationId) => ({
        url: `${CONVERSATIONS_URL}/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useSendConversationMutation,
  useGetAllConversationsQuery,
  useDeleteConversationMutation,
} = conversationApiSlice;
