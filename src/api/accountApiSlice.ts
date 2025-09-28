import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {LoginDto} from "../dto/loginDto.ts";

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: fetchBaseQuery({baseUrl: import.meta.env.VITE_API_BASE_URL + "account/"}),
    endpoints: builder => ({
        login: builder.mutation({
            query: (dto: LoginDto) => ({
                url: "login",
                method: "POST",
                body: dto
            })
        })
    })
})

export const {useLoginMutation} = accountApi;