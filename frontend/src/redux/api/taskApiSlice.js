import apiSlice from "./apiSlice";
import { TASKS_URL } from "../constants";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `${TASKS_URL}/${taskId}`,
        method: "DELETE",
      }),
    }),
    getTaskDetails: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Task"],
    }),
    getAllTasks: builder.query({
      query: () => ({
        url: TASKS_URL,
      }),
      providesTags: ["Task"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  useGetTaskDetailsQuery,
  useGetAllTasksQuery,
} = taskApiSlice;
