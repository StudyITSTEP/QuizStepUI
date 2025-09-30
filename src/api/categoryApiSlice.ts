import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./baseQuery.ts";
import type {Category} from "../entities/Category.ts";

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({
        categories: builder.query<Category[], void>({
            query: () => ({
                url: "category",
                method: "GET",
            })
        })
    })
})

export const {useCategoriesQuery} = categoryApi;
