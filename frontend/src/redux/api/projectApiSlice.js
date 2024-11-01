import apiSlice from "./apiSlice";
import { PROJECTS_URL } from "../constants";

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getAllProjects: builder.query({
      query: () => ({
        url: PROJECTS_URL,
      }),
      providesTags: ["Project"],
      keepUnusedDataFor: 5,
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/${projectId}`,
        method: "DELETE",
      }),
    }),
    getProjectDetails: builder.query({
      query: (id) => ({
        url: `${PROJECTS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useAddProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
  useGetProjectDetailsQuery,
  useGetAllProjectsQuery,
} = projectApiSlice;
