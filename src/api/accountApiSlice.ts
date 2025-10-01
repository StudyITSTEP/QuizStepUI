import {createApi} from "@reduxjs/toolkit/query/react";
import type {LoginDto} from "../dto/loginDto.ts";
import type {RegisterDto} from "../dto/registerDto.ts";
import {baseQueryWithReauth} from "./baseQuery.ts";


export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        login: builder.mutation({
            query: (dto: LoginDto) => ({
                url: "account/login",
                method: "POST",
                body: dto
            })
        }),
        register: builder.mutation({
            query: (dto: RegisterDto) => ({
                url: "account/register",
                method: "POST",
                body: dto
            })
        }),
        refresh: builder.mutation({
            query: ({sub, refreshToken}: { sub: string, refreshToken: string }) => ({
                url: "account/refresh-token",
                method: "POST",
                body: {userId: sub, refreshToken}
            })
        })
    })
})

export const {useLoginMutation, useRegisterMutation, useRefreshMutation} = accountApi;