import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyapi.io/data/v1/",
    headers: {
      "app-id": "64fc4a747b1786417e354f31",
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 0, limit = 10 }) => `user?page=${page}&limit=${limit}`,
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: `user/create`,
        method: "POST",
        body,
      }),
    }),
    updateUser: builder.mutation({
      query: (id, body) => ({
        url: `user/${id}`,
        method: "PUT",
        body,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
    }),
    getUserById: builder.query({
      query: (id) => `user/${id}`,
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = apiSlice
