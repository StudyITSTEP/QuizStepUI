import { createApi } from "@reduxjs/toolkit/query/react";
import type { UserWithRolesDto } from "../dto/UserWithRolesDto.ts";
import {baseQueryWithReauth} from "./baseQuery.ts";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        getUsers: builder.query<UserWithRolesDto[], void>({
            query: () => ({
                url: "admin/users",
                method: "GET"
            }),
        }),
        setUserRole: builder.mutation<void, { userId: string; roles: string[] }>({
            query: (body) => ({
                url: "admin/set-roles",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Users"],
        }),
        deleteUser: builder.mutation<void, string>({
            query: (userId) => ({
                url: `admin/delete/${userId}`,
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