import './App.css'
import {LoginPage} from "./pages/LoginPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import { Route, Routes} from "react-router";
import {Layout} from "./components/Layout.tsx";
import {RequireAuth} from './components/RequireAuth.tsx';
import {useRefreshMutation} from "./api/accountApiSlice.ts";
import {useDispatch} from "react-redux";
import {useLayoutEffect, useRef} from "react";
import {useAppSelector} from "./app/hooks.ts";
import {selectIsAuth, setUser} from "./features/userSlice.ts";
import Cookies from "js-cookie";
import type {LoginResultDto} from "./dto/loginResultDto.ts";
import type {ApiResult} from "./types/ApiResult.ts";

import QuizCatalog from "./components/QuizCatalog.tsx";
import type {QuizDto} from "./dto/QuizDto.tsx";

function App() {
    const dispatch = useDispatch();
    const [refreshToken] = useRefreshMutation();
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
        }
        auth();
    }, [isAuth, refreshToken, dispatch])

    const quizzes: QuizDto[] = [
        {
            id: 1,
            name: "Основы C#",
            description: "Базовые концепции языка.",
            categoryId: 101,
            creatorId: 42,
            quizAccess: 0,
        },
        {
            id: 2,
            name: "Java Advanced",
            description: "Stream API, многопоточность и JVM.",
            categoryId: 102,
            creatorId: 99,
            quizAccess: 0,
        },
        {
            id: 3,
            name: "JavaScript Fundamentals",
            description: "ES6+, async/await, DOM API.",
            categoryId: 103,
            creatorId: 88,
            quizAccess: 0,
        },
        {
            id: 4,
            name: "JavaScript Fundamentals",
            description: "ES6+, async/await, DOM API.",
            categoryId: 103,
            creatorId: 88,
            quizAccess: 1,
        },{
            id: 5,
            name: "JavaScript Fundamentals",
            description: "ES6+, async/await, DOM API.",
            categoryId: 103,
            creatorId: 88,
            quizAccess: 0,
        },
        {
            id: 6,
            name: "JavaScript Fundamentals",
            description: "ES6+, async/await, DOM API.",
            categoryId: 103,
            creatorId: 88,
            quizAccess: 1,
        },
        {
            id: 7,
            name: "JavaScript Fundamentals",
            description: "ES6+, async/await, DOM API.",
            categoryId: 103,
            creatorId: 88,
            quizAccess: 1,
        },
    ];

    const handleStart = (quizId: number) => {
        alert(`Стартуем тест с id=${quizId}`);
    };

    return (
        <>
            {/*{isAuth ? (<Navigate to="/login" replace/>) : <Navigate to={"/home"} />}*/}
            <QuizCatalog quizzes={quizzes} onStart={handleStart} />


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
