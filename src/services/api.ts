import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "/api" });

export const api = createApi({
  baseQuery,
  endpoints: () => ({}),
});
