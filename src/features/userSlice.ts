import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {User} from "../entities/User.ts";
import type {RootState} from "../app/store.ts";
import type {LoginResultDto} from "../dto/loginResultDto.ts";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";


const initialState: User = {
    sub: "",
    firstName: "",
    lastName: "",
    email: "",
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    roles: [],
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<LoginResultDto>) => {
            console.log("user", action.payload);
            const decodeToken = jwtDecode<User>(action.payload.token)
            state.sub = decodeToken?.sub
            state.firstName = decodeToken?.firstName
            state.lastName = decodeToken?.lastName
            state.email = decodeToken?.email
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            state.roles.push(decodeToken?.roles)
            state.token = action.payload.token
            state.refreshToken = action.payload.refreshToken
            Cookies.set("refreshToken", action.payload.refreshToken!, {
                expires: 7,
            });
            Cookies.set("sub", state.sub, {
                expires: 7,
            });
            state.isAuthenticated = true
        },
        logout: () => {
            Cookies.remove("refreshToken");
            return initialState;
        }

    }
})

export const {setUser, logout} = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export const selectAccessToken = (state: RootState) => state.user.token;
export const selectIsAuth = (state: RootState) => state.user.isAuthenticated;
export default userSlice.reducer;