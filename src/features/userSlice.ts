import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {User} from "../entities/User.ts";
import type {RootState} from "../app/store.ts";
import type {LoginResultDto} from "../dto/loginResultDto.ts";
import {jwtDecode} from "jwt-decode";

const initialState: User = {
    sub: "",
    firstName: "",
    lastName: "",
    email: "",
    token: null,
    refreshToken: null
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
            state.token = action.payload.token
            state.refreshToken = action.payload.refreshToken
        },
        logout: () => {
        }

    }
})

export const {setUser} = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;