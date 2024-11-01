import apiSlice from "./apiSlice";
import { LABELS_URL } from "../constants";

export const labelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addLabel: builder.mutation({
      query: (data) => ({
        url: `${LABELS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getAllLabels: builder.query({
      query: () => ({
        url: LABELS_URL,
      }),
      providesTags: ["Label"],
      keepUnusedDataFor: 5,
    }),
    deleteLabel: builder.mutation({
      query: (labelId) => ({
        url: `${LABELS_URL}/${labelId}`,
        method: "DELETE",
      }),
    }),
    getLabelDetails: builder.query({
      query: (id) => ({
        url: `${LABELS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateLabel: builder.mutation({
      query: (data) => ({
        url: `${LABELS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Label"],
    }),
  }),
});

export const {
  useAddLabelMutation,
  useDeleteLabelMutation,
  useUpdateLabelMutation,
  useGetLabelDetailsQuery,
  useGetAllLabelsQuery,
} = labelApiSlice;
