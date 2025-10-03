import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts";
import type {FullQuizDto} from "../dto/FullQuizDto.ts";
import type {Result} from "../types/ApiResult.ts";
import type {QuizDetailsDto} from "../dto/QuizDetailsDto.ts";


export const quizApi = createApi({
    reducerPath: 'quizApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        getMyQuizzes: builder.query<QuizDetailsDto[], string>({
            query: (userId: string) => ({
                url: `quiz/my/${userId}`,
                method: "GET"
            }),
        }),
    createQuiz: builder.mutation({
        query: (dto: FullQuizDto) => ({
            url: "quiz",
            method: "POST",
            body: {quiz: dto},
        })
    }),
    getAllQuizzes: builder.query<QuizDetailsDto[], void>({
        query: () => ({
            url: "quiz",
            method: "GET",
        })
    }),
    getQuizById: builder.mutation({
        query: ({id, accessCode}: {
            id?: number | undefined, accessCode?: string | null
        }) => ({
            url: `quiz/getById`,
            method: "POST",
            body: {accessCode, id}, // 👈 JSON object
        })
    }),
    getQuizDetails: builder.query<Result<QuizDetailsDto>, number>({
        query: (id: number) => ({
            url: `quiz/details/${id}`,
            method: "GET",
        })
    }),
    deleteQuiz: builder.mutation({
        query: (id: number) => ({
            url: `quiz/${id}`,
            method: "DELETE"
        })
    }),
    updateQuiz: builder.mutation({
        query: (dto: FullQuizDto) => ({
            url: `quiz/${dto.id}`,
            method: "PUT",
            body: { quiz: dto },
        }),
    }),
    })
})

export const {
    useGetMyQuizzesQuery,
    useGetAllQuizzesQuery,
    useGetQuizByIdMutation,
    useCreateQuizMutation,
    useGetQuizDetailsQuery,
    useDeleteQuizMutation,
    useUpdateQuizMutation,
} = quizApi;