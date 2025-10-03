import {useAppSelector} from "../app/hooks.ts";
import {selectIsAuth, setUser} from "../features/userSlice.ts";
import {Navigate, Outlet, useLocation} from "react-router";
import {useDispatch} from "react-redux";
import {useRefreshMutation} from "../api/accountApiSlice.ts";
import {useLayoutEffect, useRef, useState} from "react";
import Cookies from "js-cookie";
import type {ApiResult} from "../types/ApiResult.ts";
import type {LoginResultDto} from "../dto/loginResultDto.ts";
import {Spin} from "antd";

export function RequireAuthentication() {
    const location = useLocation();

    const dispatch = useDispatch();
    const [refreshToken] = useRefreshMutation();
    const [loading, setLoading] = useState(true);
    const isAuth = useAppSelector(selectIsAuth);
    const hasRun = useRef(false);
    useLayoutEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        const auth = async () => {
            if (!isAuth) {
                const token = Cookies.get("refreshToken");
                const sub = Cookies.get("sub");
                if (sub && token) {
                    const result: ApiResult<LoginResultDto> = await refreshToken({sub, refreshToken: token});
                    if (result.data?.succeeded) {

                        const response = result.data.value!;
                        dispatch(setUser({token: response.accessToken!, refreshToken: response.refreshToken}))
                    }
                }
            }
            setLoading(false);
        }
        auth();
    }, [isAuth, refreshToken, dispatch])

    return (
        loading ? <Spin tip={"Loading..."} fullscreen/> :
            isAuth ?
                <Outlet/> : <Navigate to={`/login?returnUrl=${location.pathname}`} state={{from: location}} replace/>
    )
}