import {configureStore} from "@reduxjs/toolkit";
import {userSlice} from "../features/userSlice.ts";
import {accountApi} from "../api/accountApiSlice.ts";
import {quizApi} from "../api/quizApi.ts";

export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [quizApi.reducerPath]: quizApi.reducer,
    },
    middleware:
        (getDefaultMiddleware) => getDefaultMiddleware()
            .concat(accountApi.middleware)
            .concat(quizApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;