import './App.css'
import {LoginPage} from "./pages/LoginPage.tsx";
import {HomePage} from "./pages/HomePage.tsx";
import {Route, Routes} from "react-router";
import {Layout} from "./components/Layout.tsx";
import {RequireAuth} from './components/RequireAuth.tsx';
import {LaboratoryPage} from "./pages/LaboratoryPage.tsx";
import {CategoryPage} from "./pages/CategoryPage.tsx";
import {MyQuizzesPage} from "./pages/MyQuizzesPage.tsx";
import {CreateQuizPage} from "./pages/CreateQuizPage.tsx";
import {QuizDetailsPage} from "./pages/QuizDetailsPage.tsx";
import QuizTakePage from "./pages/QuizTakePage.tsx";
import QuizResultList from "./components/QuizResultList.tsx";
import AdminQuizMonitor from "./components/AdminQuizMonitor.tsx";
import AdminPanel from "./components/AdminPanel.tsx";


function App() {


    return (
        <>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    {/* public routes */}
                    <Route path="login" element={<LoginPage/>}/>

                    {/* protected routes */}
                    <Route element={<RequireAuth/>}>
                        <Route path="/home" element={<HomePage/>}/>
                        <Route path="/admin" element={<AdminPanel/>}/>
                        <Route path="/quiz/:quizId" element={<QuizDetailsPage/>}/>
                        <Route path="/quiz/start/:quizId" element={<QuizTakePage />}/>
                        <Route path="/laboratory" element={<LaboratoryPage/>}>
                            {/* nested route */}
                                <Route index element={<MyQuizzesPage />}/>
                                <Route path="categories" element={<CategoryPage/>}/>
                                <Route path="results" element={<QuizResultList />}/>
                                <Route path="monitoring" element={<AdminQuizMonitor />}/>
                                <Route path="quizzes/new" element={<CreateQuizPage/>}/>
                                <Route path="quiz/edit/:id" element={<CategoryPage/>}/>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    )
}

export default App
