import apiSlice from "./apiSlice";
import { MESSAGES_URL } from "../constants";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Gửi tin nhắn
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: "/api/messages/send",
        method: "POST",
        body: messageData,
        credentials: "include",
      }),
      // Xử lý lỗi
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || "Failed to send message",
        };
      },
      async onQueryStarted({ receiver }, { dispatch, queryFulfilled }) {
        try {
          const { data: newMessage } = await queryFulfilled;
          dispatch(
            chatApiSlice.util.updateQueryData(
              "getMessagesBetweenUsers",
              { user1: newMessage.sender, user2: receiver },
              (draft) => {
                if (!draft.find((msg) => msg._id === newMessage._id)) {
                  draft.push(newMessage);
                }
              }
            )
          );
        } catch (err) {
          console.error("Error updating cache:", err);
        }
      },
    }),

    getMessagesBetweenUsers: builder.query({
      query: ({ user1, user2 }) => ({
        url: `${MESSAGES_URL}/${user1}/${user2}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (response) => {
        return Array.isArray(response) ? response : [];
      },
      providesTags: (result = []) => [
        "Messages",
        ...result.map(({ _id }) => ({ type: "Message", id: _id })),
      ],
      keepUnusedDataFor: 0,
    }),

    // deleteMessages: builder.mutation({
    //   query: ({ user1, user2 }) => ({
    //     url: `/api/messages/${user1}/${user2}`,
    //     method: "DELETE",
    //   }),
    // }),

    deleteAllMessages: builder.mutation({
      query: ({ user1, user2 }) => ({
        url: `/api/messages/all/${user1}/${user2}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesBetweenUsersQuery,
  useGetAllConversationsQuery,
  useDeleteMessageMutation,
  useDeleteAllMessagesMutation,
} = chatApiSlice;
