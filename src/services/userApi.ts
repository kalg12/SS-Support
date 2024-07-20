import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUsers: builder.query({
      query: () => "users",
    }),
  }),
});

export const { useLoginUserMutation, useGetUsersQuery } = userApi;
