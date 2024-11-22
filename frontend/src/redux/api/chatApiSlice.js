import apiSlice from "./apiSlice";
import { MESSAGES_URL } from "../constants";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Gửi tin nhắn
    sendMessage: builder.mutation({
      query: (data) => ({
        url: `${MESSAGES_URL}/send`,
        method: "POST",
        body: data,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
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
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesBetweenUsersQuery,
  useGetAllConversationsQuery,
  useDeleteMessageMutation,
} = chatApiSlice;
