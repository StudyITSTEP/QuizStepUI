import './App.css'
import {LoginPage} from "./pages/LoginPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router";
import {Layout} from "./components/Layout.tsx";
import {RequireAuth} from './components/RequireAuth.tsx';
import {useRefreshMutation} from "./api/accountApiSlice.ts";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {useAppSelector} from "./app/hooks.ts";
import {selectIsAuth, setUser} from "./features/userSlice.ts";
import Cookies from "js-cookie";
import type {LoginResultDto} from "./dto/loginResultDto.ts";
import type {ApiResult} from "./types/ApiResult.ts";
// import QuizResultCard from "./components/QuizResultCard.tsx";
import QuizRersultList from "./pages/QuizRersultPage.tsx";

// import QuizCatalog from "./components/QuizCatalog.tsx";
// import type {QuizDto} from "./dto/QuizDto.ts";
// import QuizTakePage from "./pages/QuizTakePage.tsx";
// import type { QuestionDto } from "./dto/QuestionDto.ts";

function App() {
    const dispatch = useDispatch();
    const [refreshToken] = useRefreshMutation();
    const isAuth = useAppSelector(selectIsAuth);

    useEffect(() => {
        const auth = async () => {
            if (!isAuth) {
                const token = Cookies.get("refreshToken");
                const sub = Cookies.get("sub");
                if (sub && token) {
                    const result: ApiResult<LoginResultDto> = await refreshToken({sub, refreshToken: token});
                    console.log(result);
                    if (result.data?.succeeded) {
                        const response = result.data.value!;
                        dispatch(setUser({token: response.accessToken!, refreshToken: response.refreshToken}))
                    }
                }
            }
        }
        auth();
    }, [])

    // const quizzes: QuizDto[] = [
    //     {
    //         id: 1,
    //         name: "Основы C#",
    //         description: "Базовые концепции языка.",
    //         categoryId: 101,
    //         creatorId: 42,
    //         quizAccess: 0,
    //     },
    //     {
    //         id: 2,
    //         name: "Java Advanced",
    //         description: "Stream API, многопоточность и JVM.",
    //         categoryId: 102,
    //         creatorId: 99,
    //         quizAccess: 0,
    //     },
    //     {
    //         id: 3,
    //         name: "JavaScript Fundamentals",
    //         description: "ES6+, async/await, DOM API.",
    //         categoryId: 103,
    //         creatorId: 88,
    //         quizAccess: 0,
    //     },
    //     {
    //         id: 4,
    //         name: "JavaScript Fundamentals",
    //         description: "ES6+, async/await, DOM API.",
    //         categoryId: 103,
    //         creatorId: 88,
    //         quizAccess: 1,
    //     },{
    //         id: 5,
    //         name: "JavaScript Fundamentals",
    //         description: "ES6+, async/await, DOM API.",
    //         categoryId: 103,
    //         creatorId: 88,
    //         quizAccess: 0,
    //     },
    //     {
    //         id: 6,
    //         name: "JavaScript Fundamentals",
    //         description: "ES6+, async/await, DOM API.",
    //         categoryId: 103,
    //         creatorId: 88,
    //         quizAccess: 1,
    //     },
    //     {
    //         id: 7,
    //         name: "JavaScript Fundamentals",
    //         description: "ES6+, async/await, DOM API.",
    //         categoryId: 103,
    //         creatorId: 88,
    //         quizAccess: 1,
    //     },
    // ];

    // const handleStart = (quizId: number) => {
    //     alert(`Стартуем тест с id=${quizId}`);
    // };

    // const mockQuestions: QuestionDto[] = [
    //     {
    //         id: 1,
    //         text: "Что делает оператор '==' в C#?",
    //         quizId: 1,
    //         answers: [
    //             { id: 101, text: "Сравнивает ссылки на объекты" },
    //             { id: 102, text: "Сравнивает значения" },
    //             { id: 103, text: "Присваивает значение" },
    //         ],
    //     },
    //     {
    //         id: 2,
    //         text: "Что такое LINQ?",
    //         quizId: 1,
    //         answers: [
    //             { id: 201, text: "Язык запросов к БД" },
    //             { id: 202, text: "Система сборки мусора" },
    //             { id: 203, text: "Библиотека для работы с потоками" },
    //         ],
    //     },
    //     {
    //         id: 3,
    //         text: "Что такое LINQ?",
    //         quizId: 1,
    //         answers: [
    //             { id: 301, text: "Язык запросов к БД" },
    //             { id: 302, text: "Система сборки мусора" },
    //             { id: 303, text: "Библиотека для работы с потоками" },
    //         ],
    //     },
    //     {
    //         id: 4,
    //         text: "Что такое LINQ?",
    //         quizId: 1,
    //         answers: [
    //             { id: 401, text: "Язык запросов к БД" },
    //             { id: 402, text: "Система сборки мусора" },
    //             { id: 403, text: "Библиотека для работы с потоками" },
    //         ],
    //     },
    // ];
    //
    // const handleSubmit = (answers: Record<number, number>) => {
    //     console.log("Выбранные ответы:", answers);
    //     alert("Тест завершён. Ответы отправлены в консоль.");
    // };


    return (
        <>
            {/*<QuizCatalog quizzes={quizzes} onStart={handleStart} />*/}

            {/*<QuizTakePage*/}
            {/*    quizName="Основы C#"*/}
            {/*    questions={mockQuestions}*/}
            {/*    onSubmit={handleSubmit}*/}
            {/*/>*/}

            <QuizRersultList/>

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
