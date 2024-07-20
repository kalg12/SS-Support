import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    createUser: builder.mutation({
      query: (user) => ({
        url: "users/create",
        method: "POST",
        body: user,
      }),
    }),
  }),
});

export const { useLoginUserMutation, useCreateUserMutation } = userApi;
