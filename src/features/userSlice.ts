import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {User} from "../entities/User.ts";
import type {RootState} from "../app/store.ts";
import type {LoginResultDto} from "../dto/loginResultDto.ts";

const initialState: User = {
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
            // TODO: decode jwt token to User entity
            console.log("Redux: ",action, state)
        },

    }
})

export const {setUser} = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;