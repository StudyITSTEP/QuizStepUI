import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts";
import type {RootState} from "../app/store.ts";
import type {QuizDto} from "../dto/QuizDto.tsx";
import type {FullQuizDto} from "../dto/FullQuizDto.ts";


export const quizApi = createApi({
    reducerPath: 'quizApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        getMyQuizzes: builder.query<QuizDto[], void>({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            async queryFn(_, api, opts) {
                const state = api.getState() as RootState;
                const sub = state.user.sub;
                const result = await baseQueryWithReauth(`quiz/my/${sub}`, api, opts);
                return {data: result.data}
            }
        }),
        createQuiz: builder.mutation({
            query: (dto: FullQuizDto) => ({
                url: "quiz",
                method: "POST",
                body: {quiz: dto}
            })
        })
    })
})

export const {useGetMyQuizzesQuery, useCreateQuizMutation} = quizApi;