import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts";
import type {UserDetailsDto} from "../dto/UserDetailsDto.ts";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        getUserDetails: builder.query<UserDetailsDto, string>({
            query: (userId: string) => ({
                url: `user/details/${userId}`,
                method: "GET",
            })
        }),
    })
})


export const {
    useGetUserDetailsQuery
} = userApi;