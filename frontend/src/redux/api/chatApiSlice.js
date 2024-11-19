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
      }),
      // Tự động cập nhật cache sau khi gửi tin nhắn
      async onQueryStarted({ receiverId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newMessage } = await queryFulfilled;
          // Cập nhật cache của cuộc trò chuyện
          dispatch(
            chatApiSlice.util.updateQueryData(
              "getMessagesBetweenUsers",
              receiverId,
              (draft) => {
                draft.push(newMessage);
              }
            )
          );
        } catch {}
      },
    }),

    // Lấy tin nhắn giữa 2 người dùng
    getMessagesBetweenUsers: builder.query({
      query: ({ user1, user2 }) => ({
        url: `${MESSAGES_URL}/${user1}/${user2}`,
      }),
      providesTags: ["Messages"],
      // Thời gian cache
      keepUnusedDataFor: 0, // Không cache để luôn lấy tin nhắn mới nhất
    }),

    // Lấy tất cả cuộc hội thoại
    getAllConversations: builder.query({
      query: () => ({
        url: `${MESSAGES_URL}/conversations`,
      }),
      providesTags: ["Conversations"],
    }),

    // Xóa tin nhắn
    deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `${MESSAGES_URL}/${messageId}`,
        method: "DELETE",
      }),
      // Cập nhật cache sau khi xóa
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesBetweenUsersQuery,
  useGetAllConversationsQuery,
  useDeleteMessageMutation,
} = chatApiSlice;
