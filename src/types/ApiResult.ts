import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import type {SerializedError} from "@reduxjs/toolkit";

export type ApiResult<T> =
    | { data: { success: boolean; value?: T | null; error?: string | null }; error?: undefined }
    | { data?: undefined; error: FetchBaseQueryError | SerializedError };