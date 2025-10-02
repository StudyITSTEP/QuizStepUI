import {configureStore} from "@reduxjs/toolkit";
import {userSlice} from "../features/userSlice.ts";
import {accountApi} from "../api/accountApiSlice.ts";
import {categoryApi} from "../api/categoryApiSlice.ts";
import {quizApi} from "../api/quizApiSlice.ts";
import {quizResultApiSlice} from "../api/quizResultApiSlice.ts";


export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        [accountApi.reducerPath]: accountApi.reducer,

        [categoryApi.reducerPath]: categoryApi.reducer,

        [quizApi.reducerPath]: quizApi.reducer,

        [quizResultApiSlice.reducerPath]: quizResultApiSlice.reducer,
    },
    middleware:
        (getDefaultMiddleware) => getDefaultMiddleware()

            .concat(accountApi.middleware, categoryApi.middleware, quizApi.middleware, quizResultApiSlice.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;