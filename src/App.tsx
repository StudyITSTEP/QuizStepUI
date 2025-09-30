import './App.css'
import {LoginPage} from "./pages/LoginPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router";
import {Layout} from "./components/Layout.tsx";
import {RequireAuth} from './components/RequireAuth.tsx';
import {useRefreshMutation} from "./api/accountApiSlice.ts";
import {useDispatch} from "react-redux";
import {useEffect, useRef} from "react";
import {useAppSelector} from "./app/hooks.ts";
import {selectIsAuth, setUser} from "./features/userSlice.ts";
import Cookies from "js-cookie";
import type {LoginResultDto} from "./dto/loginResultDto.ts";
import type {ApiResult} from "./types/ApiResult.ts";

function App() {
    const dispatch = useDispatch();
    const [refreshToken] = useRefreshMutation();
    const isAuth = useAppSelector(selectIsAuth);
    const hasRun = useRef(false);
    useEffect(() => {
        if(hasRun.current) return;
        hasRun.current = true;
        const auth = async () => {
            if (!isAuth) {
                const token = Cookies.get("refreshToken");
                const sub = Cookies.get("sub");
                if (sub && token) {
                    const result: ApiResult<LoginResultDto> = await refreshToken({sub, refreshToken: token}).unwrap();
                    console.log(result);
                    if (result.data?.succeeded) {
                        const response = result.data.value!;
                        dispatch(setUser({token: response.accessToken!, refreshToken: response.refreshToken}))

                    }
                }
            }
        }
        auth();
    }, [isAuth, refreshToken, dispatch])

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    {/*  public routes  */}
                    <Route path="/login" element={<LoginPage/>}/>
                    {/*  protected routes  */}
                    <Route element={<RequireAuth/>}>
                        <Route path="/home" element={<HomePage/>}/>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App
