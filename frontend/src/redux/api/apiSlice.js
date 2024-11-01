import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Task"],
  endpoints: () => ({}),
});

export default apiSlice; // Ensure this is the default export
