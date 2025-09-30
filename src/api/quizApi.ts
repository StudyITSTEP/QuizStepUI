import { createApi } from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts";
import type {QuizResultDto} from "../dto/QuizResultDto.ts";

export const quizApi = createApi({
    reducerPath: "quizApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUserResults: builder.query<QuizResultDto[], string>({
            query: (userId: string) => ({
                url: `quizresult/${userId}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetUserResultsQuery } = quizApi;