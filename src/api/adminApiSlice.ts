import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserWithRolesDto } from "../dto/UserWithRolesDto.ts";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/admin/" }),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        getUsers: builder.query<UserWithRolesDto[], void>({
            query: () => "users",
            providesTags: ["Users"],
        }),
        setUserRole: builder.mutation<void, { userId: string; role: string }>({
            query: (body) => ({
                url: "set-role",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Users"],
        }),
        deleteUser: builder.mutation<void, string>({
            query: (userId) => ({
                url: `delete/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useSetUserRoleMutation,
    useDeleteUserMutation,
} = adminApi;