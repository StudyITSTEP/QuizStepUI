import type {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import type {SerializedError} from "@reduxjs/toolkit";
import type {CustomError} from "./CustomError.ts";

export type Result<T> = {
    succeeded: boolean;
    value?: T | null;
    error? : CustomError
}

export type ApiResult<T> = Result<T>
    | { data: { succeeded: boolean; value?: T | null; error?: string | null }; error?: undefined }
    | { data?: undefined; error: FetchBaseQueryError | SerializedError }
