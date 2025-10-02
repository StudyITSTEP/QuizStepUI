import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts";
import type {QuizResultDto} from "../dto/QuizResultDto.ts";
import type {SetQuizResultDto} from "../dto/SetQuizResultDto.ts";

export const quizResultApiSlice = createApi({
    reducerPath: "quizResultApiSlice",
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getUserResults: builder.query<QuizResultDto[], string>({
            query: (userId: string) => ({
                url: `QuizResult/results/${userId}`,
                method: "GET",
            }),
        }),
        submitResult: builder.mutation({
            query: (dto: SetQuizResultDto) => ({
                url: "QuizResult/set-result",
                method: "POST",
                body: dto
            })
        }),
        getResultByQuiz: builder.mutation({
            query: ({userId, quizId}: { userId: string, quizId: number }) => ({
                url: `QuizResult/result?userId=${userId}&quizId=${quizId}`,
                method: "GET"
            })
        })
    }),
});

export const {
    useGetUserResultsQuery,
    useSubmitResultMutation,
    useGetResultByQuizMutation
} = quizResultApiSlice;