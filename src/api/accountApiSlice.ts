import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {LoginDto} from "../dto/loginDto.ts";
import type {RegisterDto} from "../dto/registerDto.ts";
import type {User} from "../entities/User.ts";
import {setUser} from "../features/userSlice.ts";
import type {BaseQueryApi, FetchArgs} from "@reduxjs/toolkit/query";
import type {RootState} from "../app/store.ts";
import type {LoginResultDto} from "../dto/loginResultDto.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "account/",
    //credentials: 'include',
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as RootState).user?.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
            headers.set("Content-Type", "application/json")
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args: (string | FetchArgs), api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        console.log("sending refresh token");
        // send refresh token to get new access token
        const user: User = (api.getState() as RootState).user;
        if (!user.refreshToken) {
            return result;
        }
        const refreshResult = await baseQuery({
            url: "/refresh-token",
            method: "POST",
            body: JSON.stringify({RefreshToken: user.refreshToken, UserId: user.sub}),
        }, api, extraOptions);

        console.log("RESULT DATA", refreshResult);
        if (refreshResult?.data) {
            const response = refreshResult.data as LoginResultDto;
            api.dispatch(setUser({token: response.accessToken!, refreshToken: response.refreshToken}));

            result = await baseQuery(args, api, extraOptions);
        } else {
            //api.dispatch(logout())
        }
    }
    return result;
}

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        login: builder.mutation({
            query: (dto: LoginDto) => ({
                url: "login",
                method: "POST",
                body: dto
            })
        }),
        register: builder.mutation({
            query: (dto: RegisterDto) => ({
                url: "register",
                method: "POST",
                body: dto
            })
        })
    })
})

export const {useLoginMutation, useRegisterMutation} = accountApi;