import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {RootState} from "../app/store.ts";
import type {BaseQueryApi, FetchArgs} from "@reduxjs/toolkit/query";
import type {User} from "../entities/User.ts";
import Cookies from "js-cookie";
import type {LoginResultDto} from "../dto/loginResultDto.ts";
import {logout, setUser} from "../features/userSlice.ts";

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

export const baseQueryWithReauth = async (args: (string | FetchArgs), api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result?.error?.status === 401) {
        // send refresh token to get new access token
        const user: User = (api.getState() as RootState).user;
        let refreshToken: string | undefined = "";
        if (!user.refreshToken) {
            refreshToken = Cookies.get("refreshToken");
            if (!refreshToken) {
                return result;
            }
        }else{
            refreshToken = user.refreshToken;
        }
        console.log(refreshToken);
        const refreshResult = await baseQuery({
            url: "/refresh-token",
            method: "POST",
            body: JSON.stringify({RefreshToken: refreshToken, UserId: user.sub}),
            headers: {
                "Content-Type": "application/json",
            }
        }, api, extraOptions);

        if (refreshResult?.data) {
            const response = refreshResult.data as LoginResultDto;
            api.dispatch(setUser({token: response.accessToken!, refreshToken: response.refreshToken}));

            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout())
        }
    }
    return result;
}